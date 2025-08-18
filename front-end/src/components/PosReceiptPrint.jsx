import React, { useRef } from 'react';
import { getCurrencySymbol } from '../utils/currency';

const PosReceiptPrint = ({ sale }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
  const win = window.open('', '', 'width=370,height=1'); // Hauteur minimale, s'adapte au contenu
    win.document.write('<html><head><title>Facture</title>');
    win.document.write('<style>body{font-family:monospace;font-size:12px;} .center{text-align:center;} .bold{font-weight:bold;} table{width:90%;border-collapse:collapse;} td,th{padding:2px 5px;} .total{font-size:16px;font-weight:bold;}</style>');
    win.document.write('</head><body>');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  if (!sale) return <div>Aucune vente à imprimer.</div>;

  return (
    <div>
      <div ref={printRef} className="w-[300px] bg-white p-2 border rounded shadow text-xs">
        <div className="center bold mb-2">NEO POS</div>
        <div className="center mb-2">{sale.shopName || 'Boutique'}</div>
        {sale.shopRCCM && (
          <div className="center mb-1">RCCM : {sale.shopRCCM}</div>
        )}
        {sale.shopIdNat && (
          <div className="center mb-1">ID NAT : {sale.shopIdNat}</div>
        )}
        {sale.shopOther && (
          <div className="center mb-1">{sale.shopOther}</div>
        )}
        <div className="mb-2">Date : {sale.date || new Date().toLocaleString()}</div>
        <div className="mb-2">Facture N° : {sale.id || '---'}</div>
        <hr className="my-2" />
        <table>
          <thead>
            <tr className="border-b">
              <th className="text-left">Article</th>
              <th className="text-right">Qté</th>
              <th className="text-right">Prix</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items && sale.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">{item.unitPrice}</td>
                <td className="text-right">{item.unitPrice * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span className="bold">Total</span>
          <span className="total">{sale.total} {getCurrencySymbol()}</span>
        </div>
        {sale.paid !== undefined && (
          <div className="flex justify-between">
            <span>Payé</span>
            <span>{sale.paid} {getCurrencySymbol()}</span>
          </div>
        )}
        {sale.change !== undefined && (
          <div className="flex justify-between">
            <span>Monnaie</span>
            <span>{sale.change} {getCurrencySymbol()}</span>
          </div>
        )}
        <div className="center mt-4">Merci pour votre achat !</div>
      </div>
      <button onClick={handlePrint} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full">Imprimer le ticket</button>
    </div>
  );
};

export default PosReceiptPrint;
