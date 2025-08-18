import React, { useState } from 'react';
import CreateUser from './settings/CreateUser';
import CreateArticle from './settings/CreateArticle';
import CreateSupplier from './settings/CreateSupplier';
import CreateCategory from './settings/CreateCategory';
import CreateSubCategory from './settings/CreateSubCategory';
import ChangePassword from './settings/ChangePassword';
import AssignRole from './settings/AssignRole';
import CompanyInfo from './settings/CompanyInfo';
import CreateShop from './settings/CreateShop';

const Settings = () => {
  const [tab, setTab] = useState('user');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || '$');
  const [newCurrency, setNewCurrency] = useState('');

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    localStorage.setItem('currency', e.target.value);
  };

  const handleCurrencyCreate = (e) => {
    e.preventDefault();
    if (newCurrency.trim()) {
      setCurrency(newCurrency.trim());
      localStorage.setItem('currency', newCurrency.trim());
      setNewCurrency('');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Paramètres</h2>
  <nav className="flex justify-between gap-4 mb-8 border-b pb-2 flex-wrap">
        <button onClick={() => setTab('user')} className={tab === 'user' ? 'font-bold p-2  ease-in-out text-white bg-red-500' : 'p-2 bg-neutral-50 ease-in-out hover:text-white hover:bg-red-500'}>Créer un utilisateur</button>
        <button onClick={() => setTab('article')} className={tab === 'article' ? 'font-bold p-2  ease-in-out text-white bg-red-500' : 'p-2 bg-neutral-50 ease-in-out hover:text-white hover:bg-red-500'}>Créer un article</button>
        <button onClick={() => setTab('category')} className={tab === 'category' ? 'font-bold p-2  ease-in-out text-white bg-red-500' : 'p-2 bg-neutral-50 ease-in-out hover:text-white hover:bg-red-500'}>Créer une catégorie</button>
        <button onClick={() => setTab('subcategory')} className={tab === 'subcategory' ? 'font-bold p-2  ease-in-out text-white bg-red-500' : 'p-2 bg-neutral-50 ease-in-out hover:text-white hover:bg-red-500'}>Créer une sous-catégorie</button>
        <button onClick={() => setTab('password')} className={tab === 'password' ? 'font-bold p-2  ease-in-out text-white bg-red-500' : 'p-2 bg-neutral-50 ease-in-out hover:text-white hover:bg-red-500'}>Modifier mot de passe</button>
        <button onClick={() => setTab('roles')} className={tab === 'roles' ? 'font-bold p-2  ease-in-out text-white bg-red-500' : 'p-2 bg-neutral-50 ease-in-out hover:text-white hover:bg-red-500'}>Attribuer un rôle</button>
        <button onClick={() => setTab('company')} className={tab === 'company' ? 'font-bold p-2  ease-in-out text-white bg-red-500' : 'p-2 bg-neutral-50 ease-in-out hover:text-white hover:bg-red-500'}>Infos entreprise</button>
  {/* <button onClick={() => setTab('shop')} className={tab === 'shop' ? 'font-bold text-blue-600' : ''}>Créer une boutique</button> */}
  <button onClick={() => setTab('currency')} className={tab === 'currency' ? 'font-bold p-2  ease-in-out text-white bg-red-500' : 'p-2 bg-neutral-50 ease-in-out hover:text-white hover:bg-red-500'}>Devise</button>
      </nav>
  {tab === 'user' && <CreateUser />}
  {tab === 'article' && <CreateArticle />}
  {tab === 'category' && <CreateCategory />}
  {tab === 'subcategory' && <CreateSubCategory />}
  {tab === 'password' && <ChangePassword />}
  {tab === 'roles' && <AssignRole />}
  {tab === 'company' && <CompanyInfo />}
  {tab === 'shop' && <CreateShop />}
  {tab === 'currency' && (
    <div className="max-w-md mx-auto bg-gray-50 p-6 rounded shadow">
      <h3 className="text-lg font-bold mb-4">Choisir la devise</h3>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Devise actuelle :</label>
        <select value={currency} onChange={handleCurrencyChange} className="border px-3 py-2 rounded w-full">
          <option value="$">$ (Dollar)</option>
          <option value="€">€ (Euro)</option>
          <option value="FCFA">FCFA (Franc CFA)</option>
          <option value="CDF">CDF (Franc Congolais)</option>
        </select>
      </div>
      <form onSubmit={handleCurrencyCreate} className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block mb-1 font-semibold">Ajouter une nouvelle devise</label>
          <input type="text" value={newCurrency} onChange={e => setNewCurrency(e.target.value)} placeholder="Ex: ₦, £, ¥..." className="border px-3 py-2 rounded w-full" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Ajouter</button>
      </form>
    </div>
  )}
    </div>
  );
};

export default Settings;