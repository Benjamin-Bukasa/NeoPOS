import React, { useEffect, useState } from 'react';

import SearchForm from './ui/SearchForm';
import Button from './ui/Button';

import { Bell, ShoppingCart, Ellipsis } from 'lucide-react';
import Modal from './ui/Modal';
import useAuthStore from '../stores/authStore';
import { X } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

import { Link } from 'react-router-dom';



const Navbar = () => {
  const [stockAlertCount, setStockAlertCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const ellipsisRef = React.useRef(null);
  const user = useAuthStore(state => state.user);
  const cart = useCartStore(state => state.cart);
  const totalCartItems = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);

  useEffect(() => {
    fetch('/pamoja/api/stock-alerts')
      .then(res => res.json())
      .then(data => setStockAlertCount(data.count || 0))
      .catch(() => setStockAlertCount(0));
  }, []);

  return (
    <nav className=" sticky flex items-center justify-between px-4 py-6 md:w-full md:top-0 md:left-0  bg-white shadow-md border-b md:border-gray-200">
      <SearchForm/>
      <p className='text-red-600 font-bold text-xl px-4 py-2 bg-red-100 rounded-lg font-golos'>
        <Link to="/stocks">
          {stockAlertCount > 0
            ? `${stockAlertCount} Article${stockAlertCount > 1 ? 's' : ''} à court de Stocks`
            : 'Aucun article à court de Stocks'}
        </Link>
      </p>
      <div className='flex items-center gap-4'>
        <Button className='w-12 h-12 p-2 flex justify-center items-center rounded-full bg-white border hover:bg-gray-100 transition-colors'>
            <Bell className=" text-zinc-500" />
        </Button>
        <Button className='relative w-12 h-12 p-2 flex justify-center items-center rounded-full bg-white border hover:bg-gray-100 transition-colors'>
            <ShoppingCart className=" text-zinc-500" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
                {totalCartItems}
              </span>
            )}
        </Button>
        <Button
          ref={ellipsisRef}
          className='w-12 h-12 p-2 flex justify-center items-center rounded-full bg-white border hover:bg-gray-100 transition-colors'
          onClick={() => setModalOpen(true)}
        >
            <Ellipsis className=" text-zinc-500" />
        </Button>
      </div>
  <Modal open={modalOpen} onClose={() => setModalOpen(false)} zIndex={11000} anchorRef={ellipsisRef}>
        <button
          className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-700 transition-colors"
          onClick={() => setModalOpen(false)}
          aria-label="Fermer le modal"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center gap-3 p-2 min-w-[260px]">
          <span className="text-lg font-bold text-blue-700 mb-1">Utilisateur connecté</span>
          <div className="flex flex-col items-center gap-1 w-full">
            <span className="text-base text-gray-900 font-semibold">{user?.name || user?.username || user?.email || 'Non connecté'}</span>
            {user?.email && (
              <span className="text-sm text-gray-500">{user.email}</span>
            )}
            {user?.role && (
              <span className="text-xs mt-1 px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">Rôle : {user.role}</span>
            )}
          </div>
        </div>
      </Modal>
    </nav>
  );
}

export default Navbar;
