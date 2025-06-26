// hooks/useArticleFilterLogic.js
import { useState, useEffect } from 'react';
import { useCartStore } from '../stores/useCartStore';
import axios from 'axios';

const useArticleFilter = () => {
  const { addToCart } = useCartStore();

  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);

  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [color, setColor] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Chargement des articles depuis l'API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pamoja/api/articles/getAllArticles');
        setItems(response.data);
      } catch (err) {
        console.error("Erreur axios :", err);
        setError('Erreur lors du chargement des articles');
      }
    };

    fetchItems();
  }, []);

  // Filtrage automatique en fonction des critères
  useEffect(() => {
    handleFilter();
  }, [category, minPrice, maxPrice, color, items]);

  // Fonction de filtrage
  const handleFilter = () => {
    const filtered = items.filter(item => {
      const matchCategory = category ? item.subCategory?.toLowerCase().trim() === category.toLowerCase().trim() : true;
      const matchMinPrice = minPrice ? item.sellingPrice >= parseFloat(minPrice) : true;
      const matchMaxPrice = maxPrice ? item.sellingPrice <= parseFloat(maxPrice) : true;
      const matchColor = color
        ? Array.isArray(item.color) && item.color.some(c => c.colorName?.toLowerCase() === color.toLowerCase())
        : true;

      return matchCategory && matchMinPrice && matchMaxPrice && matchColor;
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  // Scan de code-barres
  const handleBarcodeScan = (e) => {
    if (e.key === 'Enter') {
      const scanned = items.find(item => item.barcode === barcodeInput.trim());
      if (scanned) {
        addToCart(scanned);
        setBarcodeInput('');
      } else {
        alert("Article non trouvé !");
      }
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return {
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    color,
    setColor,
    barcodeInput,
    setBarcodeInput,
    handleBarcodeScan,
    filteredItems,
    currentItems,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    addToCart,
    error, // ➕ maintenant retourné
  };
};

export default useArticleFilter;
