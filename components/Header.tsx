import React from 'react';
import { MenuIcon } from './icons/MenuIcon';

interface HeaderProps {
    onHomeClick: () => void;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, onMenuClick }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center cursor-pointer"
          onClick={onHomeClick}
        >
          <svg className="w-10 h-10 text-green-600 mr-3" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
          </svg>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 hidden sm:block">Система Захисту Овочів</h1>
        </div>
        <div>
            <button 
              onClick={onMenuClick} 
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label="Відкрити меню"
            >
                <MenuIcon />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
