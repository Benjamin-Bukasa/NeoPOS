import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const navItems = [
  { to: 'sales', label: 'Rapport de ventes' },
  { to: 'zone-transfer', label: 'Rapport de transfert de zone' },
  { to: 'inventory', label: 'Rapport d\'inventaire' },
  { to: 'crud-log', label: 'Rapport de modifications' },
];

function Reports() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rapports</h1>
      <nav className="flex gap-4 mb-6">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-4 py-2 rounded ${isActive ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`
            }
            end
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="bg-white rounded-xl shadow p-4 min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
}

export default Reports;