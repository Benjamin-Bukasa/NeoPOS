import React from 'react';
import {Store} from 'lucide-react';

const Logo = () => {
  return (
    <div className="bg-red-200 p-2 rounded-md flex items-center justify-center">
        <Store className='w-8 h-8 text-red-600' />
    </div>
  );
}

export default Logo;
