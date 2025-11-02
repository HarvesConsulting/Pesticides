
import React from 'react';
import { ProblemType, CropType } from '../types';
import { cropData } from '../data';
import HerbicideCard from './HerbicideCard';
import FungicideCard from './FungicideCard';
import InsecticideCard from './InsecticideCard';

interface ResultsDisplayProps {
  problemType: ProblemType;
  cropType: CropType;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ problemType, cropType }) => {
  let content;
  let title;
  const data = cropData[cropType];

  switch (problemType) {
    case ProblemType.Weeds:
      title = "Рекомендовані Гербіциди";
      content = data.herbicides.length > 0 ? (
        <div className="space-y-4">
          {data.herbicides.map((h, index) => <HerbicideCard key={index} herbicide={h} />)}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">Дані по гербіцидах для цієї культури відсутні.</p>
      );
      break;
    case ProblemType.Diseases:
      title = "Рекомендовані Фунгіциди";
      content = (
        <div className="space-y-4">
          {data.fungicides.map((f, index) => <FungicideCard key={index} fungicide={f} />)}
        </div>
      );
      break;
    case ProblemType.Pests:
      title = "Рекомендовані Інсектициди";
      content = (
        <div className="space-y-4">
          {data.insecticides.map((i, index) => <InsecticideCard key={index} insecticide={i} />)}
        </div>
      );
      break;
    default:
      content = null;
      title = null;
  }

  return (
    <div className="mt-8 animate-fade-in">
        <h3 className="text-2xl font-bold text-center text-gray-700 mb-6 pb-2 border-b-2 border-green-200">{title}</h3>
        {content}
    </div>
  );
};

export default ResultsDisplay;