import React from 'react';
import useAuthStore from '../../stores/authStore';


const InventoryReport = () => {
  const { user } = useAuthStore.getState();

  // TODO: Utiliser user.id et user.role pour filtrer les données lors de l'implémentation

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Rapport d'inventaire</h2>
      {/*
        - Si user.role === 'SALER' : afficher uniquement ses inventaires (pas de select vendeur)
        - Si ADMIN/MANAGER : afficher tous les inventaires, select vendeur possible
      */}
      {/* TODO: Table, filters, export, etc. */}
    </div>
  );
};

export default InventoryReport;
