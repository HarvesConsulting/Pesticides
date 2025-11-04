import React, { useState, useEffect } from 'react';
import { CropType, IdentificationResult } from '../types';
import ProblemIdentifier from './ProblemIdentifier';
import AnalysisView from './AnalysisView';
import BackButton from './BackButton';

interface StandaloneIdentifierPageProps {
  cropNameMap: Record<CropType, string>;
  onBackToLanding: () => void;
  onIdentificationComplete: (result: IdentificationResult) => void;
}

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return blob;
};


const StandaloneIdentifierPage: React.FC<StandaloneIdentifierPageProps> = ({ cropNameMap, onBackToLanding, onIdentificationComplete }) => {
  const [analysisState, setAnalysisState] = useState<{ blob: Blob; src: string } | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const pendingImageSrc = sessionStorage.getItem('pendingImageForAnalysis');
    if (pendingImageSrc) {
      sessionStorage.removeItem('pendingImageForAnalysis');
      
      const restoreState = async () => {
        try {
          const blob = await dataUrlToBlob(pendingImageSrc);
          setAnalysisState({ blob, src: pendingImageSrc });
        } catch (e) {
          console.error("Failed to restore image from session storage", e);
        } finally {
            setIsInitializing(false);
        }
      };
      
      restoreState();
    } else {
      setIsInitializing(false);
    }
  }, []);

  const handleImageReady = (blob: Blob, src: string) => {
    sessionStorage.setItem('pendingImageForAnalysis', src);
    window.location.reload();
  };
  
  const handleResetAnalysis = () => {
    if (analysisState?.src.startsWith('blob:')) {
      URL.revokeObjectURL(analysisState.src);
    }
    setAnalysisState(null);
  };

  const renderContent = () => {
    if (isInitializing) {
      return (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Завантаження...</p>
        </div>
      );
    }

    if (analysisState) {
      return (
        <AnalysisView
          imageSrc={analysisState.src}
          imageBlob={analysisState.blob}
          cropNameMap={cropNameMap}
          onIdentificationComplete={onIdentificationComplete}
          onReset={handleResetAnalysis}
        />
      );
    } else {
      return (
        <ProblemIdentifier 
          onImageReady={handleImageReady}
        />
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <BackButton onClick={analysisState ? handleResetAnalysis : onBackToLanding} />
        {renderContent()}
    </div>
  );
};

export default StandaloneIdentifierPage;