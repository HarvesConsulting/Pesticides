import React from 'react';
import { MenuIcon } from './icons/MenuIcon';

interface HeaderProps {
    onHomeClick: () => void;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, onMenuClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center cursor-pointer group"
          onClick={onHomeClick}
        >
          <svg className="w-11 h-11 text-green-600 mr-3 group-hover:scale-105 transition-transform duration-300 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
          </svg>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 leading-tight">
              Система Захисту Овочів
            </h1>
            <p className="text-xs text-gray-500">оновлено 04.11.2025</p>
          </div>
        </div>
        <div>
            <button 
              onClick={onMenuClick} 
              className="p-2 rounded-full text-gray-700 hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
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