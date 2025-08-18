import React from 'react';
import { saleItems } from '../services/article.service';
import Button from './../components/ui/Button';
import { ShoppingCart } from 'lucide-react';
import { getCurrencySymbol } from '../utils/currency';

const ArticleItems = () => {
  const currency = getCurrencySymbol();
  return (
    <div className='flex flex-wrap justify-center items-center gap-16 p-4 font-golos'>
      {
        saleItems && saleItems.map((item) => (
          <div key={item.id} className="w-1/5 flex flex-col items-start justify-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer border">
            <img src={item.articleImage === null ? "images/ph.jpeg" : item.articleImage} alt={item.name} className="w-full h-44 object-fit mb-2 rounded-md" />
            <h3 className="text-lg font-semibold text-gray-800">{item.articleName}</h3>
            <p className="w-full text-md text-gray-600 flex justify-between gap-4">
              <span>stock</span>
              <span>{item.articleQuantityStock}</span>
            </p>
            <p className='w-full flex justify-between items-center'>
              <span className="text-xl font-bold text-red-600 mt-2">{item.articlePrice} {currency}</span>
              <Button className='flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-400 hover:text-white transition-colors duration-200'>
                <ShoppingCart className="w-5 h-5 mr-1" />
                ajouter
              </Button>
            </p>
          </div>
        ))
      }
    </div>
  );
}

export default ArticleItems;
