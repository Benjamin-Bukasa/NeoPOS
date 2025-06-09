import React from 'react';
import { Link } from 'react-router-dom';
import { sidebarService } from '../services/sidebar.service';



const SidebarItems = () => {
  return (
    <ul className='md:w-full md:flex md:flex-col md:gap-2 md:py-4 md:text-sm'>
      {
        sidebarService.map((item) => (
          <li key={item.id} className=" md:hover:text-red-600 hover:bg-red-100 md:p-2 md:rounded-md transition-colors duration-200">
            <Link to={`/${item.link.toLowerCase()}`} className="md:w-full md:flex md:flex-col md:items-center md:justify-start md:gap-2 cursor-pointer">
            <item.icon className="md:w-5 md:h-5" />
            <span className='font-golos font-semibold'>{item.name}</span>
            </Link>
          </li>
        ))
      }
    </ul>
  );
}

export default SidebarItems;
