import React from 'react';
import {Store} from 'lucide-react';

const Logo = () => {
  return (
    <div className="bg-red-100 p-2 rounded-md flex items-center justify-start gap-4 text-red-600">
        <Store className='w-5 h-5' />
        <span className='font-bold text-lg'>Pamoja</span>
    </div>
  );
}

export default Logo;