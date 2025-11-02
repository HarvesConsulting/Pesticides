import React, { useState, useRef, useEffect } from 'react';
import AboutModal from './AboutModal';

interface HeaderProps {
    onHomeClick: () => void;
    onStartBuilder: () => void;
}

const SandwichIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-4 6h4" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ onHomeClick, onStartBuilder }) => {
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

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="cursor-pointer"
            onClick={onHomeClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onHomeClick()}
            aria-label="На головну"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-green-700">
              Система Захисту
            </h1>
            <p className="hidden sm:block text-sm text-gray-500">
                Інтерактивний довідник
            </p>
          </div>

          <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg border-2 border-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Меню"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
            >
                <SandwichIcon />
            </button>
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50 animate-fade-in-down">
                    <button 
                        onClick={handleHomeClick}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                        Повернутись на головну
                    </button>
                    <button 
                        onClick={handleStartBuilder}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                        Підібрати препарати
                    </button>
                    <button 
                        onClick={handleOpenAbout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                        Про програму
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