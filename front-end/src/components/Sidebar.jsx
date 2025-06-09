import React from 'react';
import Logo from './Logo';
import SidebarItems from '../features/SidebarItems';
import ProfileAvatar from './ProfileAvatar';

const Sidebar = () => {
  return (
    <div className='md:w-68 border md:h-screen md:py-8 md:px-2 md:flex md:flex-col md:items-center md:justify-between md:gap-4 text-zinc-500'>
      <div className="">
        <Logo/>
        <SidebarItems />
      </div>
      <ProfileAvatar/>
    </div>

  );
}

export default Sidebar;
