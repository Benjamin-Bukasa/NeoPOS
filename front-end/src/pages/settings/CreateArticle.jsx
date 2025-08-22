import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

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
  zoneId: '',
  quantity: '',
  importFile: null,
};

const CreateArticle = () => {
  const [form, setForm] = useState(initialState);
  const [csvFile, setCsvFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [zones, setZones] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    fetch('http://localhost:5000/pamoja/api/suppliers')
      .then(res => res.json())
      .then(data => setSuppliers(data))
      .catch(() => setSuppliers([]));

    fetch('http://localhost:5000/pamoja/api/subCategories')
      .then(res => res.json())
      .then(data => setSubCategories(data))
      .catch(() => setSubCategories([]));

    fetch('http://localhost:5000/pamoja/api/zones')
      .then(res => res.json())
      .then(data => setZones(data))
      .catch(() => setZones([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && name === 'image') {
      setForm({ ...form, [name]: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else if (type === 'file' && name === 'importFile') {
      setForm({ ...form, importFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Le nom est obligatoire";
    if (!form.type) newErrors.type = "Le type est obligatoire";
    if (!form.purchasePrice || isNaN(form.purchasePrice)) newErrors.purchasePrice = "Prix d'achat invalide";
    if (!form.sellingPrice || isNaN(form.sellingPrice)) newErrors.sellingPrice = "Prix de vente invalide";
    if (!form.subCategoryId) newErrors.subCategoryId = "Sous-catégorie obligatoire";
    if (!form.zoneId) newErrors.zoneId = "La zone est obligatoire";
    if (!form.quantity || isNaN(form.quantity)) newErrors.quantity = "Quantité invalide";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("");
      return;
    }
    setErrors({});
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (['purchasePrice', 'sellingPrice', 'quantity'].includes(key)) {
        if (value !== '' && value !== null && value !== undefined) data.append(key, parseFloat(value));
      } else if (['supplierId', 'subCategoryId', 'zoneId'].includes(key)) {
        if (value !== '' && value !== null && value !== undefined) data.append(key, parseInt(value));
      } else if (key === 'image') {
        if (value) data.append(key, value);
      } else if (key !== "importFile") {
        if (value !== null && value !== undefined && value !== '') data.append(key, value);
      }
    });
    try {
      await api.post('/pamoja/api/articles/createNewArticle', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Article enregistré avec succès !');
      setForm(initialState);
      setImagePreview(null);
    } catch (err) {
      setModalError(err?.response?.data?.error || err.message || "Erreur lors de l'enregistrement de l'article");
      setModalOpen(true);
    }
  };

  const handleImportCSV = async () => {
  if (!csvFile) {
    setModalError("Veuillez sélectionner un fichier CSV");
    setModalOpen(true);
    return;
  }

  const data = new FormData();
  data.append("file", csvFile);

  try {
    await api.post("/pamoja/api/articles/importMany", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setMessage("Articles importés avec succès !");
  } catch (err) {
    setModalError(err?.response?.data?.error || err.message || "Erreur lors de l'importation");
    setModalOpen(true);
  }
};



  const handleExportTemplate = () => {
    const headers = [
      "name;color;size;brand;model;description;type;barcode;purchasePrice;sellingPrice;supplierId;subCategoryId;zoneId;quantity"
    ];
    const blob = new Blob([headers.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_articles.csv";
    a.click();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Créer un article</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input name="color" type="text" placeholder="Couleur" className="border px-3 py-2 rounded" value={form.color} onChange={handleChange} />
          <input name="size" type="text" placeholder="Taille" className="border px-3 py-2 rounded" value={form.size} onChange={handleChange} />
          <input name="brand" type="text" placeholder="Marque" className="border px-3 py-2 rounded" value={form.brand} onChange={handleChange} />
          <input name="model" type="text" placeholder="Modèle" className="border px-3 py-2 rounded" value={form.model} onChange={handleChange} />
        </div>

        <div>
          <textarea name="description" placeholder="Description" className="w-full border px-3 py-2 rounded" value={form.description} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input name="purchasePrice" type="number" step="0.01" placeholder="Prix d'achat" className="border px-3 py-2 rounded" value={form.purchasePrice} onChange={handleChange} required />
          {errors.purchasePrice && <div className="text-red-500 text-xs">{errors.purchasePrice}</div>}
          <input name="sellingPrice" type="number" step="0.01" placeholder="Prix de vente" className="border px-3 py-2 rounded" value={form.sellingPrice} onChange={handleChange} required />
          {errors.sellingPrice && <div className="text-red-500 text-xs">{errors.sellingPrice}</div>}
          <input name="barcode" type="text" placeholder="Code-barres" className="border px-3 py-2 rounded" value={form.barcode} onChange={handleChange} />
          <input name="quantity" type="number" placeholder="Quantité" className="border px-3 py-2 rounded" value={form.quantity} onChange={handleChange} required />
          {errors.quantity && <div className="text-red-500 text-xs">{errors.quantity}</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select name="supplierId" className="border px-3 py-2 rounded" value={form.supplierId} onChange={handleChange}>
            <option value="">Sélectionner un fournisseur</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select name="subCategoryId" className="border px-3 py-2 rounded" value={form.subCategoryId} onChange={handleChange} required>
            <option value="">Sélectionner une sous-catégorie</option>
            {subCategories.map(sc => (
              <option key={sc.id} value={sc.id}>{sc.name}</option>
            ))}
          </select>
          {errors.subCategoryId && <div className="text-red-500 text-xs">{errors.subCategoryId}</div>}
          <select name="zoneId" className="border px-3 py-2 rounded" value={form.zoneId} onChange={handleChange} required>
            <option value="">Sélectionner une zone</option>
            {zones.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
          {errors.zoneId && <div className="text-red-500 text-xs">{errors.zoneId}</div>}
        </div>

        <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-400 to-rose-600 text-white font-bold shadow hover:from-rose-500 hover:to-rose-700 transition">Enregistrer</button>

        <div className="flex flex-col md:flex-row gap-4 mt-4 items-center">
          <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} className="border p-2 rounded" />
          <button type="button" onClick={handleImportCSV} className="px-4 py-2 bg-green-600 text-white rounded">Importer</button>
          <button type="button" onClick={handleExportTemplate} className="px-4 py-2 bg-blue-500 text-white rounded">Télécharger Template</button>
        </div>

        {message && <div className="mt-3 text-center text-green-600 font-semibold animate-pulse">{message}</div>}
      </form>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white p-6 rounded shadow-lg max-w-md w-full z-10">
            <h2 className="text-lg font-bold mb-2 text-red-600">Erreur</h2>
            <p className="mb-4 text-gray-700">{modalError}</p>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-rose-600 text-white rounded">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateArticle;
