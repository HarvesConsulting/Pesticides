

import React from 'react';
import { cropData } from '../data';
import { CropType } from '../types';
import BackButton from './BackButton';
import FungicideCard from './FungicideCard';

interface BeetFungicidesPageProps {
  onBack: () => void;
}

const BeetFungicidesPage: React.FC<BeetFungicidesPageProps> = ({ onBack }) => {
  const fungicides = cropData[CropType.Beet].fungicides;

  return (
    <div className="animate-fade-in">
      <BackButton onClick={onBack} />
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Фунгіциди для столових буряків
      </h2>
      {fungicides.length > 0 ? (
        <div className="space-y-4">
          {fungicides.map((f, index) => (
            <FungicideCard key={index} fungicide={f} plotType="field" />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">Дані по фунгіцидах для цієї культури відсутні.</p>
      )}
    </div>
  );
};

export default BeetFungicidesPage;