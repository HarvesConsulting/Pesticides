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
import { LeekIcon } from './icons/LeekIcon';
import { DaikonIcon } from './icons/DaikonIcon';
import { GarlicIcon } from './icons/GarlicIcon';

interface CropSelectorProps {
  selectedCrop: CropType | null;
  onSelectCrop: (crop: CropType) => void;
}

const CropSelector: React.FC<CropSelectorProps> = ({ selectedCrop, onSelectCrop }) => {
  const options = [
    { type: CropType.Tomato, label: 'Томат', icon: <TomatoIcon />, disabled: false },
    { type: CropType.Pepper, label: 'Перець', icon: <PepperIcon />, disabled: false },
    { type: CropType.Cabbage, label: 'Капуста', icon: <CabbageIcon />, disabled: false },
    { type: CropType.Onion, label: 'Цибуля', icon: <OnionIcon />, disabled: false },
    { type: CropType.Carrot, label: 'Морква', icon: <CarrotIcon />, disabled: false },
    { type: CropType.Pumpkin, label: 'Гарбузові', icon: <WatermelonIcon />, disabled: false },
    { type: CropType.Eggplant, label: 'Баклажан', icon: <EggplantIcon />, disabled: false },
    { type: CropType.Beet, label: 'Буряк', icon: <BeetIcon />, disabled: false },
    { type: CropType.Celery, label: 'Селера', icon: <CeleryIcon />, disabled: false },
    { type: CropType.Leek, label: 'Порей', icon: <LeekIcon />, disabled: true },
    { type: CropType.Daikon, label: 'Дайкон', icon: <DaikonIcon />, disabled: true },
    { type: CropType.Garlic, label: 'Часник', icon: <GarlicIcon />, disabled: true },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {options.map((option) => (
        <button
          key={option.type}
          onClick={() => onSelectCrop(option.type)}
          disabled={option.disabled}
          className={`relative p-6 rounded-lg shadow-lg border-2 transition-all duration-300 ease-in-out transform flex flex-col items-center justify-center text-center
            ${selectedCrop === option.type
              ? 'bg-green-600 text-white border-green-700 scale-105'
              : 'bg-white text-gray-700 border-transparent'
            }
            ${option.disabled
              ? 'opacity-50 cursor-not-allowed bg-gray-100'
              : 'hover:-translate-y-1 hover:border-green-500'
            }`}
        >
          {option.disabled && <span className="absolute top-2 right-2 text-xs bg-gray-500 text-white px-2 py-0.5 rounded-full">Скоро</span>}
          <div className="w-16 h-16 mb-4">{option.icon}</div>
          <span className="text-2xl font-semibold">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CropSelector;