// 📁 src/components/Cart.jsx

import React, { useRef, useState } from 'react';
import { useCartStore } from '../stores/useCartStore';
import SaleModal from './SaleModal';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, clearCart, addToCart } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const printRef = useRef();

  const handleConfirmSale = async () => {
    try {
      const saleData = {
        date: new Date().toISOString(),
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.sellingPrice
        }))
      };

      await axios.post('http://localhost:5000/pamoja/api/saleArticles/createSale', saleData);
      handlePrint();
      clearCart();
      setIsModalOpen(false);
      alert("Vente enregistrée !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '', 'height=600,width=400');
    win.document.write('<html><head><title>Ticket de vente</title>');
    win.document.write('<style>body{font-family:sans-serif;padding:1rem;}h2{text-align:center;}ul{list-style:none;padding:0;}li{margin-bottom:1rem;border-bottom:1px solid #ccc;padding-bottom:.5rem;}footer{text-align:right;font-weight:bold;margin-top:2rem;}</style>');
    win.document.write('</head><body>');
    win.document.write('<h2>Ticket de Vente</h2>');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  const total = cart.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed md:w-1/4 right-0 top-0 h-screen w-full sm:w-96 bg-white shadow-lg rounded-l-lg flex flex-col z-50"
        >
          <div className=" p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
            <h2 className="text-xl font-bold">🛒 Panier</h2>
            {cart.length > 0 && (
              <button
                onClick={handlePrint}
                className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200"
              >
                Imprimer
              </button>
            )}
          </div>

          <div ref={printRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <p className="text-gray-500">Aucun article</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.id} className="border-b pb-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                        <p className="text-sm text-gray-600">
                          HT: €{(item.sellingPrice * item.quantity / 1.2).toFixed(2)} | TTC: €{(item.sellingPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button onClick={() => addToCart(item)} className="bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200 text-sm">+</button>
                        <button onClick={() => removeFromCart(item.id)} className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded hover:bg-yellow-200 text-sm">-</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cart.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t p-4 z-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total TTC:</span>
                <span className="text-lg font-bold text-red-600">€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <button
                  onClick={clearCart}
                  className="w-1/2 bg-yellow-100 text-yellow-700 py-2 rounded hover:bg-yellow-200"
                >
                  Vider le panier
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-1/2 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Valider la vente
                </button>
              </div>
            </div>
          )}

          <SaleModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmSale}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;
