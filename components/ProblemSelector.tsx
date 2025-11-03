
import React from 'react';
import { ProblemType, CropType } from '../types';
import { WeedIcon } from './icons/WeedIcon';
import { DiseaseIcon } from './icons/DiseaseIcon';
import { PestIcon } from './icons/PestIcon';
import { IntegratedIcon } from './icons/IntegratedIcon';
import { cropData } from '../data';

interface ProblemSelectorProps {
  selectedCrop: CropType;
  selectedProblem: ProblemType | null;
  onSelectProblem: (problem: ProblemType) => void;
}

const ProblemSelector: React.FC<ProblemSelectorProps> = ({ selectedCrop, selectedProblem, onSelectProblem }) => {
  const hasHerbicides = cropData[selectedCrop].herbicides.length > 0;
  const hasFungicides = cropData[selectedCrop].fungicides.length > 0;
  const hasInsecticides = cropData[selectedCrop].insecticides.length > 0;

  const options = [
    { type: ProblemType.Weeds, label: 'Бур\'яни', icon: <WeedIcon />, disabled: !hasHerbicides },
    { type: ProblemType.Diseases, label: 'Хвороби', icon: <DiseaseIcon />, disabled: !hasFungicides },
    { type: ProblemType.Pests, label: 'Шкідники', icon: <PestIcon />, disabled: !hasInsecticides },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((option) => (
          <button
            key={option.type}
            onClick={() => onSelectProblem(option.type)}
            disabled={option.disabled}
            className={`p-6 rounded-lg shadow-lg border-2 transition-all duration-300 ease-in-out transform flex flex-col items-center justify-center text-center
              ${selectedProblem === option.type
                ? 'bg-green-600 text-white border-green-700 scale-105'
                : 'bg-white text-gray-700 border-transparent'
              }
              ${option.disabled 
                  ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                  : 'hover:-translate-y-1 hover:border-green-500'
              }`}
          >
            <div className="w-12 h-12 mb-3">{option.icon}</div>
            <span className="text-xl font-semibold">{option.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-8 border-t pt-8">
        <button
            onClick={() => onSelectProblem(ProblemType.Integrated)}
            className="w-full p-6 rounded-lg shadow-lg border-2 transition-all duration-300 ease-in-out transform flex flex-col sm:flex-row items-center text-center sm:text-left bg-white text-gray-700 border-transparent hover:-translate-y-1 hover:border-green-500 hover:shadow-xl"
        >
            <div className="w-16 h-16 mb-4 sm:mb-0 sm:mr-6 text-green-600 flex-shrink-0"><IntegratedIcon /></div>
            <div>
                <span className="text-xl font-bold">Інтегрована система захисту</span>
                <p className="text-sm text-gray-500 mt-1">Автоматично згенерувати повну схему фунгіцидно-інсектицидних обробок на весь сезон.</p>
            </div>
        </button>
      </div>
    </>
  );
};

export default ProblemSelector;