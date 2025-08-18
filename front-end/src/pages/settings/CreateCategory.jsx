
import React, { useState } from "react";
import api from '../../utils/api';

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!name.trim()) {
      setError("Le nom est obligatoire");
      return;
    }
    setLoading(true);
    try {
  await api.post("/pamoja/api/categories", { name });
      setMessage("Catégorie créée avec succès !");
      setName("");
    } catch {
      setError("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-40 flex items-start justify-center min-h-full ">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center text-rose-700 mb-4">Créer une catégorie</h2>
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">Nom</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" required />
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
        <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-400 to-rose-600 text-white font-bold shadow hover:from-rose-500 hover:to-rose-700 transition">
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        {message && <div className="mt-3 text-center text-green-600 font-semibold animate-pulse">{message}</div>}
      </form>
    </div>
  );
};

export default CreateCategory;
