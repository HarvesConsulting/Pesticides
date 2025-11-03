import React from 'react';
import { CropType, IdentificationResult } from '../types';
import ProblemIdentifier from './ProblemIdentifier';
import BackButton from './BackButton';

interface StandaloneIdentifierPageProps {
  cropNameMap: Record<CropType, string>;
  onBackToLanding: () => void;
  onIdentificationComplete: (result: IdentificationResult) => void;
}

const StandaloneIdentifierPage: React.FC<StandaloneIdentifierPageProps> = ({ cropNameMap, onBackToLanding, onIdentificationComplete }) => {
  return (
    <div className="container mx-auto px-4 py-8">
        <BackButton onClick={onBackToLanding} />
        <ProblemIdentifier 
            cropNameMap={cropNameMap}
            onBackToLanding={onBackToLanding}
            onIdentificationComplete={onIdentificationComplete}
        />
    </div>
  );
};

export default StandaloneIdentifierPage;