import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Button from '../components/ui/Button';

const initialState = {
  name: '',
  image: null,
  color: '',
  size: '',
  brand: '',
  model: '',
  description: '',
  type: 'SINGLE',
  barcode: '',
  purchasePrice: '',
  sellingPrice: '',
  supplierId: '',
  subCategoryId: '',
  // ✅ Nouveaux champs
  zoneId: '',
  quantity: '',
};

const ArticleEditModal = ({ article, onClose, onSaved }) => {
  const [form, setForm] = useState({ ...initialState, ...article });
  const [imagePreview, setImagePreview] = useState(
    article?.image ? `http://localhost:5000${article.image}` : null
  );
  const [errors, setErrors] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [zones, setZones] = useState([]); // ✅ toujours un tableau
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fournisseurs
    fetch('http://localhost:5000/pamoja/api/suppliers')
      .then(res => res.json())
      .then(data => setSuppliers(Array.isArray(data) ? data : []))
      .catch(() => setSuppliers([]));

    // Sous-catégories
    fetch('http://localhost:5000/pamoja/api/subCategories')
      .then(res => res.json())
      .then(data => setSubCategories(Array.isArray(data) ? data : []))
      .catch(() => setSubCategories([]));

    // ✅ Zones de stockage
    fetch('http://localhost:5000/pamoja/api/zones')
      .then(res => res.json())
      .then(data => setZones(Array.isArray(data) ? data : []))
      .catch(() => setZones([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm(prev => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Le nom est obligatoire";
    if (!form.type) newErrors.type = "Le type est obligatoire";
    if (!form.purchasePrice || isNaN(form.purchasePrice)) newErrors.purchasePrice = "Prix d'achat invalide";
    if (!form.sellingPrice || isNaN(form.sellingPrice)) newErrors.sellingPrice = "Prix de vente invalide";
    if (!form.subCategoryId) newErrors.subCategoryId = "Sous-catégorie obligatoire";
    if (!form.zoneId) newErrors.zoneId = "Zone de stockage obligatoire";
    if (form.quantity === '' || isNaN(form.quantity)) newErrors.quantity = "Quantité invalide";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (['purchasePrice', 'sellingPrice', 'quantity'].includes(key)) {
        if (value !== '' && value !== null && value !== undefined) {
          data.append(key, parseFloat(value));
        }
      } else if (['supplierId', 'subCategoryId', 'zoneId'].includes(key)) {
        if (value !== '' && value !== null && value !== undefined) {
          data.append(key, parseInt(value));
        }
      } else if (key === 'image') {
        if (value) data.append(key, value);
      } else {
        if (value !== null && value !== undefined && value !== '') {
          data.append(key, value);
        }
      }
    });

    try {
      const token = localStorage.getItem('token');
      await api.put(`/pamoja/api/articles/updateArticle/${article.id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // 👉 Si tu veux aussi mettre à jour le stock ici (table Stock),
      // dis-le et j’ajoute l’appel API (create/update) en fonction de (article.id, form.zoneId).
      // Pour l’instant on se limite à l’update Article, comme dans ton code d’origine.

      onSaved && onSaved();
      onClose();
    } catch (err) {
      setModalError(err?.response?.data?.error || err.message || "Erreur lors de la modification de l'article");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-xl w-2/5 min-w-[350px] max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Modifier l'article</h2>

        {/* Groupe 1 : Nom, Image, Type */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <input name="name" type="text" placeholder="Nom de l'article" className="w-full border px-3 py-2 rounded" value={form.name} onChange={handleChange} required />
            {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
            <select name="type" className="w-full border px-3 py-2 rounded" value={form.type} onChange={handleChange}>
              <option value="SINGLE">Simple</option>
              <option value="PACK">Pack</option>
            </select>
            {errors.type && <div className="text-red-500 text-xs">{errors.type}</div>}
          </div>
          <div className="flex-1 space-y-2 flex flex-col items-center justify-center">
            <input name="image" type="file" accept="image/*" className="w-full border px-3 py-2 rounded" onChange={handleChange} />
            {imagePreview && <img src={imagePreview} alt="aperçu" className="h-24 object-contain border rounded" />}
          </div>
        </div>

        {/* Groupe 2 : Couleur, Taille, Marque, Modèle */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
          <input name="color" type="text" placeholder="Couleur" className="border px-3 py-2 rounded" value={form.color} onChange={handleChange} />
          <input name="size" type="text" placeholder="Taille" className="border px-3 py-2 rounded" value={form.size} onChange={handleChange} />
          <input name="brand" type="text" placeholder="Marque" className="border px-3 py-2 rounded" value={form.brand} onChange={handleChange} />
          <input name="model" type="text" placeholder="Modèle" className="border px-3 py-2 rounded" value={form.model} onChange={handleChange} />
        </div>

        {/* Groupe 3 : Description */}
        <div className="mt-2">
          <textarea name="description" placeholder="Description" className="w-full border px-3 py-2 rounded" value={form.description} onChange={handleChange} />
        </div>

        {/* Groupe 4 : Prix, Code-barres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <input name="purchasePrice" type="number" step="0.01" placeholder="Prix d'achat" className="border px-3 py-2 rounded" value={form.purchasePrice} onChange={handleChange} required />
          {errors.purchasePrice && <div className="text-red-500 text-xs">{errors.purchasePrice}</div>}
          <input name="sellingPrice" type="number" step="0.01" placeholder="Prix de vente" className="border px-3 py-2 rounded" value={form.sellingPrice} onChange={handleChange} required />
          {errors.sellingPrice && <div className="text-red-500 text-xs">{errors.sellingPrice}</div>}
          <input name="barcode" type="text" placeholder="Code-barres" className="border px-3 py-2 rounded" value={form.barcode} onChange={handleChange} />
        </div>

        {/* Groupe 5 : Fournisseur, Sous-catégorie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <select name="supplierId" className="border px-3 py-2 rounded" value={form.supplierId} onChange={handleChange}>
            <option value="">Sélectionner un fournisseur</option>
            {Array.isArray(suppliers) && suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select name="subCategoryId" className="border px-3 py-2 rounded" value={form.subCategoryId} onChange={handleChange} required>
            <option value="">Sélectionner une sous-catégorie</option>
            {Array.isArray(subCategories) && subCategories.map(sc => (
              <option key={sc.id} value={sc.id}>{sc.name}</option>
            ))}
          </select>
          {errors.subCategoryId && <div className="text-red-500 text-xs">{errors.subCategoryId}</div>}
        </div>

        {/* Groupe 6 : Zone de stockage + Quantité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <select
            name="zoneId"
            className="border px-3 py-2 rounded"
            value={form.zoneId || ""}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner une zone de stockage</option>
            {Array.isArray(zones) && zones.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
          {errors.zoneId && <div className="text-red-500 text-xs">{errors.zoneId}</div>}

          <input
            name="quantity"
            type="number"
            placeholder="Quantité"
            className="border px-3 py-2 rounded"
            value={form.quantity}
            onChange={handleChange}
            required
          />
          {errors.quantity && <div className="text-red-500 text-xs">{errors.quantity}</div>}
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Annuler</button>
          <Button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>

      {/* Modal d'erreur custom */}
      
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white p-6 rounded shadow-lg max-w-md w-full z-10">
            <h2 className="text-lg font-bold mb-2 text-red-600">Erreur lors de la modification</h2>
            <p className="mb-4 text-gray-700">{modalError}</p>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-rose-600 text-white rounded">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleEditModal;
