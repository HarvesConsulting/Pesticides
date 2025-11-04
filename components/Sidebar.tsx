import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { BuildIcon } from './icons/BuildIcon';
import { IdentifyIcon } from './icons/IdentifyIcon';
import { InfoIcon } from './icons/InfoIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { EmailIcon } from './icons/EmailIcon';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onGoHome: () => void;
    onStartBuilder: () => void;
    onGoToIdentifier: () => void;
    onOpenAbout: () => void;
}

const NavItem: React.FC<{ onClick?: () => void; href?: string; children: React.ReactNode }> = ({ onClick, href, children }) => {
    const commonClasses = "w-full flex items-center text-left px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-green-50 hover:text-green-700 transition-colors group";

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={commonClasses}>
                {children}
            </a>
        );
    }
    return (
        <button onClick={onClick} className={commonClasses}>
            {children}
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onGoHome, onStartBuilder, onGoToIdentifier, onOpenAbout }) => {
    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-gray-50 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-5 border-b bg-white">
                    <h2 className="font-bold text-lg text-gray-800">Меню</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="flex-grow p-4">
                    <ul className="space-y-2">
                        <li>
                            <NavItem onClick={onGoHome}>
                                <HomeIcon />
                                На головну
                            </NavItem>
                        </li>
                        <li>
                            <NavItem onClick={onStartBuilder}>
                                <BuildIcon />
                                Створити систему захисту
                            </NavItem>
                        </li>
                        <li>
                            <NavItem onClick={onGoToIdentifier}>
                                <IdentifyIcon />
                                Визначити за фото
                            </NavItem>
                        </li>
                        <li>
                            <NavItem href="https://mepr.gov.ua/upravlinnya-vidhodamy/derzhavnyj-reyestr-pestytsydiv-i-agrohimikativ-dozvolenyh-do-vykorystannya-v-ukrayini/">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 group-hover:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Перелік пестицидів
                                <ExternalLinkIcon />
                            </NavItem>
                        </li>
                        <li>
                            <NavItem onClick={onOpenAbout}>
                                <InfoIcon />
                                Про програму
                            </NavItem>
                        </li>
                    </ul>
                </nav>
                <div className="p-5 border-t text-sm text-gray-600 bg-white">
                    <h3 className="font-semibold text-gray-800 mb-2">Зв'язок та пропозиції:</h3>
                    <div className="flex items-center">
                        <EmailIcon />
                        <a href="mailto:lashyn.aleksandr@gmail.com" className="hover:underline">lashyn.aleksandr@gmail.com</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
