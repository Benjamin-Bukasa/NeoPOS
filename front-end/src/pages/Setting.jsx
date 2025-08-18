import React, { useState } from 'react';
import CreateUser from './settings/CreateUser';
import CreateArticle from './settings/CreateArticle';
import ChangePassword from './settings/ChangePassword';
import AssignRole from './settings/AssignRole';
import CompanyInfo from './settings/CompanyInfo';

const Setting = () => {
  const [tab, setTab] = useState('user');

  return (
    <div className="p-6 bg-white rounded-xl shadow min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Paramètres</h2>
      <nav className="flex gap-4 mb-8 border-b pb-2">
        <button onClick={() => setTab('user')} className={tab === 'user' ? 'font-bold text-blue-600' : ''}>Créer un utilisateur</button>
        <button onClick={() => setTab('article')} className={tab === 'article' ? 'font-bold text-blue-600' : ''}>Créer un article</button>
        <button onClick={() => setTab('password')} className={tab === 'password' ? 'font-bold text-blue-600' : ''}>Modifier mot de passe</button>
        <button onClick={() => setTab('roles')} className={tab === 'roles' ? 'font-bold text-blue-600' : ''}>Attribuer un rôle</button>
        <button onClick={() => setTab('company')} className={tab === 'company' ? 'font-bold text-blue-600' : ''}>Infos entreprise</button>
      </nav>
      {tab === 'user' && <CreateUser />}
      {tab === 'article' && <CreateArticle />}
      {tab === 'password' && <ChangePassword />}
      {tab === 'roles' && <AssignRole />}
      {tab === 'company' && <CompanyInfo />}
    </div>
  );
};

export default Setting;
