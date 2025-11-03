import React, { useState, useRef, useEffect } from 'react';
import AboutModal from './AboutModal';
import { IdentifyIcon } from './icons/IdentifyIcon';

interface HeaderProps {
    onHomeClick: () => void;
    onStartBuilder: () => void;
    onGoToIdentifier: () => void;
}

const SandwichIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-4 6h4" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const BuilderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const AboutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ onHomeClick, onStartBuilder, onGoToIdentifier }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleStartBuilder = () => {
      onStartBuilder();
      setIsMenuOpen(false);
  }
  
  const handleOpenAbout = () => {
      setIsAboutModalOpen(true);
      setIsMenuOpen(false);
  }

  const handleHomeClick = () => {
      onHomeClick();
      setIsMenuOpen(false);
  }

  const handleIdentifierClick = () => {
    onGoToIdentifier();
    setIsMenuOpen(false);
  }

  return (
    <>
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center cursor-pointer"
            onClick={onHomeClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onHomeClick()}
            aria-label="На головну"
          >
            <ShieldIcon />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Система Захисту
              </h1>
              <p className="hidden sm:block text-sm text-green-200 font-light">
                  Інтерактивний довідник
              </p>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Меню"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
            >
                <SandwichIcon />
            </button>
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 animate-fade-in-down">
                    <button 
                        onClick={handleHomeClick}
                        className="group flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                        <HomeIcon />
                        <span>Повернутись на головну</span>
                    </button>
                    <button 
                        onClick={handleStartBuilder}
                        className="group flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                        <BuilderIcon />
                        <span>Підібрати препарати</span>
                    </button>
                    <button 
                        onClick={handleIdentifierClick}
                        className="group flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                        <IdentifyIcon />
                        <span>Визначити за фото</span>
                    </button>
                    <button 
                        onClick={handleOpenAbout}
                        className="group flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                        <AboutIcon />
                        <span>Про програму</span>
                    </button>
                </div>
            )}
          </div>
        </div>
      </header>
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </>
  );
};

export default Header;