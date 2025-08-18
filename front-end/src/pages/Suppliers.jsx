import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Suppliers() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('/pamoja/api/suppliers');
      if (Array.isArray(res.data)) {
        setSuppliers(res.data);
      } else {
        setSuppliers([]);
      }
    } catch (e) {
      setSuppliers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  await axios.post('http://localhost:5000/pamoja/api/suppliers', { name, contact, address });
      setMessage('Fournisseur créé avec succès');
      setName("");
      setContact("");
      setAddress("");
      fetchSuppliers();
    } catch {
      setMessage('Erreur lors de la création');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Fournisseurs</h2>
      <form onSubmit={handleSubmit} className="w-full  p-6 rounded-xl shadow-lg mb-8 border border-rose-200">
        <div className="mb-5">
          <label className="block mb-2 font-semibold tracking-wide" htmlFor="name">Nom du fournisseur</label>
          <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white  transition" placeholder="Entrer le nom..." required />
        </div>
        <div className="mb-5">
          <label className="block mb-2 font-semibold tracking-wide" htmlFor="contact">Contact</label>
          <input id="contact" type="text" value={contact} onChange={e => setContact(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white  transition" placeholder="Téléphone ou email..." />
        </div>
        <div className="mb-5">
          <label className="block mb-2  font-semibold tracking-wide" htmlFor="address">Adresse</label>
          <input id="address" type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white  transition" placeholder="Adresse du fournisseur..." />
        </div>
        <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-400 to-rose-600 text-white font-bold shadow hover:from-rose-500 hover:to-rose-700 transition">Enregistrer</button>
        {message && <div className="mt-3 text-center text-green-600 font-semibold animate-pulse">{message}</div>}
      </form>
      <div className="overflow-x-auto">
        <table className="table w-full border border-rose-200">
          <thead className="bg-rose-50">
            <tr>
              <th className="border border-rose-200">Nom</th>
              <th className="border border-rose-200">Contact</th>
              <th className="border border-rose-200">Adresse</th>
              <th className="border border-rose-200">Date création</th>
            </tr>
          </thead>
          <tbody>
            {suppliers && suppliers.length > 0 ? (
              suppliers.map(s => (
                <tr key={s.id} className="hover:bg-rose-50">
                  <td className="border border-rose-100">{s.name}</td>
                  <td className="border border-rose-100">{s.contact}</td>
                  <td className="border border-rose-100">{s.address}</td>
                  <td className="border border-rose-100">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center">Aucun fournisseur</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Suppliers;