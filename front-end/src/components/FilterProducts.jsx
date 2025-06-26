import React from 'react';
import Button from './ui/Button';
import { Search } from 'lucide-react';

const FilterProducts = () => {
  return (
    <div className='flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200'>
      <form className='bg-zinc-200'>
        <input type="text" name="" id="" placeholder='Chercher un article'/>
        <Button className="">
            <Search className="h-4 w-4 text-zinc-600" />
        </Button>
      </form>
      <div className=""></div>
    </div>
  );
}

export default FilterProducts;
