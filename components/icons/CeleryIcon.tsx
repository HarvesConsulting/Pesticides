
import React from 'react';

export const CeleryIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24">
        <defs>
            <linearGradient id="celeryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#90EE90'}} />
                <stop offset="100%" style={{stopColor: '#3CB371'}} />
            </linearGradient>
        </defs>
        <path fill="url(#celeryGradient)" stroke="#2E8B57" strokeWidth="0.5" d="M12,22 C10,22 10,12 10,12 L14,12 C14,12 14,22 12,22Z"/>
        <path fill="url(#celeryGradient)" stroke="#2E8B57" strokeWidth="0.5" d="M10,12 C8,12 8,10 9,10 L11,12"/>
        <path fill="url(#celeryGradient)" stroke="#2E8B57" strokeWidth="0.5" d="M14,12 C16,12 16,10 15,10 L13,12"/>
        <path fill="#228B22" d="M9,10 C8,8 9,6 10,5 L9,10Z"/>
        <path fill="#228B22" d="M15,10 C16,8 15,6 14,5 L15,10Z"/>
        <path fill="#228B22" d="M12,12 C11,10 12,8 12,6 L12,12Z"/>
    </svg>
);