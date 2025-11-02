import React, { useState } from 'react';
import { ProblemType, CropType } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import CropSelector from './components/CropSelector';
import ProblemSelector from './components/ProblemSelector';
import ResultsDisplay from './components/ResultsDisplay';
import Stepper from './components/Stepper';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'builder'>('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<ProblemType | null>(null);

  const handleSelectCrop = (crop: CropType) => {
    setSelectedCrop(crop);
    setSelectedProblem(null);
    setCurrentStep(2);
  };

  const handleSelectProblem = (problem: ProblemType) => {
    setSelectedProblem(problem);
    setCurrentStep(3);
  };

  const goToStep = (step: number) => {
    if (step < currentStep) {
      if (step === 1) {
        setSelectedCrop(null);
        setSelectedProblem(null);
      } else if (step === 2) {
        setSelectedProblem(null);
      }
      setCurrentStep(step);
    }
  };
  
  const resetBuilder = () => {
    setCurrentStep(1);
    setSelectedCrop(null);
    setSelectedProblem(null);
  };

  const goToLanding = () => {
      setView('landing');
      resetBuilder();
  }

  const cropNameMap = {
    [CropType.Tomato]: 'томатів',
    [CropType.Pepper]: 'перцю',
    [CropType.Cabbage]: 'капусти',
    [CropType.Onion]: 'цибулі',
    [CropType.Carrot]: 'моркви',
    [CropType.Pumpkin]: 'гарбузових',
    [CropType.Eggplant]: 'баклажанів',
    [CropType.Beet]: 'буряків',
    [CropType.Celery]: 'селери',
  };

  const cropNameMapNominative = {
    [CropType.Tomato]: 'Томат',
    [CropType.Pepper]: 'Перець',
    [CropType.Cabbage]: 'Капуста',
    [CropType.Onion]: 'Цибуля',
    [CropType.Carrot]: 'Морква',
    [CropType.Pumpkin]: 'Гарбузові',
    [CropType.Eggplant]: 'Баклажан',
    [CropType.Beet]: 'Буряк',
    [CropType.Celery]: 'Селера',
  }

  const problemNameMap = {
    [ProblemType.Weeds]: "Бур'яни",
    [ProblemType.Diseases]: "Хвороби",
    [ProblemType.Pests]: "Шкідники",
  };

  const steps = [
    { number: 1, title: 'Вибір культури' },
    { number: 2, title: 'Вибір проблеми' },
    { number: 3, title: 'Результати' },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-2">
              Крок 1: Виберіть культуру
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Оберіть культуру для перегляду рекомендацій по захисту.
            </p>
            <CropSelector selectedCrop={selectedCrop} onSelectCrop={handleSelectCrop} />
          </>
        );
      case 2:
        if (!selectedCrop) return null;
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-700 mb-2">
              Крок 2: Виберіть шкодочинний об'єкт для {cropNameMap[selectedCrop]}
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Виберіть категорію, щоб побачити рекомендовані препарати для захисту.
            </p>
            <ProblemSelector
              selectedCrop={selectedCrop}
              selectedProblem={selectedProblem}
              onSelectProblem={handleSelectProblem}
            />
          </>
        );
      case 3:
        if (!selectedCrop || !selectedProblem) return null;
        return (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
                Крок 3: Рекомендації по захисту
              </h2>
              <p className="text-gray-500">
                Рекомендації для:{' '}
                <span className="font-semibold text-gray-800">{cropNameMapNominative[selectedCrop]}</span> /{' '}
                <span className="font-semibold text-gray-800">{problemNameMap[selectedProblem]}</span>
              </p>
            </div>
            <ResultsDisplay cropType={selectedCrop} problemType={selectedProblem} />
          </>
        );
      default:
        return null;
    }
  };
  
  const renderBuilder = () => (
     <div className="max-w-4xl mx-auto">
        <Stepper steps={steps} currentStep={currentStep} goToStep={goToStep} />
        <div key={currentStep} className="mt-8 bg-white p-6 sm:p-10 rounded-xl shadow-lg animate-fade-in">
          {renderStepContent()}

          <div className="mt-10 flex justify-between items-center">
              <button
                  onClick={currentStep > 1 ? () => goToStep(currentStep - 1) : goToLanding}
                  className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
              >
                  Назад
              </button>
              
              {currentStep === 3 ? (
                   <button 
                      onClick={resetBuilder}
                      className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                      Почати спочатку
                  </button>
              ) : (
                  <div />
              )}
          </div>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-green-50/50 font-sans text-gray-800 flex flex-col">
      <Header onHomeClick={goToLanding} onStartBuilder={() => setView('builder')} />
      <main className="flex-grow py-8">
        {view === 'landing' ? (
            <LandingPage />
        ) : (
            <div className="container mx-auto px-4">
              {renderBuilder()}
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;