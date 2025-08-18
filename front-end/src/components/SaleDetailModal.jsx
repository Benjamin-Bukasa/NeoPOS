
import React from "react";
import { ShoppingCart, Package, Layers, Euro, Ticket, User, CalendarDays, X, FileSpreadsheet, Printer } from 'lucide-react';
import html2pdf from 'html2pdf.js';



const SaleDetailModal = ({ ticket, onClose }) => {
  if (!ticket || !Array.isArray(ticket)) return null;
  const first = ticket[0];
  const total = ticket.reduce((acc, s) => acc + s.price * s.quantitySold, 0);
  // Impression ticket POS-80 style provisoire
  const handlePrint = () => {
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
    const date = `<div style='text-align:center;font-size:11px;margin-bottom:6px;'>${new Date(first.date).toLocaleString()}</div>`;
    const sellerHtml = `<div style='text-align:center;font-size:12px;margin-bottom:4px;'>Vendeur : ${first.sellerName}</div>`;
    const items = ticket.map(item =>
      `<tr>
        <td style='padding:2px 0;'>${item.articleName}</td>
        <td style='text-align:right;padding:2px 0;'>${item.quantitySold}</td>
        <td style='text-align:right;padding:2px 0;'>${(item.price * item.quantitySold).toFixed(2)} $</td>
      </tr>`
    ).join('');
    const table = `<table style='width:90%;font-size:12px;border-collapse:collapse;'><thead><tr style='border-bottom:1px solid #ccc;'><th style='text-align:left;'>Article</th><th style='text-align:right;'>Qté</th><th style='text-align:right;'>Prix TTC</th></tr></thead><tbody>${items}</tbody></table>`;
    const separator = `<hr style='border:none;border-top:1px dashed #888;margin:8px 0;' />`;
    const totalHtml = `${separator}<div style='font-weight:bold;text-align:right;font-size:15px;'>Total : ${total.toFixed(2)} $</div>`;
    const thanks = `<div style='text-align:center;margin-top:10px;font-size:12px;'>Merci pour votre achat !</div>`;
    // Largeur POS-80 (80mm)
    const content = `<div style='width:80mm;max-width:100%;padding:2mm 0 2mm 0;'>${header}${date}${sellerHtml}${table}${totalHtml}${thanks}</div>`;
    // Génère le PDF avec html2pdf.js
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    document.body.appendChild(tempDiv);
    const pxToMm = px => px * 0.264583;
    const contentHeightPx = tempDiv.offsetHeight;
    const contentHeightMm = Math.ceil(pxToMm(contentHeightPx)) + 2;
    document.body.removeChild(tempDiv);
    const opt = {
      margin: [2, 4, 2, 4],
      filename: 'ticket-pos.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: [80, contentHeightMm], orientation: 'portrait' },
      output: '',
    };
    html2pdf().set(opt).from(tempDiv).outputPdf('bloburl').then((pdfUrl) => {
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
  return (
    <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          Détail du ticket #{first.ticketNo}
        </h2>
        <div className="mb-2 text-sm text-gray-500 flex flex-col gap-1">
          <span>Vendeur : <span className="font-semibold text-gray-700">{first.sellerName}</span></span>
          <span>Date : <span className="font-semibold text-gray-700">{new Date(first.date).toLocaleString("fr-FR")}</span></span>
        </div>
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Article</th>
              <th className="p-2 text-right">Qté</th>
              <th className="p-2 text-right">Prix</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {ticket.map((sale, idx) => (
              <tr key={idx}>
                <td className="p-2">{sale.articleName}</td>
                <td className="p-2 text-right">{sale.quantitySold}</td>
                <td className="p-2 text-right">€{sale.price.toFixed(2)}</td>
                <td className="p-2 text-right">€{(sale.price * sale.quantitySold).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-50">
              <td className="p-2 text-right" colSpan={3}>Total ticket</td>
              <td className="p-2 text-right">€{total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-6 flex justify-between items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Printer className="w-5 h-5" /> Imprimer
          </button>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Fermer
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default SaleDetailModal;
