import React from 'react';

export const BeetIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24">
        <defs>
            <radialGradient id="beetGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                <stop offset="0%" style={{stopColor: '#C71585'}} />
                <stop offset="100%" style={{stopColor: '#8B008B'}} />
            </radialGradient>
        </defs>
        <path fill="#006400" d="M12,2 L11,6 L13,6 Z M10,3 L9,7 L11,6 Z M14,3 L15,7 L13,6 Z"/>
        <circle cx="12" cy="15" r="6" fill="url(#beetGradient)" stroke="#4B0082" strokeWidth="0.5"/>
        <path d="M12,21 L12,23" fill="none" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);