import React from 'react';
import useAuthStore from '../../stores/authStore';


const CrudLogReport = () => {
  const { user } = useAuthStore.getState();

  // TODO: Utiliser user.id et user.role pour filtrer les données lors de l'implémentation

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Rapport de modifications (CRUD)</h2>
      {/*
        - Si user.role === 'SALER' : afficher uniquement ses logs (pas de select utilisateur)
        - Si ADMIN/MANAGER : afficher tous les logs, select utilisateur possible
      */}
      {/* TODO: Table, filters, export, etc. */}
    </div>
  );
};

export default CrudLogReport;
