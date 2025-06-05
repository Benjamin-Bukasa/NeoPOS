import React from 'react';

const ProfileAvatar = () => {
  return (
    <div className='flex flex-col items-center justify-center w-12 h-12 bg-gray-200 rounded-full'>
      <img src="https://via.placeholder.com/150" alt="Profile Avatar" className='w-full h-full rounded-full' />
      <span className='absolute text-xs font-semibold text-gray-700'>Profile</span>
    </div>
  );
}

export default ProfileAvatar;
