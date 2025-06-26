import React from 'react';
import Cart from './Cart';

const Rightbar = () => {
  return (
    <div className='w-1/4 h-screen px-4 py-8 bg-white border-l hidden md:block'>
      <Cart />
    </div>
  );
}

export default Rightbar;
