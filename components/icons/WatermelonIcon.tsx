import React from 'react';

export const WatermelonIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24">
        <defs>
            <radialGradient id="pumpkinGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: '#FFD700'}} />
                <stop offset="100%" style={{stopColor: '#FFA500'}} />
            </radialGradient>
        </defs>
        <path fill="#8B4513" d="M12,2 C10,2 10,4 12,4 C14,4 14,2 12,2 Z M10,4 C9,4 9,5 10,5 L10,4Z M14,4 C15,4 15,5 14,5 L14,4Z"/>
        <ellipse cx="12" cy="14" rx="9" ry="7" fill="url(#pumpkinGradient)" stroke="#D2691E" strokeWidth="0.5" />
        <path d="M12,5 V21" stroke="#E67E22" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6,10 C8,5 16,5 18,10" fill="none" stroke="#E67E22" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6,18 C8,23 16,23 18,18" fill="none" stroke="#E67E22" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);