import React from 'react';
import { Fungicide, PlotType } from '../types';

interface FungicideCardProps {
  fungicide: Fungicide;
  plotType: PlotType;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const XIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const FungicideCard: React.FC<FungicideCardProps> = ({ fungicide, plotType }) => {
  const controls = [
    { label: 'Бактеріози', controlled: fungicide.controls.bacteriosis },
    { label: 'Фітофтора', controlled: fungicide.controls.phytophthora },
    { label: 'Гнилі', controlled: fungicide.controls.rots },
    { label: 'Кореневі гнилі', controlled: fungicide.controls.rootRots },
  ];

  const rate = plotType === 'home' ? fungicide.rateHome : fungicide.rateField;
  
  const categoryInfo: { [key in 1 | 2 | 3]: { label: string; className: string } } = {
    1: { label: 'Контактний', className: 'bg-sky-100 text-sky-800' },
    2: { label: 'Системний', className: 'bg-amber-100 text-amber-800' },
    3: { label: 'Біологічний', className: 'bg-emerald-100 text-emerald-800' },
  };
  
  const category = categoryInfo[fungicide.category];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start">
        <div>
          <h4 className="text-xl font-bold text-blue-800">{fungicide.productName}</h4>
          <p className="text-md text-gray-600 mb-3">{fungicide.activeIngredient}</p>
          <div className="flex flex-wrap gap-2 items-center">
             {rate && (
              <p className="text-sm font-semibold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-md inline-block">
                  Норма: <span className="text-green-700 font-bold">{rate}</span>
              </p>
             )}
            {category && (
                <span className={`text-sm font-semibold px-3 py-1.5 rounded-md inline-block ${category.className}`}>
                    {category.label}
                </span>
            )}
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {controls.map(control => (
            <div key={control.label} className="flex items-center space-x-2">
              {control.controlled ? <CheckIcon /> : <XIcon />}
              <span className="text-gray-700">{control.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FungicideCard;
