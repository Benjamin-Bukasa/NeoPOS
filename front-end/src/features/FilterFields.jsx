// components/FilterFields.jsx
import React from 'react';

const FilterFields = ({
  category, setCategory,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  color, setColor,
  barcodeInput, setBarcodeInput,
  handleBarcodeScan
}) => {
  return (
    <div className="sticky top-10 flex flex-wrap gap-4 items-end mb-6 justify-between">
      {/* Catégorie */}
      <div className="flex flex-col">
        <label className="text-sm">Catégorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded-md outline-none"
        >
          <option value="">Toutes</option>
          <option value="clothing">Clothing</option>
          <option value="footwear">Footwear</option>
          <option value="outerwear">Outerwear</option>
          <option value="accessories">Accessories</option>
          <option value="bags">Bags</option>
        </select>
      </div>

      {/* Prix min */}
      <div className="flex flex-col">
        <label className="text-sm">Prix min (€)</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-3 py-2 rounded-md outline-none"
          placeholder="0"
        />
      </div>

      {/* Prix max */}
      <div className="flex flex-col">
        <label className="text-sm">Prix max (€)</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-3 py-2 rounded-md outline-none"
          placeholder="500"
        />
      </div>

      {/* Couleur */}
      <div className="flex flex-col">
        <label className="text-sm">Couleur</label>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border px-3 py-2 rounded-md outline-none"
          placeholder="Ex: Black"
        />
      </div>

      {/* Code-barres */}
      <div className="flex flex-col">
        <label className="text-sm">Code-barres</label>
        <input
          type="text"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          onKeyDown={handleBarcodeScan}
          className="border px-3 py-2 rounded-md outline-none"
          placeholder="Scannez et appuyez sur Entrée"
        />
      </div>
    </div>
  );
};

export default FilterFields;
