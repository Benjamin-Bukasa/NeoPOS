import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remplace l'URL par celle de ton endpoint de changement de mot de passe
  await axios.post('http://localhost:5000/pamoja/api/auth/change-password', { currentPassword, newPassword });
      setMessage('Mot de passe modifié avec succès');
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage("Erreur : " + (err.response?.data?.error || '')); 
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-rose-700">Modifier le mot de passe</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">Mot de passe actuel</label>
          <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" required />
        </div>
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">Nouveau mot de passe</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" required />
        </div>
        <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-400 to-rose-600 text-white font-bold shadow hover:from-rose-500 hover:to-rose-700 transition">Enregistrer</button>
        {message && <div className="mt-3 text-center text-green-600 font-semibold animate-pulse">{message}</div>}
      </form>
    </div>
  );
};

export default ChangePassword;
