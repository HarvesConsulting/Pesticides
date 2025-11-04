import React from 'react';

export const GarlicIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24">
        <defs>
            <radialGradient id="garlicGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: '#F5F5DC'}} />
                <stop offset="100%" style={{stopColor: '#D2B48C'}} />
            </radialGradient>
        </defs>
        <path fill="#556B2F" d="M12,2 L12.5,5 L11.5,5 Z"/>
        <ellipse cx="12" cy="15" rx="7" ry="6" fill="url(#garlicGradient)" stroke="#8B4513" strokeWidth="0.5"/>
        <path d="M12,9 C10,9 8,15 8,15" fill="none" stroke="#D2B48C" strokeWidth="1"/>
        <path d="M12,9 C14,9 16,15 16,15" fill="none" stroke="#D2B48C" strokeWidth="1"/>
        <path d="M9,15 C9,17 10,19 12,19" fill="none" stroke="#D2B48C" strokeWidth="1"/>
        <path d="M15,15 C15,17 14,19 12,19" fill="none" stroke="#D2B48C" strokeWidth="1"/>
    </svg>
);