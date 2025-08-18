import React from 'react';
import { getCurrencySymbol } from '../utils/currency';
import useArticleFilter from '../hooks/useArticleFilter';
import Button from '../components/ui/Button';
import { ShoppingCart } from 'lucide-react';

const ArticleFilterPanel = () => {
  const {
    category, setCategory,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    color, setColor,
    barcodeInput, setBarcodeInput,
    handleBarcodeScan,
    currentItems,
    filteredItems,
    currentPage, setCurrentPage,
    totalPages,
    addToCart
  } = useArticleFilter();

  const currency = getCurrencySymbol();
  return (
    <div className="p-6 font-golos scrollbar-hide">
      {/* Filtres */}
      <div className="sticky top-10 flex flex-wrap gap-4 items-end mb-6 justify-between">
        {/* Catégorie */}
        <div className="flex flex-col">
          <label className="text-sm">Catégorie</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border px-3 py-2 rounded-md outline-none">
            <option value="">Toutes</option>
            <option value="clothing">Clothing</option>
            <option value="footwear">Footwear</option>
            <option value="outerwear">Outerwear</option>
            <option value="accessories">Accessories</option>
            <option value="bags">Bags</option>
          </select>
        </div>

        {/* Prix min */}
        <div className="flex flex-col">
          <label className="text-sm">Prix min ({currency})</label>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="border px-3 py-2 rounded-md outline-none" placeholder="0" />
        </div>

        {/* Prix max */}
        <div className="flex flex-col">
          <label className="text-sm">Prix max ({currency})</label>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="border px-3 py-2 rounded-md outline-none" placeholder="500" />
        </div>

        {/* Couleur */}
        <div className="flex flex-col">
          <label className="text-sm">Couleur</label>
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="border px-3 py-2 rounded-md outline-none" placeholder="Ex: Black" />
        </div>

        {/* Code-barres */}
        <div className="flex flex-col">
          <label className="text-sm">Code-barres</label>
          <input type="text" value={barcodeInput} onChange={(e) => setBarcodeInput(e.target.value)} onKeyDown={handleBarcodeScan} className="border px-3 py-2 rounded-md outline-none" placeholder="Scannez et appuyez sur Entrée" />
        </div>
      </div>

      {/* Affichage des articles */}
      <div className="flex flex-wrap justify-center items-center gap-10">
        {currentItems.length > 0 ? (
          currentItems.map(item => (
            <div key={item.id} className={`w-64 flex flex-col items-start justify-center gap-3 p-4  bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer border`} >
              <img
                src={item.image ? `http://localhost:5000${item.image}` : "images/ph.jpeg"}
                alt={item.name}
                className="w-full h-40 object-cover mb-2 rounded-md"
              />
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="w-full text-sm text-gray-600 flex justify-between gap-4"><span>Stock</span><span>{item.stock}</span></p>
              <p className='w-full flex justify-between items-center'>
                <span className="text-lg font-bold text-red-600 mt-2">{currency}{item.sellingPrice}</span>
                <Button className='flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-200' onClick={() => addToCart(item)}>
                  <ShoppingCart className="w-5 h-5 mr-1" />
                  Ajouter
                </Button>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full mt-10">Aucun article trouvé.</p>
        )}
      </div>

      {/* Pagination */}
      {filteredItems.length > 8 && (
        <div className=" bottom-0 flex justify-center items-center mt-8 gap-4 py-2">
          <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className={`${currentPage > 1 ? "bg-red-600 text-white" : "bg-red-100 text-red-600"} px-4 py-2 rounded-lg`}>Précédent</Button>
          <span>Page {currentPage} / {totalPages}</span>
          <Button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className={`${currentPage < totalPages ? "bg-red-600 text-white" : "bg-red-100 text-red-600"} px-4 py-2 rounded-lg`}>Suivant</Button>
        </div>
      )}
    </div>
  );
};

export default ArticleFilterPanel;
