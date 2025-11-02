import React from 'react';
import { CropType } from '../types';
import { TomatoIcon } from './icons/TomatoIcon';
import { PepperIcon } from './icons/PepperIcon';
import { CabbageIcon } from './icons/CabbageIcon';
import { OnionIcon } from './icons/OnionIcon';
import { CarrotIcon } from './icons/CarrotIcon';
import { WatermelonIcon } from './icons/WatermelonIcon';
import { EggplantIcon } from './icons/EggplantIcon';
import { BeetIcon } from './icons/BeetIcon';
import { CeleryIcon } from './icons/CeleryIcon';

interface CropSelectorProps {
  selectedCrop: CropType | null;
  onSelectCrop: (crop: CropType) => void;
}

const CropSelector: React.FC<CropSelectorProps> = ({ selectedCrop, onSelectCrop }) => {
  const options = [
    { type: CropType.Tomato, label: 'Томат', icon: <TomatoIcon /> },
    { type: CropType.Pepper, label: 'Перець', icon: <PepperIcon /> },
    { type: CropType.Cabbage, label: 'Капуста', icon: <CabbageIcon /> },
    { type: CropType.Onion, label: 'Цибуля', icon: <OnionIcon /> },
    { type: CropType.Carrot, label: 'Морква', icon: <CarrotIcon /> },
    { type: CropType.Pumpkin, label: 'Гарбузові', icon: <WatermelonIcon /> },
    { type: CropType.Eggplant, label: 'Баклажан', icon: <EggplantIcon /> },
    { type: CropType.Beet, label: 'Буряк', icon: <BeetIcon /> },
    { type: CropType.Celery, label: 'Селера', icon: <CeleryIcon /> },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {options.map((option) => (
        <button
          key={option.type}
          onClick={() => onSelectCrop(option.type)}
          className={`p-6 rounded-lg shadow-lg border-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center justify-center text-center
            ${selectedCrop === option.type
              ? 'bg-green-600 text-white border-green-700 scale-105'
              : 'bg-white text-gray-700 border-transparent hover:border-green-500'
            }`}
        >
          <div className="w-16 h-16 mb-4 text-gray-800">{option.icon}</div>
          <span className="text-2xl font-semibold">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CropSelector;