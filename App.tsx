
import React, { useState } from 'react';
import { ProblemType, CropType, Fungicide, Insecticide, PlotType, IdentificationResult } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import CropSelector from './components/CropSelector';
import ProblemSelector from './components/ProblemSelector';
import ResultsDisplay from './components/ResultsDisplay';
import LandingPage from './components/LandingPage';
import PlotTypeSelector from './components/PlotTypeSelector';
import IntegratedSystemModal from './components/IntegratedSystemModal';
import StandaloneIdentifierPage from './components/StandaloneIdentifierPage';
import BackButton from './components/BackButton';
import Sidebar from './components/Sidebar';
import AboutModal from './components/AboutModal';
import { cropData } from './data';

type Product = Fungicide | Insecticide;

const topProducts = {
  fungicides: new Set(['Зорвек Інкантія', 'Ридоміл Голд Р', 'Сігнум', 'Квадріс', 'Медян Екстра']),
  insecticides: new Set(['Белт', 'Радіант', 'Проклейм', 'Мовенто']),
};

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'plotTypeSelection' | 'builder' | 'identifier'>('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<ProblemType | null>(null);
  const [plotType, setPlotType] = useState<PlotType | null>(null);
  const [isIntegratedModalOpen, setIsIntegratedModalOpen] = useState(false);
  const [integratedSystemPlan, setIntegratedSystemPlan] = useState<any[] | null>(null);
  const [identificationResult, setIdentificationResult] = useState<IdentificationResult | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleBack = () => {
    if (view === 'builder') {
      const prevStep = currentStep - 1;
      if (prevStep < 1) {
        setView('plotTypeSelection');
        return;
      }

      if (currentStep === 3) { // going to 2
        setSelectedProblem(null);
        setIntegratedSystemPlan(null);
      } else if (currentStep === 2) { // going to 1
        setSelectedCrop(null);
      }
      setCurrentStep(prevStep);

    } else if (view === 'plotTypeSelection') {
      setView('landing');
    } else if (view === 'identifier') {
      setView('landing');
    }
  };

  const handleSelectPlotType = (type: PlotType) => {
    setPlotType(type);
    if (identificationResult) {
        setSelectedCrop(identificationResult.crop as CropType);
        setSelectedProblem(identificationResult.type === 'disease' ? ProblemType.Diseases : ProblemType.Pests);
        setCurrentStep(3); // Skip to results
    } else {
        setCurrentStep(1);
    }
    setView('builder');
  };

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

  const resetState = () => {
    setCurrentStep(1);
    setSelectedCrop(null);
    setSelectedProblem(null);
    setIntegratedSystemPlan(null);
    setPlotType(null);
    setIdentificationResult(null);
  };

  const startBuilder = () => {
    resetState();
    setView('plotTypeSelection');
    setIsSidebarOpen(false);
  };

  const goToLanding = () => {
      resetState();
      setView('landing');
      setIsSidebarOpen(false);
  };
  
  const goToIdentifier = () => {
    setView('identifier');
    setIsSidebarOpen(false);
  };
  
  const handleIdentificationComplete = (result: IdentificationResult) => {
    if (result.crop !== 'unknown' && (result.type === 'disease' || result.type === 'pest')) {
        setIdentificationResult(result);
        setView('plotTypeSelection');
    }
  };
  
  const generatePlan = (crop: CropType, period: number) => {
    if (!plotType) return [];
    
    const numTreatments = Math.round((period - 20) / 7);
    if (numTreatments <= 0) return [];

    const availableFungicides = [...cropData[crop].fungicides].filter(p => plotType === 'home' ? p.rateHome !== null : p.rateField !== null);
    const availableInsecticides = [...cropData[crop].insecticides].filter(p => plotType === 'home' ? p.rateHome !== null : p.rateField !== null).filter(
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
                return false; 
            }
        }

        return true; 
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

        if (treatmentNumber <= 3) { 
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
        } else { 
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
        
        const postCheckAndFix = (target: keyof typeof targets, priorityList: string[], fullProductPool: Product[]) => {
            if (targets[target] && treatmentProducts.length < 4) {
                let productToAdd: Product | null = null;
                for (const name of priorityList) {
                    const candidate = fullProductPool.find(p => 
                        (name === 'Децис' ? p.productName.startsWith('Децис') : p.productName === name) &&
                        !treatmentProducts.some(tp => tp.productName === p.productName) &&
                        (usageCount.get(`${p.productName}|${p.activeIngredient}`) ?? 0) < 2 &&
                        !lastTreatmentProductKeys.has(`${p.productName}|${p.activeIngredient}`)
                    );
                    if (candidate) {
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
    [CropType.Leek]: 'цибулі-порей',
    [CropType.Daikon]: 'дайкону',
    [CropType.Garlic]: 'часнику',
  };

  const problemNameMap = {
    [ProblemType.Weeds]: "Бур'яни",
    [ProblemType.Diseases]: "Хвороби",
    [ProblemType.Pests]: "Шкідники",
    [ProblemType.Integrated]: "Інтегрована система захисту",
  };

  const renderBuilderContent = () => {
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
            {selectedCrop && plotType && <ProblemSelector selectedCrop={selectedCrop} plotType={plotType} selectedProblem={selectedProblem} onSelectProblem={handleSelectProblem} />}
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Результати</h2>
            {selectedCrop && selectedProblem && <p className="text-gray-600 mb-6">Рекомендації для <strong>{selectedCrop && cropNameMap[selectedCrop]}</strong> по проблемі: <strong>{problemNameMap[selectedProblem]}</strong></p>}
            {selectedProblem && selectedCrop && plotType && <ResultsDisplay problemType={selectedProblem} cropType={selectedCrop} plotType={plotType} integratedSystemPlan={integratedSystemPlan} />}
            
            <div className="mt-8 flex items-center justify-between">
                <button onClick={handleBack} className="text-gray-600 hover:text-green-700 font-semibold transition-colors">
                    &larr; Повернутись до вибору проблеми
                </button>
                <button
                onClick={startBuilder}
                className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                >
                Спробувати ще раз
                </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    switch(view) {
        case 'identifier':
            return <StandaloneIdentifierPage cropNameMap={cropNameMap} onBackToLanding={goToLanding} onIdentificationComplete={handleIdentificationComplete} />;
        case 'plotTypeSelection':
            return <PlotTypeSelector onSelectPlotType={handleSelectPlotType} />;
        case 'builder':
            return (
                <>
                    <BackButton onClick={handleBack} />
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
                        {renderBuilderContent()}
                    </div>
                </>
            );
        case 'landing':
        default:
            return <LandingPage />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onHomeClick={goToLanding} onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onGoHome={goToLanding}
        onStartBuilder={startBuilder}
        onGoToIdentifier={goToIdentifier}
        onOpenAbout={() => {
            setIsAboutModalOpen(true);
            setIsSidebarOpen(false);
        }}
      />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
            {renderMainContent()}
        </div>
      </main>
      <IntegratedSystemModal 
        isOpen={isIntegratedModalOpen} 
        onClose={() => setIsIntegratedModalOpen(false)}
        onSubmit={handleGenerateSystem}
      />
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
      <Footer />
    </div>
  );
};

export default App;