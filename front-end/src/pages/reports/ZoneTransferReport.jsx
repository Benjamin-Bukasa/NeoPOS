import React from 'react';
import useAuthStore from '../../stores/authStore';


const ZoneTransferReport = () => {
  const { user } = useAuthStore.getState();

  // TODO: Utiliser user.id et user.role pour filtrer les données lors de l'implémentation

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Rapport de transfert de zone</h2>
      {/*
        - Si user.role === 'SALER' : afficher uniquement ses transferts (pas de select vendeur)
        - Si ADMIN/MANAGER : afficher tous les transferts, select vendeur possible
      */}
      {/* TODO: Table, filters, export, etc. */}
    </div>
  );
};

export default ZoneTransferReport;
