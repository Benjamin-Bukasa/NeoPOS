import React, { useState } from 'react';

const CompanyInfo = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [rccm, setRccm] = useState("");
  const [idnat, setIdnat] = useState("");
  const [admin, setAdmin] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajoute ici la logique d'enregistrement
    setMessage('Informations enregistrées !');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-rose-700">Infos entreprise</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Groupe 1 : Nom et Administrateur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-rose-700 font-semibold">Nom de l'entreprise</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" required />
          </div>
          <div>
            <label className="block mb-1 text-rose-700 font-semibold">Administrateur</label>
            <input type="text" value={admin} onChange={e => setAdmin(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
        </div>
        {/* Groupe 2 : Adresse et Téléphone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-rose-700 font-semibold">Adresse</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
          <div>
            <label className="block mb-1 text-rose-700 font-semibold">Téléphone</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
        </div>
        {/* Groupe 3 : RCCM et ID-NAT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-rose-700 font-semibold">Numéro RCCM</label>
            <input type="text" value={rccm} onChange={e => setRccm(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
          <div>
            <label className="block mb-1 text-rose-700 font-semibold">Numéro ID-NAT</label>
            <input type="text" value={idnat} onChange={e => setIdnat(e.target.value)} className="w-full px-4 py-2 border-2 border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
        </div>
        <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-400 to-rose-600 text-white font-bold shadow hover:from-rose-500 hover:to-rose-700 transition">Enregistrer</button>
        {message && <div className="mt-3 text-center text-green-600 font-semibold animate-pulse">{message}</div>}
      </form>
    </div>
  );
};

export default CompanyInfo;
