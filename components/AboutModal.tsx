import React from 'react';
import { InstagramIcon } from './icons/InstagramIcon';

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

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 sm:p-8 relative animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Закрити"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 id="about-modal-title" className="text-2xl font-bold text-green-800 mb-4">Про програму</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            "Система Захисту Овочів" — це інструмент, розроблений для допомоги агрономам та городникам у виборі оптимальних засобів захисту рослин для різних культур.
          </p>
          <p>
            Додаток надає рекомендації щодо гербіцидів, фунгіцидів та інсектицидів, а також дозволяє генерувати інтегровані системи захисту на весь вегетаційний період.
          </p>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Зв'язок та пропозиції:</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <EmailIcon />
              <a href="mailto:lashyn.aleksandr@gmail.com" className="hover:underline">lashyn.aleksandr@gmail.com</a>
            </div>
            <div className="flex items-center text-gray-600">
              <InstagramIcon />
              <a href="https://www.instagram.com/harvest.consulting/" target="_blank" rel="noopener noreferrer" className="hover:underline">harvest.consulting</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
