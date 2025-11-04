import React, { useState, useCallback } from 'react';
import { IdentificationResult, CropType, ProblemType } from '../types';
import ProblemIdentifier from './ProblemIdentifier';
import BackButton from './BackButton';

const ConfidenceMeter: React.FC<{ confidence: number }> = ({ confidence }) => {
    const percentage = Math.round(confidence * 100);
    let colorClass = 'bg-red-500';
    if (percentage > 50) colorClass = 'bg-yellow-500';
    if (percentage > 75) colorClass = 'bg-green-500';

    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-gray-700">Впевненість</span>
                <span className={`text-sm font-medium ${colorClass.replace('bg', 'text')}`}>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};


interface StandaloneIdentifierPageProps {
  onBackToLanding: () => void;
  onNavigateToBuilder: (crop: CropType, problem: ProblemType) => void;
  onStartAnalysis: (blob: Blob) => Promise<IdentificationResult | null>;
}

const StandaloneIdentifierPage: React.FC<StandaloneIdentifierPageProps> = ({ onBackToLanding, onNavigateToBuilder, onStartAnalysis }) => {
  const [image, setImage] = useState<{ url: string } | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setImage(null);
    setResult(null);
    setIsLoading(false);
    setError(null);
  }, []);
  
  const handleBack = () => {
    if (result || image) {
        resetState();
    } else {
        onBackToLanding();
    }
  }

  const handleImageReady = async (blob: Blob, url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setImage({ url });

    const analysisResult = await onStartAnalysis(blob);

    if (analysisResult) {
        setResult(analysisResult);
    } else {
        setError("Не вдалося розпізнати проблему. Можливо, проблема з API ключем або мережею. Спробуйте зробити більш чітке фото або завантажити інше.");
    }
    setIsLoading(false);
  };
  
  const handleFindSolution = () => {
    if (result && result.crop !== 'unknown' && result.type !== 'unknown') {
        const problemType = result.type === 'disease' ? ProblemType.Diseases : ProblemType.Pests;
        onNavigateToBuilder(result.crop as CropType, problemType);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BackButton onClick={handleBack} />
        
        {!image && <ProblemIdentifier onImageReady={handleImageReady} />}

        {image && (
            <div className="mt-6 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Результати аналізу</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                        <img src={image.url} alt="Uploaded for analysis" className="rounded-lg shadow-lg max-h-96 w-auto object-contain" />
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-lg border">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                                <p className="mt-4 text-gray-600">Аналізуємо зображення...</p>
                            </div>
                        )}
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        {result && (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Культура</p>
                                    <p className="text-2xl font-bold text-green-700">{result.crop !== 'unknown' ? result.crop : 'Не визначено'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Виявлена проблема</p>
                                    <p className="text-2xl font-bold text-gray-800">{result.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Опис</p>
                                    <p className="text-gray-700">{result.description}</p>
                                </div>
                                <div className="pt-2">
                                    <ConfidenceMeter confidence={result.confidence} />
                                </div>
                                {result.crop !== 'unknown' && result.type !== 'unknown' && (
                                     <button 
                                        onClick={handleFindSolution}
                                        className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
                                     >
                                         Знайти рішення
                                     </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default StandaloneIdentifierPage;