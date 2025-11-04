
import React from 'react';

export const DaikonIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24">
        <defs>
            <linearGradient id="daikonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#FFFFFF'}} />
                <stop offset="100%" style={{stopColor: '#F5F5F5'}} />
            </linearGradient>
        </defs>
        <path fill="#228B22" d="M12,2 L11,5 L10,3 L9,5 L8,3 L7,5 L8,6 L9,5 L10,6 L11,5 L12,6 L13,5 L14,6 L15,5 L16,6 L17,5 L16,3 L15,5 L14,3 L13,5 L12,2 Z"/>
        <path fill="url(#daikonGradient)" stroke="#DCDCDC" strokeWidth="0.5" d="M12,6 C12,6 14,14 12,22 C12,22 10,14 12,6 Z"/>
    </svg>
);