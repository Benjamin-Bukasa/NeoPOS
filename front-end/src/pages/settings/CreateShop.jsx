import React, { useState } from 'react';
import axios from 'axios';

const CreateShop = () => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://localhost:5000/pamoja/api/shops/create', { name, userId: Number(userId) }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Boutique créée et utilisateur lié !');
      setName('');
      setUserId('');
    } catch (err) {
      setMessage('Erreur : ' + (err.response?.data?.error || '')); 
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-lg mx-auto mt-8">
      <h3 className="text-xl font-bold mb-6 text-rose-700">Créer une boutique et lier un utilisateur</h3>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">Nom de la boutique</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" required />
        </div>
        <div>
          <label className="block mb-1 text-rose-700 font-semibold">ID utilisateur à lier</label>
          <input type="number" value={userId} onChange={e => setUserId(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" required />
        </div>
        {message && <div className="text-center text-green-600 font-semibold animate-pulse">{message}</div>}
        <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-400 to-rose-600 text-white font-bold shadow hover:from-rose-500 hover:to-rose-700 transition">
          Créer la boutique
        </button>
      </form>
    </div>
  );
};

export default CreateShop;
