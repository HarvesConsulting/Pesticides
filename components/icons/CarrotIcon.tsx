import React from 'react';

export const CarrotIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24">
        <defs>
            <linearGradient id="carrotGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#FFA500'}} />
                <stop offset="100%" style={{stopColor: '#FF8C00'}} />
            </linearGradient>
        </defs>
        <path fill="#228B22" d="M12,2 L11,5 L10,3 L9,5 L8,3 L7,5 L8,6 L9,5 L10,6 L11,5 L12,6 L13,5 L14,6 L15,5 L16,6 L17,5 L16,3 L15,5 L14,3 L13,5 L12,2 Z"/>
        <path fill="url(#carrotGradient)" stroke="#E65100" strokeWidth="0.5" d="M12,6 C12,6 15,12 12,22 C12,22 9,12 12,6 Z"/>
        <path d="M12,9 L13,11" fill="none" stroke="#FFD700" strokeWidth="0.5"/>
        <path d="M12,12 L11,14" fill="none" stroke="#FFD700" strokeWidth="0.5"/>
        <path d="M12,15 L13,17" fill="none" stroke="#FFD700" strokeWidth="0.5"/>
    </svg>
);