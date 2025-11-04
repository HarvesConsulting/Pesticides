import React from 'react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onGoHome: () => void;
    onStartBuilder: () => void;
    onGoToIdentifier: () => void;
    onOpenAbout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onGoHome, onStartBuilder, onGoToIdentifier, onOpenAbout }) => {
    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-bold text-lg text-gray-800">Меню</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <button onClick={onGoHome} className="w-full text-left px-4 py-3 rounded-md text-gray-700 font-semibold hover:bg-gray-100 hover:text-green-700 transition-colors">
                                На головну
                            </button>
                        </li>
                        <li>
                            <button onClick={onStartBuilder} className="w-full text-left px-4 py-3 rounded-md text-gray-700 font-semibold hover:bg-gray-100 hover:text-green-700 transition-colors">
                                Створити систему захисту
                            </button>
                        </li>
                        <li>
                            <button onClick={onGoToIdentifier} className="w-full text-left px-4 py-3 rounded-md text-gray-700 font-semibold hover:bg-gray-100 hover:text-green-700 transition-colors">
                                Визначити за фото
                            </button>
                        </li>
                        <li>
                            <button onClick={onOpenAbout} className="w-full text-left px-4 py-3 rounded-md text-gray-700 font-semibold hover:bg-gray-100 hover:text-green-700 transition-colors">
                                Про програму
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;