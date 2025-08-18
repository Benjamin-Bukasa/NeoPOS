// 📁 src/components/Cart.jsx

import React, { useRef, useState } from 'react';
import { getCurrencySymbol } from '../utils/currency';
import useAuthStore from '../stores/authStore';
import { useCartStore } from '../stores/useCartStore';
import SaleModal from './SaleModal';
import api from '../utils/api';
import { AnimatePresence, motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';

const Cart = () => {
  const { cart, clearCart, addToCart, substractQuantity } = useCartStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const printRef = useRef();
  const { user } = useAuthStore();

  // Génère le ticket PDF POS stylé (provisoire ou final)
  const printTicket = (cartToPrint, paymentMethod = 'Espèces') => {
    const currency = getCurrencySymbol();
    if (!cartToPrint || cartToPrint.length === 0) return;
    const items = cartToPrint.map(item =>
      `<tr>
        <td style='padding:2px 0;'>${item.name}</td>
        <td style='text-align:right;padding:2px 0;'>${item.quantity}</td>
        <td style='text-align:right;padding:2px 0;'>${(item.sellingPrice * item.quantity).toFixed(2)} ${currency}</td>
      </tr>`
    ).join('');
    const total = cartToPrint.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0).toFixed(2);
    const seller = user && user.name ? user.name : 'Vendeur inconnu';
    // Informations entreprise (à personnaliser ou à récupérer dynamiquement)
  const companyName = 'PAMOJA SHOP';
  const companyRCCM = 'RCCM : CD/KIN/RCCM/23-B-12345';
  const companyIdNat = 'ID NAT : 01-83-N12345B';
  const companyAddress = '24, Av. de la Paix, Gombe, Kinshasa';
  const companyPhone = 'Tél : +243 812 345 678';

    const header = `
      <div style='text-align:center;font-weight:bold;font-size:18px;margin-bottom:2px;'>${companyName}</div>
      <div style='text-align:center;font-size:11px;'>${companyRCCM}</div>
      <div style='text-align:center;font-size:11px;'>${companyIdNat}</div>
      <div style='text-align:center;font-size:11px;'>${companyAddress}</div>
      <div style='text-align:center;font-size:11px;margin-bottom:6px;'>${companyPhone}</div>
    `;
    const date = `<div style='text-align:center;font-size:11px;margin-bottom:6px;'>${new Date().toLocaleString()}</div>`;
    const sellerHtml = `<div style='text-align:center;font-size:12px;margin-bottom:4px;'>Vendeur : ${seller}</div>`;
    const table = `<table style='width:90%;font-size:12px;border-collapse:collapse;'><thead><tr style='border-bottom:1px solid #ccc;'><th style='text-align:left;'>Article</th><th style='text-align:right;'>Qté</th><th style='text-align:right;'>Prix TTC</th></tr></thead><tbody>${items}</tbody></table>`;
    const separator = `<hr style='border:none;border-top:1px dashed #888;margin:8px 0;' />`;


  const totalHtml = `${separator}<div style='font-weight:bold;text-align:right;font-size:15px;'>Total : ${total} ${currency}</div>`;
    const paymentHtml = `<div style='margin-top:4px;text-align:right;font-size:13px;'>Paiement : ${paymentMethod}</div>`;
    const thanks = `<div style='text-align:center;margin-top:10px;font-size:12px;'>Merci pour votre achat !</div>`;

  // Largeur adaptée pour Epson T200III (58mm)
  const content = `<div style='width:80mm;max-width:100%;padding:2mm 0 2mm 0;'>${header}${date}${sellerHtml}
    <table style='width:95%;font-size:11px;border-collapse:collapse;table-layout:fixed;'>
      <thead><tr style='border-bottom:1px solid #ccc;'>
        <th style='text-align:left;width:50%;word-break:break-all;'>Article</th>
        <th style='text-align:right;width:15%;'>Qté</th>
        <th style='text-align:right;width:35%;'>Prix TTC</th>
      </tr></thead>
      <tbody>${cartToPrint.map(item => `
        <tr>
          <td style='padding:2px 5px;word-break:break-all;'>${item.name}</td>
          <td style='text-align:right;padding:2px 0;'>${item.quantity}</td>
          <td style='text-align:right;padding:2px 0;'>${(item.sellingPrice * item.quantity).toFixed(2)} ${currency}</td>
        </tr>`).join('')}
      </tbody>
    </table>
    ${totalHtml}${paymentHtml}${thanks}</div>`;
    // Crée un conteneur temporaire pour html2pdf
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    // Calcule dynamiquement la hauteur du contenu HTML en mm
    document.body.appendChild(tempDiv);
    const pxToMm = px => px * 0.264583;
    const contentHeightPx = tempDiv.offsetHeight;
    const contentHeightMm = Math.ceil(pxToMm(contentHeightPx)) + 2; // +2mm de marge de sécurité
    document.body.removeChild(tempDiv);

    // Options POS-80C dynamiques
    const opt = {
      margin: [2, 4, 2, 4],
      filename: 'ticket-pos.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: [80, contentHeightMm], orientation: 'portrait' },
      output: '',
    };
    html2pdf().set(opt).from(tempDiv).outputPdf('bloburl').then((pdfUrl) => {
      // Ouvre uniquement l'onglet d'impression (pas d'onglet PDF direct)
      fetch(pdfUrl)
        .then(res => res.blob())
        .then(blob => {
          const fileURL = URL.createObjectURL(blob);
          const printWindow = window.open(fileURL, '_blank');
          if (printWindow) {
            printWindow.onload = function () {
              printWindow.focus();
              printWindow.print();
            };
          }
        });
    });
  };

  // Pour le ticket provisoire
  const handlePrint = () => {
    printTicket(cart);
  };

  // Pour la validation de vente (ticket final)
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
  await api.post('/pamoja/api/saleArticles/createSale', saleData);
      printTicket(cart);
      clearCart();
      setIsModalOpen(false);
      alert("Vente enregistrée !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
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
          className="fixed md:w-1/4 right-0 top-0 h-screen w-full sm:w-96 bg-white shadow-lg rounded-l-lg flex flex-col"
        >
          <div className=" p-4 border-b sticky top-0 bg-white flex justify-between items-center">
            <h2 className="text-xl font-bold">🛒 Panier</h2>
            {cart.length > 0 && (
              <button
                onClick={handlePrint}
                className="text-sm bg-red-100 text-red-600 font-semibold px-3 py-2 rounded hover:bg-red-600 hover:text-white transition-colors "
              >
                Imprimer le ticket provisoire
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
                        <p className="text-sm text-gray-600  flex items-center justify-between">Quantité: <span className='font-bold text-red'>{item.quantity}</span></p>
                        <p className="text-sm text-gray-600">
                          HT: €{(item.sellingPrice * item.quantity / 1.2).toFixed(2)} | TTC: €{(item.sellingPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => addToCart(item)} className="bg-zinc-300 text-zinc-600 px-4 py-2 rounded hover:bg-zinc-400 text-sm">+</button>
                        <button onClick={() => substractQuantity(item.id)} className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">-</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cart.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total TTC:</span>
                <span className="text-lg font-bold text-red-600">€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <button
                  onClick={clearCart}
                  className="w-1/2 bg-red-100 text-red-600 py-2 rounded hover:bg-red-600 transition-colors hover:text-white"
                >
                  Vider le panier
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-1/2 bg-green-200 text-green-600 py-2 rounded hover:bg-green-600 hover:text-white transition-colors"
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
