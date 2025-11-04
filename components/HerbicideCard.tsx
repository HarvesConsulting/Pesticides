

import React, { useState } from 'react';
import { Herbicide } from '../types';

interface HerbicideCardProps {
  herbicide: Herbicide;
}

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const HerbicideCard: React.FC<HerbicideCardProps> = ({ herbicide }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasSpectrum = herbicide.spectrum.sensitive.length > 0 || herbicide.spectrum.moderatelySensitive.length > 0 || herbicide.spectrum.resistant.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
                <h4 className="text-xl font-bold text-green-800">{herbicide.productName}</h4>
                <p className="text-md text-gray-600">{herbicide.activeIngredient}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-white ${herbicide.applicationTime === 'до' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                        {herbicide.applicationTime === 'до' ? 'Досходовий' : 'Післясходовий'}
                    </span>
                    <span className="text-gray-500">Реєстрація в UA: <span className={`font-semibold ${herbicide.registrationUA === '+' ? 'text-green-600' : 'text-red-500'}`}>{herbicide.registrationUA}</span></span>
                </div>
            </div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="mt-4 sm:mt-0 flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="mr-2 text-gray-600 text-sm">Деталі</span>
                <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDownIcon />
                </div>
            </button>
        </div>
      </div>
      {isOpen && (
        <div className="px-4 sm:px-6 pb-6 pt-4 border-t border-gray-200 bg-gray-50 animate-fade-in-down">
          <p className="text-gray-700 mb-4">{herbicide.description}</p>
          
          {hasSpectrum && (
              <div className="mb-4">
                  <h5 className="font-semibold text-gray-800 mb-2">Вплив на бур'яни:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {herbicide.spectrum.sensitive.length > 0 && <div><h6 className="font-medium text-green-700">Чутливі:</h6><ul className="list-disc list-inside text-gray-600"> {herbicide.spectrum.sensitive.map(s => <li key={s}>{s}</li>)} </ul></div>}
                      {herbicide.spectrum.moderatelySensitive.length > 0 && <div><h6 className="font-medium text-yellow-700">Середньочутливі:</h6><ul className="list-disc list-inside text-gray-600"> {herbicide.spectrum.moderatelySensitive.map(s => <li key={s}>{s}</li>)} </ul></div>}
                      {herbicide.spectrum.resistant.length > 0 && <div><h6 className="font-medium text-red-700">Стійкі:</h6><ul className="list-disc list-inside text-gray-600"> {herbicide.spectrum.resistant.map(s => <li key={s}>{s}</li>)} </ul></div>}
                  </div>
              </div>
          )}

          <div>
            <h5 className="font-semibold text-gray-800 mb-2">Норма та строки внесення:</h5>
            <p className="text-gray-700 text-sm">{herbicide.applicationInfo}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HerbicideCard;