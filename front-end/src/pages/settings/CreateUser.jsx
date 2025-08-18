import React, { useState } from 'react';
import api from '../../utils/api';

const roles = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SALER', label: 'Vendeur' },
  { value: 'MANAGER', label: 'Manager' },
];

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SALER");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  await api.post('/pamoja/api/auth/register-user', { name, email, password, role });
      setMessage('Utilisateur créé avec succès');
      setName("");
      setEmail("");
      setPassword("");
      setRole("SALER");
    } catch (err) {
      setMessage("Erreur lors de la création : " + (err.response?.data?.error || '')); 
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-lg mx-auto">
      <h3 className="text-xl font-bold mb-6 text-rose-700">Créer un utilisateur</h3>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">Nom</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" required />
        </div>
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" required />
        </div>
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">Mot de passe</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" required />
        </div>
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">Rôle</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300">
            {roles.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-400 to-rose-600 text-white font-bold shadow hover:from-rose-500 hover:to-rose-700 transition">Créer</button>
        {message && <div className="mt-3 text-center text-green-600 font-semibold animate-pulse">{message}</div>}
      </form>
    </div>
  );
};

export default CreateUser;
