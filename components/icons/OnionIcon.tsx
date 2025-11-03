import React from 'react';

export const OnionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24">
        <defs>
            <linearGradient id="onionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#F4A460'}} />
                <stop offset="100%" style={{stopColor: '#D2691E'}} />
            </linearGradient>
        </defs>
        <path fill="#556B2F" d="M12,2 L13,5 L11,5 Z"/>
        <path fill="#90EE90" d="M12,5 L12,2 L14,4 Z M12,5 L12,2 L10,4 Z"/>
        <ellipse cx="12" cy="14" rx="7" ry="6" fill="url(#onionGradient)" stroke="#8B4513" strokeWidth="0.5"/>
        <path d="M12,8 C9,8 6,11 6,14 C6,17 9,20 12,20 C15,20 18,17 18,14 C18,11 15,8 12,8" fill="none" stroke="#CD853F" strokeWidth="1" strokeDasharray="2 2"/>
    </svg>
);