import React, { useState } from 'react';
import { ProblemType, CropType, Fungicide, Insecticide } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import CropSelector from './components/CropSelector';
import ProblemSelector from './components/ProblemSelector';
import ResultsDisplay from './components/ResultsDisplay';
import Stepper from './components/Stepper';
import LandingPage from './components/LandingPage';
import IntegratedSystemModal from './components/IntegratedSystemModal';
import { cropData } from './data';

type Product = Fungicide | Insecticide;

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'builder'>('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<ProblemType | null>(null);
  const [isIntegratedModalOpen, setIsIntegratedModalOpen] = useState(false);
  const [integratedSystemPlan, setIntegratedSystemPlan] = useState<any[] | null>(null);


  const handleSelectCrop = (crop: CropType) => {
    setSelectedCrop(crop);
    setSelectedProblem(null);
    setCurrentStep(2);
  };

  const handleSelectProblem = (problem: ProblemType) => {
    setSelectedProblem(problem);
    if (problem === ProblemType.Integrated) {
        setIsIntegratedModalOpen(true);
    } else {
        setCurrentStep(3);
    }
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
    setIntegratedSystemPlan(null);
  };

  const goToLanding = () => {
      setView('landing');
      resetBuilder();
  }
  
  const generatePlan = (crop: CropType, period: number) => {
    const numTreatments = Math.round((period - 20) / 7);
    if (numTreatments <= 0) return [];

    const availableFungicides = [...cropData[crop].fungicides];
    const availableInsecticides = [...cropData[crop].insecticides].filter(
        p => p.productName !== 'Регент' && p.productName !== 'Форс'
    );
    const allProducts: Product[] = [...availableFungicides, ...availableInsecticides];

    const usageCount = new Map<string, number>();
    allProducts.forEach(p => usageCount.set(`${p.productName}|${p.activeIngredient}`, 0));

    const shuffle = (arr: any[]) => arr.sort(() => 0.5 - Math.random());
    
    const plan = [];
    let lastTreatmentProductKeys = new Set<string>();

    const isFungicide = (p: Product): p is Fungicide => 'bacteriosis' in p.controls;
    const isInsecticide = (p: Product): p is Insecticide => 'aphids' in p.controls;

    // Phase 1: Treatments 1-3 (Flexible greedy approach)
    for (let i = 0; i < Math.min(numTreatments, 3); i++) {
        const targets: { [key: string]: boolean } = {
            phytophthora: true, rots: true, bacteriosis: true,
            lepidoptera: true, coleoptera: true, sucking: true,
        };
        const treatmentProducts: Product[] = [];
        
        let productsPool = shuffle(allProducts.filter(p => {
            const key = `${p.productName}|${p.activeIngredient}`;
            return (usageCount.get(key) ?? 0) < 2 && !lastTreatmentProductKeys.has(key);
        }));

        // Greedily build the treatment
        while (Object.values(targets).some(v => v === true) && treatmentProducts.length < 4 && productsPool.length > 0) {
            let bestProduct: Product | null = null;
            let bestScore = -1;
            let bestProductIndex = -1;

            productsPool.forEach((p, index) => {
                if (treatmentProducts.length === 0 && p.category === 3) return;

                let score = 0;
                if (isFungicide(p)) {
                    if (targets.bacteriosis && p.controls.bacteriosis) score++;
                    if (targets.phytophthora && p.controls.phytophthora) score++;
                    if (targets.rots && p.controls.rots) score++;
                } else if (isInsecticide(p)) {
                    if (targets.lepidoptera && p.controls.lepidoptera) score++;
                    if (targets.coleoptera && p.controls.coleoptera) score++;
                    const isSucking = p.controls.aphids || p.controls.thrips || p.controls.whiteflies || p.controls.mites;
                    if (targets.sucking && isSucking) score++;
                }

                if (score > bestScore) {
                    bestScore = score;
                    bestProduct = p;
                    bestProductIndex = index;
                }
            });

            if (bestScore > 0 && bestProduct) {
                treatmentProducts.push(bestProduct);
                productsPool.splice(bestProductIndex, 1);
                
                const key = `${bestProduct.productName}|${bestProduct.activeIngredient}`;
                usageCount.set(key, (usageCount.get(key) ?? 0) + 1);

                if (isFungicide(bestProduct)) {
                    if (bestProduct.controls.bacteriosis) targets.bacteriosis = false;
                    if (bestProduct.controls.phytophthora) targets.phytophthora = false;
                    if (bestProduct.controls.rots) targets.rots = false;
                } else if (isInsecticide(bestProduct)) {
                    if (bestProduct.controls.lepidoptera) targets.lepidoptera = false;
                    if (bestProduct.controls.coleoptera) targets.coleoptera = false;
                    const isSucking = bestProduct.controls.aphids || bestProduct.controls.thrips || bestProduct.controls.whiteflies || bestProduct.controls.mites;
                    if (isSucking) targets.sucking = false;
                }
            } else {
                break;
            }
        }

        plan.push({
            treatmentNumber: i + 1,
            products: treatmentProducts,
            uncoveredTargets: Object.keys(targets).filter(t => targets[t as keyof typeof targets])
        });

        lastTreatmentProductKeys.clear();
        treatmentProducts.forEach(p => lastTreatmentProductKeys.add(`${p.productName}|${p.activeIngredient}`));
    }

    // Phase 2: Treatments 4+ (Strict combinatorial approach)
    for (let i = 3; i < numTreatments; i++) {
        const treatmentProducts: Product[] = [];
        const coveredTargets = new Set<string>();

        const availableProductsForThisTurn = shuffle(allProducts.filter(p => {
            const key = `${p.productName}|${p.activeIngredient}`;
            const isCat1Fungicide = isFungicide(p) && p.category === 1;
            
            return !isCat1Fungicide && 
                   (usageCount.get(key) ?? 0) < 2 && 
                   !lastTreatmentProductKeys.has(key);
        }));

        const addProductToTreatment = (product: Product) => {
            treatmentProducts.push(product);
            const key = `${product.productName}|${product.activeIngredient}`;
            usageCount.set(key, (usageCount.get(key) ?? 0) + 1);

            if (isFungicide(product)) {
                if (product.controls.phytophthora) coveredTargets.add('phytophthora');
                if (product.controls.rots) coveredTargets.add('rots');
                if (product.controls.bacteriosis) coveredTargets.add('bacteriosis');
            } else if (isInsecticide(product)) {
                if (product.controls.lepidoptera) coveredTargets.add('lepidoptera');
                if (product.controls.coleoptera) coveredTargets.add('coleoptera');
                if (product.controls.aphids || product.controls.thrips || product.controls.whiteflies || product.controls.mites) {
                    coveredTargets.add('sucking');
                }
            }
        };

        const findAndAddProduct = (target: string) => {
            if (coveredTargets.has(target) || treatmentProducts.length >= 4) return;
            
            const productPool = availableProductsForThisTurn.filter(p => 
                !treatmentProducts.some(tp => `${tp.productName}|${tp.activeIngredient}` === `${p.productName}|${p.activeIngredient}`)
            );
            
            let candidate: Product | undefined;
            if (target === 'phytophthora') {
                candidate = productPool.find(p => isFungicide(p) && p.controls.phytophthora);
            } else if (target === 'rots') {
                candidate = productPool.find(p => isFungicide(p) && p.controls.rots);
            } else if (target === 'lepidoptera') {
                candidate = productPool.find(p => isInsecticide(p) && p.controls.lepidoptera);
            } else if (target === 'coleoptera') {
                candidate = productPool.find(p => isInsecticide(p) && p.controls.coleoptera);
            } else if (target === 'sucking') {
                candidate = productPool.find(p => isInsecticide(p) && (p.controls.aphids || p.controls.thrips || p.controls.whiteflies || p.controls.mites));
            }
            
            if (candidate) {
                addProductToTreatment(candidate);
            }
        };

        // Build the combination for treatment 4+
        findAndAddProduct('phytophthora');
        findAndAddProduct('rots');
        findAndAddProduct('lepidoptera');
        findAndAddProduct('coleoptera');
        findAndAddProduct('sucking');

        const allPossibleTargets = ['phytophthora', 'rots', 'bacteriosis', 'lepidoptera', 'coleoptera', 'sucking'];
        const uncoveredTargets = allPossibleTargets.filter(t => !coveredTargets.has(t));

        plan.push({
            treatmentNumber: i + 1,
            products: treatmentProducts,
            uncoveredTargets: uncoveredTargets
        });

        lastTreatmentProductKeys.clear();
        treatmentProducts.forEach(p => lastTreatmentProductKeys.add(`${p.productName}|${p.activeIngredient}`));
    }
    return plan;
  };


  const handleGenerateSystem = (growingPeriod: number) => {
      if (!selectedCrop) return;
      const plan = generatePlan(selectedCrop, growingPeriod);
      setIntegratedSystemPlan(plan);
      setIsIntegratedModalOpen(false);
      setCurrentStep(3);
  };


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
    [ProblemType.Integrated]: "Інтегрована система захисту",
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
              Виберіть категорію, щоб побачити рекомендовані препарати, або згенеруйте комплексну систему захисту.
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
            <ResultsDisplay cropType={selectedCrop} problemType={selectedProblem} integratedSystemPlan={integratedSystemPlan} />
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
        <IntegratedSystemModal
            isOpen={isIntegratedModalOpen}
            onClose={() => {
                setIsIntegratedModalOpen(false);
                setSelectedProblem(null);
                if (currentStep !== 1) {
                    setCurrentStep(2);
                }
            }}
            onSubmit={handleGenerateSystem}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;