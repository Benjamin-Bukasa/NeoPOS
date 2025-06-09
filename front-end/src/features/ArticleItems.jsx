import React from 'react';
import { saleItems } from '../services/article.service';

const ArticleItems = () => {
  return (
      <div className='flex flex-wrap justify-center items-center gap-16 p-4'>
            {
        saleItems && saleItems.map((item) => (
          <div key={item.id} className="w-1/5 flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover mb-2 rounded-md" />
            <h3 className="text-lg font-semibold text-gray-800">{item.articleName}</h3>
            <p className="text-sm text-gray-600 flex justify-between gap-4">
                <span>Quantité en stock</span>
                <span>{item.articleQuantityStock}</span>
            </p>
            <span className="text-xl font-bold text-red-600 mt-2">${item.articlePrice}</span>
          </div>
        ))
            }
        </div>
  );
}

export default ArticleItems;
