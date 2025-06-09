import React from 'react';
import { Search } from 'lucide-react';

const SearchForm = () => {
  return (
    <form className='w-1/3 px-1 flex items-center justify-center gap-2 bg-white rounded-full border'>
      <input type="text" name="" id="" className='flex-1 py-2 px-4 bg-transparent outline-none rounded-full text-xl'/>
      <button className='p-2 rounded-full hover:bg-gray-100 transition-colors'>
        <Search className="h-8 w-8 text-zinc-500" />
      </button>
    </form>
  );
}

export default SearchForm;
