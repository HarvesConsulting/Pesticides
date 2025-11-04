
import React from 'react';

export const EggplantIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24">
        <defs>
            <linearGradient id="eggplantGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#8A2BE2'}} />
                <stop offset="100%" style={{stopColor: '#4B0082'}} />
            </linearGradient>
        </defs>
        <path fill="#006400" d="M12,2 C10,2 10,5 12,5 C14,5 14,2 12,2 Z M10,5 C9,5 9,6 10,6 L10,5Z M14,5 C15,5 15,6 14,6 L14,5Z"/>
        <path fill="url(#eggplantGradient)" stroke="#2F004F" strokeWidth="0.5" d="M12,5 C15,5 18,8 18,14 C18,20 15,22 12,22 C9,22 6,20 6,14 C6,8 9,5 12,5 Z"/>
        <path d="M15,8 C15.5,10 14,12 12,12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
    </svg>
);