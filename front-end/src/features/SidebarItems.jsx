import React from 'react';
import { Link } from 'react-router-dom';
import { sidebarService } from '../services/sidebar.service';



const SidebarItems = () => {
  return (
    <ul className='md:w-full md:flex md:flex-col md:gap-2 md:p-4 md:text-sm'>
      {
        sidebarService.map((item) => (
          <li key={item.id} className="md:flex md:items-center md:justify-between md:gap-4">
            <Link to={`/${item.name.toLowerCase()}`} className="">
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
