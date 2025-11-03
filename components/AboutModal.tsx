import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
    </svg>
);


const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-down"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Закрити"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-green-700 mb-4">Про програму</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
            Цей інтерактивний довідник створений, щоб допомогти агрономам швидко та ефективно підбирати системи захисту для овочевих культур. 
            Ви можете ознайомитись з топ-препаратами на ринку або скористатись конструктором для створення індивідуальної схеми захисту для вашої культури.
            </p>
            <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Контакти для консультацій:</h3>
                <div className="space-y-2">
                    <a href="mailto:lashyn.aleksandr@gmail.com" className="flex items-center text-blue-600 hover:underline">
                        <EmailIcon />
                        <span>lashyn.aleksandr@gmail.com</span>
                    </a>
                    <a href="https://www.instagram.com/harvest.consulting/" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                        <InstagramIcon />
                        <span>harvest.consulting</span>
                    </a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;