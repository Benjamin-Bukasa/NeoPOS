import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const SettingsLayout = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Paramètres</h2>
      <nav className="flex gap-4 mb-8 border-b pb-2 flex-wrap">
        <NavLink to="user" className={({isActive}) => isActive ? 'font-bold white bg-red-500 p-2' : ''}>Créer un utilisateur</NavLink>
        <NavLink to="article" className={({isActive}) => isActive ? 'font-bold text-blue-600' : ''}>Créer un article</NavLink>
        <NavLink to="supplier" className={({isActive}) => isActive ? 'font-bold text-blue-600' : ''}>Créer un fournisseur</NavLink>
        <NavLink to="category" className={({isActive}) => isActive ? 'font-bold text-blue-600' : ''}>Créer une catégorie</NavLink>
        <NavLink to="subcategory" className={({isActive}) => isActive ? 'font-bold text-blue-600' : ''}>Créer une sous-catégorie</NavLink>
        <NavLink to="password" className={({isActive}) => isActive ? 'font-bold text-blue-600' : ''}>Modifier mot de passe</NavLink>
        <NavLink to="roles" className={({isActive}) => isActive ? 'font-bold text-blue-600' : ''}>Attribuer un rôle</NavLink>
        <NavLink to="company" className={({isActive}) => isActive ? 'font-bold text-blue-600' : ''}>Infos entreprise</NavLink>
      </nav>
      <Outlet />
    </div>
  );
};

export default SettingsLayout;
