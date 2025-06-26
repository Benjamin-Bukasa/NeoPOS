import React from 'react';
import { Dialog } from '@headlessui/react';
import { useCartStore } from '../stores/useCartStore';

const SaleModal = ({ isOpen, onClose, onConfirm }) => {
  const { cart } = useCartStore();
  const total = cart.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true"></div>
      <div className="flex items-center justify-center min-h-screen p-4 relative z-50">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">Confirmation de la vente</Dialog.Title>
          <ul className="mb-4">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between border-b py-1">
                <span>{item.name} x{item.quantity}</span>
                <span>€{item.sellingPrice * item.quantity}</span>
              </li>
            ))}
          </ul>
          <p className="font-bold text-right mb-4">Total: €{total}</p>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200">Annuler</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Confirmer</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SaleModal;