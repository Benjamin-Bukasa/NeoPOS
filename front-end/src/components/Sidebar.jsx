import React from 'react';
import Logo from './Logo';
import SidebarItems from '../features/SidebarItems';
import ProfileAvatar from './ProfileAvatar';

const Sidebar = () => {
  return (
    <div className='md:w-64 md:h-screen md:p-4 md:flex md:flex-col md:items-start md:justify-between md:gap-4'>
      <Logo/>
      <SidebarItems />
      <ProfileAvatar/>
    </div>
  );
}

export default Sidebar;
