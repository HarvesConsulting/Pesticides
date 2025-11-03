import React from 'react';

export const TomatoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24">
        <defs>
            <linearGradient id="tomatoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#ff6347', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#dc143c', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        <path fill="#228B22" d="M14.5,4.5 C14.5,4.5 14,3 12,3 C10,3 9.5,4.5 9.5,4.5 C9.5,4.5 10,6 12,6 C14,6 14.5,4.5 14.5,4.5 Z M12,3 L12,1 L15,2 L12,3 Z M12,3 L9,2 L12,1 Z"/>
        <circle cx="12" cy="14" r="7" fill="url(#tomatoGradient)" stroke="#B22222" strokeWidth="0.5"/>
        <path d="M12,7 C10,7 9,8.5 9,10.5 C9,12.5 11,14 12,14 C13,14 15,12.5 15,10.5 C15,8.5 14,7 12,7" fill="rgba(255,255,255,0.2)"/>
    </svg>
);