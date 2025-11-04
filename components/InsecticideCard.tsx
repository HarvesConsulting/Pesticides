
import React from 'react';
import { Insecticide, PlotType } from '../types';

interface InsecticideCardProps {
  insecticide: Insecticide;
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


const InsecticideCard: React.FC<InsecticideCardProps> = ({ insecticide, plotType }) => {
  const controls = [
    { label: 'Тлі', controlled: insecticide.controls.aphids },
    { label: 'Трипси', controlled: insecticide.controls.thrips },
    { label: 'Білокрилка', controlled: insecticide.controls.whiteflies },
    { label: 'Кліщі', controlled: insecticide.controls.mites },
    { label: 'Лускокрилі', controlled: insecticide.controls.lepidoptera },
    { label: 'Твердокрилі', controlled: insecticide.controls.coleoptera },
  ];

  const rate = plotType === 'home' ? insecticide.rateHome : insecticide.rateField;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start">
        <div>
          <h4 className="text-xl font-bold text-red-800">{insecticide.productName}</h4>
          <p className="text-md text-gray-600 mb-2">{insecticide.activeIngredient}</p>
          {rate && (
            <p className="text-sm font-semibold text-gray-800 bg-green-50 px-3 py-1.5 rounded-md inline-block">
                Норма: <span className="text-green-700 font-bold">{rate}</span>
            </p>
          )}
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

export default InsecticideCard;