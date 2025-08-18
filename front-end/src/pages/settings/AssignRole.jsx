
import React, { useState } from 'react';
import api from '../../utils/api';

const AssignRole = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("SALER");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email.trim()) {
      setError("L'email est obligatoire");
      return;
    }
    setLoading(true);
    try {
  await api.post('/pamoja/api/auth/assign-role', { email, role });
      setMessage('Rôle attribué avec succès !');
      setEmail("");
      setRole("SALER");
    } catch (err) {
      setError("Erreur : " + (err.response?.data?.error || '')); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-40 flex items-start justify-center min-h-full">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-6 border">
        <h2 className="text-2xl font-bold text-center text-rose-700 mb-4">Attribuer un rôle</h2>
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">Email utilisateur</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" required />
        </div>
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">Nouveau rôle</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300">
            <option value="SALER">Vendeur</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-400 to-rose-600 text-white font-bold shadow hover:from-rose-500 hover:to-rose-700 transition">
          {loading ? 'Attribution...' : 'Attribuer'}
        </button>
        {message && <div className="mt-3 text-center text-green-600 font-semibold animate-pulse">{message}</div>}
      </form>
    </div>
  );
};

export default AssignRole;
