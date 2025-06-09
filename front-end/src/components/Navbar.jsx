import React from 'react';

import SearchForm from './ui/SearchForm';
import Button from './ui/Button';

import { Bell, ShoppingCart,Ellipsis } from 'lucide-react';

import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="sticky flex items-center justify-between px-4 py-6 md:w-full md:top-0 md:left-0 md:z-50 bg-white shadow-md border-b md:border-gray-200">
      <SearchForm/>
      <p className='text-red-600 font-semibold text-xl'><Link to="/stocks">10 Articles à court de Stocks</Link></p>
      <div className='flex items-center gap-4'>
        <Button className='w-12 h-12 p-2 flex justify-center items-center rounded-full bg-white border hover:bg-gray-100 transition-colors'>
            <Bell className=" text-zinc-500" />
        </Button>
        <Button className='w-12 h-12 p-2 flex justify-center items-center rounded-full bg-white border hover:bg-gray-100 transition-colors'>
            <ShoppingCart className=" text-zinc-500" />
        </Button>
        <Button className='w-12 h-12 p-2 flex justify-center items-center rounded-full bg-white border hover:bg-gray-100 transition-colors'>
            <Ellipsis className=" text-zinc-500" />
        </Button>
      </div>
      
    </nav>
  );
}

export default Navbar;
