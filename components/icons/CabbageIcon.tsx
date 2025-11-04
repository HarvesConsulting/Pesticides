
import React from 'react';

export const CabbageIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24">
        <defs>
            <radialGradient id="cabbageGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: '#98FB98'}} />
                <stop offset="100%" style={{stopColor: '#2E8B57'}} />
            </radialGradient>
        </defs>
        <circle cx="12" cy="14" r="8" fill="url(#cabbageGradient)" stroke="#006400" strokeWidth="0.5"/>
        <path d="M5,16 C3,14 4,8 8,7" fill="none" stroke="#556B2F" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19,16 C21,14 20,8 16,7" fill="none" stroke="#556B2F" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8,19 C6,18 4,14 6,11" fill="none" stroke="#6B8E23" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16,19 C18,18 20,14 18,11" fill="none" stroke="#6B8E23" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);