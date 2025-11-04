import React from 'react';

export const LeekIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24">
        <defs>
            <linearGradient id="leekGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#90EE90'}} />
                <stop offset="60%" style={{stopColor: '#FFFFFF'}} />
            </linearGradient>
             <linearGradient id="leekLeafGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#008000'}} />
                <stop offset="100%" style={{stopColor: '#2E8B57'}} />
            </linearGradient>
        </defs>
        <path fill="url(#leekGradient)" stroke="#E0E0E0" strokeWidth="0.5" d="M12,22 C11,22 11,10 11,10 L13,10 C13,10 13,22 12,22Z"/>
        <path fill="url(#leekLeafGradient)" d="M11,10 Q10,6 9,2" stroke="#006400" strokeWidth="0.5"/>
        <path fill="url(#leekLeafGradient)" d="M13,10 Q14,6 15,2" stroke="#006400" strokeWidth="0.5"/>
         <path fill="url(#leekLeafGradient)" d="M12,10 Q12,5 12,2" stroke="#006400" strokeWidth="0.5"/>
    </svg>
);