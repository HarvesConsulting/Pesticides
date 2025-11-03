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

const topProducts = {
  fungicides: new Set(['Зорвек Інкантія', 'Ридоміл Голд Р', 'Сігнум', 'Квадріс', 'Медян Екстра']),
  insecticides: new Set(['Белт', 'Радіант', 'Проклейм', 'Мовенто']),
};

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

    const isFungicide = (p: Product): p is Fungicide => 'category' in p;
    const isInsecticide = (p: Product): p is Insecticide => !('category' in p);

    // Helper functions for tank mix rules
    const isRidomilGoldR = (p: Product): boolean => p.productName === 'Ридоміл Голд Р';
    const isBannedContactProduct = (p: Product): boolean => {
      const ai = p.activeIngredient.toLowerCase();
      if (isRidomilGoldR(p)) return false; 
      return ai.includes('манкоцеб') || ai.includes('міді');
    };
    const wouldBeInvalidMix = (newProduct: Product, existingProducts: Product[]): boolean => {
      if (isRidomilGoldR(newProduct)) {
        return existingProducts.some(isBannedContactProduct);
      }
      if (isBannedContactProduct(newProduct)) {
        return existingProducts.some(isRidomilGoldR);
      }
      return false;
    };
    
    const getTargetsForProduct = (p: Product): Set<string> => {
        const targets = new Set<string>();
        if (isFungicide(p)) {
            if (p.controls.bacteriosis) targets.add('bacteriosis');
            if (p.controls.phytophthora) targets.add('phytophthora');
            if (p.controls.rots) targets.add('rots');
        } else if (isInsecticide(p)) {
            if (p.controls.lepidoptera) targets.add('lepidoptera');
            if (p.controls.coleoptera) targets.add('coleoptera');
            if (p.controls.aphids || p.controls.thrips || p.controls.whiteflies || p.controls.mites) {
                targets.add('sucking');
            }
        }
        return targets;
    };

    const hasRedundantOverlap = (candidate: Product, existingProducts: Product[]): boolean => {
        if (isFungicide(candidate) && candidate.category !== 2) return false;

        const existingFlexibleProducts = existingProducts.filter(p => isInsecticide(p) || (isFungicide(p) && p.category === 2));
        if (existingFlexibleProducts.length === 0) return false;

        const candidateTargets = getTargetsForProduct(candidate);
        if (candidateTargets.size === 0) return false;

        const allExistingFlexibleTargets = new Set<string>();
        existingFlexibleProducts.forEach(p => {
            if ((isFungicide(candidate) && isFungicide(p)) || (isInsecticide(candidate) && isInsecticide(p))) {
                getTargetsForProduct(p).forEach(target => allExistingFlexibleTargets.add(target));
            }
        });

        for (const target of candidateTargets) {
            if (!allExistingFlexibleTargets.has(target)) {
                return false; // Found new coverage, so the overlap is not redundant
            }
        }

        return true; // All of the candidate's targets are already covered. Redundant.
    };


    for (let i = 0; i < numTreatments; i++) {
        const treatmentNumber = i + 1;
        const treatmentProducts: Product[] = [];
        
        const targets: { [key: string]: boolean } = {
            phytophthora: true, rots: true, bacteriosis: true,
            lepidoptera: true, coleoptera: true, sucking: true,
        };
        
        const updateTargets = (product: Product) => {
            if (isFungicide(product)) {
                if (product.controls.bacteriosis) targets.bacteriosis = false;
                if (product.controls.phytophthora) targets.phytophthora = false;
                if (product.controls.rots) targets.rots = false;
            } else if (isInsecticide(product)) {
                if (product.controls.lepidoptera) targets.lepidoptera = false;
                if (product.controls.coleoptera) targets.coleoptera = false;
                const isSucking = product.controls.aphids || product.controls.thrips || product.controls.whiteflies || product.controls.mites;
                if (isSucking) targets.sucking = false;
            }
        };

        const addProduct = (product: Product): boolean => {
            if (treatmentProducts.length >= 4) return false;
            treatmentProducts.push(product);
            const key = `${product.productName}|${product.activeIngredient}`;
            usageCount.set(key, (usageCount.get(key) ?? 0) + 1);
            updateTargets(product);
            return true;
        };
        
        const initialProductsPoolForTurn = shuffle(allProducts.filter(p => {
            const key = `${p.productName}|${p.activeIngredient}`;
            const isCat1Fungicide = isFungicide(p) && p.category === 1;
            return (usageCount.get(key) ?? 0) < 2 &&
                   !lastTreatmentProductKeys.has(key) &&
                   !(treatmentNumber > 3 && isCat1Fungicide);
        }));

        // --- Main Selection Logic ---
        if (treatmentNumber <= 3) { // Phase 1: Greedy
            let greedyPool = [...initialProductsPoolForTurn];
            while (Object.values(targets).some(v => v === true) && treatmentProducts.length < 4 && greedyPool.length > 0) {
                let bestProduct: Product | null = null;
                let bestScore = -1;
                let bestProductIndex = -1;
                
                greedyPool.forEach((p, index) => {
                    if ((isFungicide(p) && treatmentProducts.length === 0 && p.category === 3) ||
                        hasRedundantOverlap(p, treatmentProducts) ||
                        wouldBeInvalidMix(p, treatmentProducts)) {
                        return;
                    }

                    let coverage = 0;
                    if (isFungicide(p)) {
                        if (targets.bacteriosis && p.controls.bacteriosis) coverage++;
                        if (targets.phytophthora && p.controls.phytophthora) coverage++;
                        if (targets.rots && p.controls.rots) coverage++;
                    } else if (isInsecticide(p)) {
                        if (targets.lepidoptera && p.controls.lepidoptera) coverage++;
                        if (targets.coleoptera && p.controls.coleoptera) coverage++;
                        if (targets.sucking && (p.controls.aphids || p.controls.thrips || p.controls.whiteflies || p.controls.mites)) coverage++;
                    }

                    if (coverage === 0) return;

                    const isTop = (isFungicide(p) && topProducts.fungicides.has(p.productName)) || (isInsecticide(p) && topProducts.insecticides.has(p.productName));
                    const score = coverage * 10 + (isTop ? 1 : 0);

                    if (score > bestScore) {
                        bestScore = score;
                        bestProduct = p;
                        bestProductIndex = index;
                    }
                });

                if (bestProduct) {
                    addProduct(bestProduct);
                    greedyPool.splice(bestProductIndex, 1);
                } else {
                    break;
                }
            }
        } else { // Phase 2: Combinatorial
            const findAndAdd = (target: string) => {
                if (!targets[target] || treatmentProducts.length >= 4) return;
                
                const isTargetMatch = (p: Product) => {
                    if (target === 'phytophthora') return isFungicide(p) && p.controls.phytophthora;
                    if (target === 'rots') return isFungicide(p) && p.controls.rots;
                    if (target === 'lepidoptera') return isInsecticide(p) && p.controls.lepidoptera;
                    if (target === 'coleoptera') return isInsecticide(p) && p.controls.coleoptera;
                    if (target === 'sucking') return isInsecticide(p) && (p.controls.aphids || p.controls.thrips || p.controls.whiteflies || p.controls.mites);
                    return false;
                };

                const isTop = (p: Product) => (isFungicide(p) && topProducts.fungicides.has(p.productName)) || (isInsecticide(p) && topProducts.insecticides.has(p.productName));

                const pool = initialProductsPoolForTurn.filter(p => !treatmentProducts.includes(p));
                let candidate = pool.find(p => isTargetMatch(p) && isTop(p) && !wouldBeInvalidMix(p, treatmentProducts) && !hasRedundantOverlap(p, treatmentProducts)) ||
                                pool.find(p => isTargetMatch(p) && !wouldBeInvalidMix(p, treatmentProducts) && !hasRedundantOverlap(p, treatmentProducts));

                if (candidate) addProduct(candidate);
            };
            findAndAdd('phytophthora');
            findAndAdd('rots');
            findAndAdd('lepidoptera');
            findAndAdd('coleoptera');
            findAndAdd('sucking');
        }
        
        // --- Post-check and Fix Logic ---
        const postCheckAndFix = (target: keyof typeof targets, priorityList: string[], fullProductPool: Product[]) => {
            if (targets[target] && treatmentProducts.length < 4) {
                let productToAdd: Product | null = null;
                for (const name of priorityList) {
                    // Search in the full pool for this turn, not a filtered one
                    const candidate = fullProductPool.find(p => 
                        (name === 'Децис' ? p.productName.startsWith('Децис') : p.productName === name) &&
                        !treatmentProducts.some(tp => tp.productName === p.productName) &&
                        (usageCount.get(`${p.productName}|${p.activeIngredient}`) ?? 0) < 2 &&
                        !lastTreatmentProductKeys.has(`${p.productName}|${p.activeIngredient}`)
                    );
                    if (candidate) {
                        // For post-fix, we ignore the redundant overlap rule to ensure coverage
                        if (!wouldBeInvalidMix(candidate, treatmentProducts)) {
                            productToAdd = candidate;
                            break;
                        }
                    }
                }
                if (productToAdd) addProduct(productToAdd);
            }
        };

        postCheckAndFix('bacteriosis', ['Казумін 2Л', 'Серенада'], allProducts);
        postCheckAndFix('coleoptera', ['Моспілан', 'Актара', 'Децис', 'Карате Зеон'], allProducts);
        postCheckAndFix('lepidoptera', ['Белт', 'Радіант', 'Проклейм', 'Ампліго', 'Кораген'], allProducts);

        // --- Finalize and store ---
        const allPossibleTargets = ['phytophthora', 'rots', 'bacteriosis', 'lepidoptera', 'coleoptera', 'sucking'];
        const uncoveredTargets = allPossibleTargets.filter(t => targets[t]);
        plan.push({ treatmentNumber, products: treatmentProducts, uncoveredTargets });

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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Крок 1: Оберіть культуру</h2>
            <CropSelector selectedCrop={selectedCrop} onSelectCrop={handleSelectCrop} />
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Крок 2: Оберіть проблему для {selectedCrop && cropNameMap[selectedCrop]}</h2>
            {selectedCrop && <ProblemSelector selectedCrop={selectedCrop} selectedProblem={selectedProblem} onSelectProblem={handleSelectProblem} />}
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Результати</h2>
            {selectedCrop && selectedProblem && <p className="text-gray-600 mb-6">Рекомендації для <strong>{selectedCrop && cropNameMap[selectedCrop]}</strong> по проблемі: <strong>{problemNameMap[selectedProblem]}</strong></p>}
            {selectedProblem && selectedCrop && <ResultsDisplay problemType={selectedProblem} cropType={selectedCrop} integratedSystemPlan={integratedSystemPlan} />}
            <button
              onClick={resetBuilder}
              className="mt-8 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              Спробувати ще раз
            </button>
          </>
        );
      default:
        return null;
    }
  };

  if (view === 'landing') {
      return (
          <div className="min-h-screen flex flex-col">
              <Header onHomeClick={goToLanding} onStartBuilder={() => setView('builder')} />
              <main className="flex-grow">
                  <LandingPage />
              </main>
              <Footer />
          </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onHomeClick={goToLanding} onStartBuilder={() => setView('builder')} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Stepper steps={steps} currentStep={currentStep} goToStep={goToStep} />
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
            {renderStepContent()}
        </div>
      </main>
      <IntegratedSystemModal 
        isOpen={isIntegratedModalOpen} 
        onClose={() => setIsIntegratedModalOpen(false)}
        onSubmit={handleGenerateSystem}
      />
      <Footer />
    </div>
  );
};

export default App;