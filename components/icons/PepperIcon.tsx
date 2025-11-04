
import React from 'react';

export const PepperIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24">
        <defs>
            <linearGradient id="pepperGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#FF4136'}} />
                <stop offset="100%" style={{stopColor: '#8B0000'}} />
            </linearGradient>
        </defs>
        <path fill="#006400" d="M12 2a2 2 0 0 1 2 2h-4a2 2 0 0 1 2-2z M10 4h4v2h-4z"/>
        <path fill="url(#pepperGradient)" stroke="#8B0000" strokeWidth="0.5" d="M18,9 C18,13 16,21 12,21 C8,21 6,13 6,9 C6,6 8,6 12,6 C16,6 18,6 18,9 Z M12,21 C10,16 10,9 10,9 M12,21 C14,16 14,9 14,9"/>
        <path d="M16,9 C16,11 15,12 14.5,13" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
    </svg>
);