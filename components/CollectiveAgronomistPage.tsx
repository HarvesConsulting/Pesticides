
import React, { useState, useMemo } from 'react';
import { CropType, PlotType, ProblemType, Fungicide, Insecticide, IdentificationResult } from '../types';
import { cropData } from '../data';
import CropSelector from './CropSelector';
import PlotTypeSelector from './PlotTypeSelector';
import ProblemSelector from './ProblemSelector';
import ResultsDisplay from './ResultsDisplay';
import { GoogleGenAI, Type } from "@google/genai";
import IntegratedSystemModal from './IntegratedSystemModal';
import BackButton from './BackButton';

interface CollectiveAgronomistPageProps {
  onBackToLanding: () => void;
  initialState?: {
      crop: CropType;
      problem: ProblemType;
  }
}


const CollectiveAgronomistPage: React.FC<CollectiveAgronomistPageProps> = ({ onBackToLanding, initialState }) => {
  const [currentStep, setCurrentStep] = useState(initialState ? 2 : 1);
  const [selectedCrop, setSelectedCrop] = useState<CropType | null>(initialState?.crop || null);
  const [plotType, setPlotType] = useState<PlotType | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<ProblemType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [integratedSystemPlan, setIntegratedSystemPlan] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    const prevStep = currentStep - 1;
    if (prevStep < 1) {
        onBackToLanding();
        return;
    }

    if (currentStep === 4) { // going to 3
        setSelectedProblem(null);
        setIntegratedSystemPlan(null);
    }
    if (currentStep === 3) { // going to 2
        setPlotType(null);
    }
    if (currentStep === 2) { // going to 1
        setSelectedCrop(null);
    }
    setCurrentStep(prevStep);
  };
  
  const handleSelectCrop = (crop: CropType) => {
    setSelectedCrop(crop);
    setCurrentStep(2);
  };
  
  const handleSelectPlotType = (type: PlotType) => {
    setPlotType(type);
    setCurrentStep(3);
    if (initialState?.problem) {
        handleSelectProblem(initialState.problem)
    }
  };
  
  const handleSelectProblem = (problem: ProblemType) => {
    setSelectedProblem(problem);
    if (problem === ProblemType.Integrated) {
      setIsModalOpen(true);
    } else {
      setCurrentStep(4);
    }
  };

  const generateIntegratedSystem = async (period: number) => {
    if (!selectedCrop || !plotType) return;
    setIsLoading(true);
    setError(null);
    setIntegratedSystemPlan(null);
    setCurrentStep(4);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const availableFungicides = cropData[selectedCrop].fungicides.filter(f => plotType === 'home' ? f.rateHome : f.rateField);
        const availableInsecticides = cropData[selectedCrop].insecticides.filter(i => plotType === 'home' ? i.rateHome : i.rateField);

        const prompt = `
            Створи інтегровану систему фунгіцидно-інсектицидних обробок для культури "${selectedCrop}" на вегетаційний період ${period} днів.
            Інтервал між обробками приблизно 7-10 днів.
            Використовуй тільки препарати з наданих списків. Чергуй препарати з різними діючими речовинами.
            
            Доступні фунгіциди:
            ${JSON.stringify(availableFungicides.map(f => ({ name: f.productName, ingredient: f.activeIngredient, category: f.category, controls: f.controls })))}

            Доступні інсектициди:
            ${JSON.stringify(availableInsecticides.map(i => ({ name: i.productName, ingredient: i.activeIngredient, controls: i.controls })))}

            Цільові хвороби, які треба контролювати: фітофтороз/пероноспороз (phytophthora), гнилі (rots), бактеріози (bacteriosis).
            Цільові шкідники: лускокрилі (lepidoptera), твердокрилі (coleoptera), сисні (aphids, thrips, whiteflies, mites).
            
            Надай відповідь у форматі JSON-масиву. Кожен елемент масиву - це одна обробка.
            Кожен об'єкт обробки повинен мати поля:
            - "treatmentNumber": номер обробки (починаючи з 1).
            - "products": масив об'єктів препаратів. Кожен об'єкт препарату повинен містити "productName" та "activeIngredient".
            - "uncoveredTargets": масив рядків з назвами цілей, які не вдалося покрити цією обробкою (наприклад, ["bacteriosis", "sucking"]). Використовуй ключі: phytophthora, rots, bacteriosis, lepidoptera, coleoptera, sucking.

            Приклад елемента масиву:
            {
              "treatmentNumber": 1,
              "products": [
                { "productName": "Ридоміл Голд", "activeIngredient": "металаксил-м+манкоцеб" },
                { "productName": "Актара", "activeIngredient": "тіаметоксам" }
              ],
              "uncoveredTargets": []
            }
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            treatmentNumber: { type: Type.NUMBER },
                            products: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        productName: { type: Type.STRING },
                                        activeIngredient: { type: Type.STRING },
                                    },
                                    required: ['productName', 'activeIngredient'],
                                }
                            },
                            uncoveredTargets: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            }
                        },
                        required: ['treatmentNumber', 'products', 'uncoveredTargets'],
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        let parsedPlan = JSON.parse(jsonText);

        const fullPlan = parsedPlan.map((treatment: any) => {
            const fullProducts = treatment.products.map((p: {productName: string, activeIngredient: string}) => {
                const fungicide = availableFungicides.find(f => f.productName === p.productName && f.activeIngredient === p.activeIngredient);
                if (fungicide) return fungicide;
                const insecticide = availableInsecticides.find(i => i.productName === p.productName && i.activeIngredient === p.activeIngredient);
                return insecticide;
            }).filter(Boolean);
            return { ...treatment, products: fullProducts };
        });

        setIntegratedSystemPlan(fullPlan);

    } catch (err) {
        console.error("AI generation failed:", err);
        setError("Не вдалося згенерувати план. Будь ласка, спробуйте ще раз.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleModalSubmit = (period: number) => {
    setIsModalOpen(false);
    generateIntegratedSystem(period);
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CropSelector selectedCrop={selectedCrop} onSelectCrop={handleSelectCrop} />;
      case 2:
        return <PlotTypeSelector onSelectPlotType={handleSelectPlotType} />;
      case 3:
        if (!selectedCrop || !plotType) return null;
        return <ProblemSelector selectedCrop={selectedCrop} plotType={plotType} selectedProblem={selectedProblem} onSelectProblem={handleSelectProblem} />;
      case 4:
        if (!selectedProblem || !selectedCrop || !plotType) return null;
        if (isLoading) return <div className="text-center p-8">Генеруємо план...</div>;
        if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
        return <ResultsDisplay problemType={selectedProblem} cropType={selectedCrop} plotType={plotType} integratedSystemPlan={integratedSystemPlan} />;
      default:
        return null;
    }
  };

  const showBackButton = currentStep > 1 || (initialState !== undefined);

  return (
    <div className="container mx-auto px-4 py-8">
      {showBackButton && <BackButton onClick={handleBack} />}
      <div className="mt-8">
        {renderStepContent()}
      </div>
       <IntegratedSystemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default CollectiveAgronomistPage;