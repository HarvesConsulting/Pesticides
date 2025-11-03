import React from 'react';

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center text-gray-600 hover:text-green-700 font-semibold transition-colors mb-6 group"
      aria-label="Повернутись назад"
    >
      <div className="transform group-hover:-translate-x-1 transition-transform duration-200">
        <BackArrowIcon />
      </div>
      <span>Назад</span>
    </button>
  );
};

export default BackButton;