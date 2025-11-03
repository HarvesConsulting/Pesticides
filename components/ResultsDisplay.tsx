import React from 'react';
import { ProblemType, CropType, PlotType } from '../types';
import { cropData } from '../data';
import HerbicideCard from './HerbicideCard';
import FungicideCard from './FungicideCard';
import InsecticideCard from './InsecticideCard';
import IntegratedSystemTable from './IntegratedSystemTable';

interface ResultsDisplayProps {
  problemType: ProblemType;
  cropType: CropType;
  plotType: PlotType;
  integratedSystemPlan?: any[] | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ problemType, cropType, plotType, integratedSystemPlan }) => {
  let content;
  let title;
  const data = cropData[cropType];

  const fungicides = data.fungicides.filter(f => plotType === 'home' ? f.rateHome : f.rateField);
  const insecticides = data.insecticides.filter(i => plotType === 'home' ? i.rateHome : i.rateField);

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
          {fungicides.map((f, index) => <FungicideCard key={index} fungicide={f} plotType={plotType} />)}
        </div>
      );
      break;
    case ProblemType.Pests:
      title = "Рекомендовані Інсектициди";
      content = (
        <div className="space-y-4">
          {insecticides.map((i, index) => <InsecticideCard key={index} insecticide={i} plotType={plotType} />)}
        </div>
      );
      break;
    case ProblemType.Integrated:
      title = null;
      content = integratedSystemPlan ? (
        <>
          <p className="text-center text-gray-600 mb-4 text-sm">
            <strong>Примітка:</strong> інтервал між обробками в середньому 7–10 днів.
          </p>
          <IntegratedSystemTable plan={integratedSystemPlan} plotType={plotType} />
        </>
      ) : (
          <p className="text-center text-gray-500 py-4">План не згенеровано. Спробуйте ще раз.</p>
      );
      break;
    default:
      content = null;
      title = null;
  }

  return (
    <div className="mt-8 animate-fade-in">
        {title && <h3 className="text-2xl font-bold text-center text-gray-700 mb-6 pb-2 border-b-2 border-green-200">{title}</h3>}
        {content}
    </div>
  );
};

export default ResultsDisplay;