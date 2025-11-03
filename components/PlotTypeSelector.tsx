import React from 'react';
import { PlotType } from '../types';

interface PlotTypeSelectorProps {
  onSelectPlotType: (plotType: PlotType) => void;
}

const GardenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const FieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 18a4 4 0 00-4-4H9a4 4 0 000 8h4a4 4 0 004-4zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10V6a3 3 0 013-3v0a3 3 0 013 3v4" />
    </svg>
);

const PlotTypeSelector: React.FC<PlotTypeSelectorProps> = ({ onSelectPlotType }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Оберіть тип вашої ділянки</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
            <button
                onClick={() => onSelectPlotType('home')}
                className="p-8 rounded-xl shadow-lg border-2 border-transparent transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:border-green-500 hover:shadow-2xl bg-white flex flex-col items-center justify-center text-center"
            >
                <GardenIcon />
                <span className="text-2xl font-bold text-gray-800">Присадибні ділянки</span>
                <p className="text-gray-500 mt-2">Рекомендації та норми для невеликих городів та садів.</p>
            </button>
            <button
                onClick={() => onSelectPlotType('field')}
                className="p-8 rounded-xl shadow-lg border-2 border-transparent transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl bg-white flex flex-col items-center justify-center text-center"
            >
                <FieldIcon />
                <span className="text-2xl font-bold text-gray-800">Поля</span>
                <p className="text-gray-500 mt-2">Професійні системи захисту для фермерських господарств.</p>
            </button>
        </div>
    </div>
  );
};

export default PlotTypeSelector;