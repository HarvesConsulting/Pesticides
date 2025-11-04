import React, { useState, useMemo } from 'react';
import { ProblemType, CropType, PlotType } from '../types';
import { cropData } from '../data';
import HerbicideCard from './HerbicideCard';
import FungicideCard from './FungicideCard';
import InsecticideCard from './InsecticideCard';
import IntegratedSystemTable from './IntegratedSystemTable';
import FilterControls from './FilterControls';

interface ResultsDisplayProps {
  problemType: ProblemType;
  cropType: CropType;
  plotType: PlotType;
  integratedSystemPlan?: any[] | null;
}

const fungicideControlLabels: Record<string, string> = {
  bacteriosis: 'Бактеріози',
  phytophthora: 'Фітофтора/Пероноспороз',
  rots: 'Гнилі',
  rootRots: 'Кореневі гнилі',
};

const insecticideControlLabels: Record<string, string> = {
  aphids: 'Тлі',
  thrips: 'Трипси',
  whiteflies: 'Білокрилка',
  mites: 'Кліщі',
  lepidoptera: 'Лускокрилі',
  coleoptera: 'Твердокрилі',
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ problemType, cropType, plotType, integratedSystemPlan }) => {
  const [fungicideFilters, setFungicideFilters] = useState<Record<string, boolean>>({});
  const [insecticideFilters, setInsecticideFilters] = useState<Record<string, boolean>>({});

  let content;
  let title;
  const data = cropData[cropType];

  const fungicides = data.fungicides.filter(f => plotType === 'home' ? f.rateHome : f.rateField);
  const insecticides = data.insecticides.filter(i => plotType === 'home' ? i.rateHome : i.rateField);

  const fungicideOptions = useMemo(() => {
    if (problemType !== ProblemType.Diseases) return [];
    const availableOptions = new Set<string>();
    fungicides.forEach(f => {
      Object.entries(f.controls).forEach(([key, value]) => {
        if (value && fungicideControlLabels[key]) {
          availableOptions.add(key);
        }
      });
    });
    return Array.from(availableOptions).map(key => ({ key, label: fungicideControlLabels[key] }));
  }, [fungicides, problemType]);

  const filteredFungicides = useMemo(() => {
    const activeFilters = Object.keys(fungicideFilters).filter(key => fungicideFilters[key]);
    if (activeFilters.length === 0) {
      return fungicides;
    }
    return fungicides.filter(f => {
      return activeFilters.some(filterKey => f.controls[filterKey as keyof typeof f.controls]);
    });
  }, [fungicides, fungicideFilters]);

  const insecticideOptions = useMemo(() => {
    if (problemType !== ProblemType.Pests) return [];
    const availableOptions = new Set<string>();
    insecticides.forEach(i => {
      Object.entries(i.controls).forEach(([key, value]) => {
        if (value && insecticideControlLabels[key]) {
          availableOptions.add(key);
        }
      });
    });
    return Array.from(availableOptions).map(key => ({ key, label: insecticideControlLabels[key] }));
  }, [insecticides, problemType]);

  const filteredInsecticides = useMemo(() => {
    const activeFilters = Object.keys(insecticideFilters).filter(key => insecticideFilters[key]);
    if (activeFilters.length === 0) {
      return insecticides;
    }
    return insecticides.filter(i => {
      return activeFilters.some(filterKey => i.controls[filterKey as keyof typeof i.controls]);
    });
  }, [insecticides, insecticideFilters]);

  const handleFungicideFilterChange = (key: string) => {
    setFungicideFilters(prev => ({...prev, [key]: !prev[key]}));
  };
  
  const handleInsecticideFilterChange = (key: string) => {
    setInsecticideFilters(prev => ({...prev, [key]: !prev[key]}));
  };

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
        <>
          <FilterControls options={fungicideOptions} activeFilters={fungicideFilters} onFilterChange={handleFungicideFilterChange} />
          {filteredFungicides.length > 0 ? (
            <div className="space-y-4">
              {filteredFungicides.map((f, index) => <FungicideCard key={index} fungicide={f} plotType={plotType} />)}
            </div>
           ) : (
             <p className="text-center text-gray-500 py-4">Не знайдено препаратів за обраними фільтрами.</p>
           )}
        </>
      );
      break;
    case ProblemType.Pests:
      title = "Рекомендовані Інсектициди";
      content = (
        <>
          <FilterControls options={insecticideOptions} activeFilters={insecticideFilters} onFilterChange={handleInsecticideFilterChange} />
           {filteredInsecticides.length > 0 ? (
            <div className="space-y-4">
              {filteredInsecticides.map((i, index) => <InsecticideCard key={index} insecticide={i} plotType={plotType} />)}
            </div>
           ) : (
             <p className="text-center text-gray-500 py-4">Не знайдено препаратів за обраними фільтрами.</p>
           )}
        </>
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