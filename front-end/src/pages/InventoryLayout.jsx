import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const InventoryLayout = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Inventaire</h2>
      <nav className="flex gap-4 mb-8 border-b pb-2 flex-wrap">
        <NavLink to="faire" className={({isActive}) => isActive ? 'font-bold text-blue-600' : ''}>Faire l'inventaire</NavLink>
        <NavLink to="liste" className={({isActive}) => isActive ? 'font-bold text-blue-600' : ''}>Liste des inventaires</NavLink>
      </nav>
      <Outlet />
    </div>
  );
};

export default InventoryLayout;
