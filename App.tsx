import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import CollectiveAgronomistPage from './components/CollectiveAgronomistPage';
import StandaloneIdentifierPage from './components/StandaloneIdentifierPage';
import AboutModal from './components/AboutModal';
import { CropType, ProblemType, IdentificationResult } from './types';

type Page = 'landing' | 'builder' | 'identifier';

interface InitialBuilderState {
  crop: CropType;
  problem: ProblemType;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [initialBuilderState, setInitialBuilderState] = useState<InitialBuilderState | undefined>(undefined);

  const handleGoHome = () => {
    setCurrentPage('landing');
    setIsSidebarOpen(false);
    setInitialBuilderState(undefined);
  };

  const handleStartBuilder = () => {
    setCurrentPage('builder');
    setIsSidebarOpen(false);
    setInitialBuilderState(undefined);
  };
  
  const handleGoToIdentifier = () => {
    setCurrentPage('identifier');
    setIsSidebarOpen(false);
  };
  
  const handleOpenAbout = () => {
    setIsAboutModalOpen(true);
    setIsSidebarOpen(false);
  };

  const handleNavigateToBuilder = (crop: CropType, problem: ProblemType) => {
    setInitialBuilderState({ crop, problem });
    setCurrentPage('builder');
  };

  const handleStartAnalysis = async (blob: Blob): Promise<IdentificationResult | null> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const base64data = await blobToBase64(blob);

        const imagePart = {
            inlineData: {
                mimeType: blob.type || 'image/jpeg',
                data: base64data,
            },
        };

        const prompt = `
            Identify the crop and any visible disease or pest in this image. 
            Provide a confident and concise analysis. If you are unsure, state it.
            The user is from Ukraine, so provide the name in Ukrainian.
            Respond ONLY with a JSON object in the following format. Do not include any other text or markdown formatting.
            
            The "crop" value must be one of: ${Object.values(CropType).join(', ')} or 'unknown'.
            The "type" value must be one of: 'disease', 'pest', or 'unknown'.

            Example format:
            {
              "crop": "Tomato",
              "name": "Фітофтороз (Phytophthora infestans)",
              "type": "disease",
              "description": "На листі та стеблах з'являються сірувато-бурі плями, які швидко збільшуються.",
              "confidence": 0.85
            }
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        crop: { type: Type.STRING, enum: [...Object.values(CropType), 'unknown'] },
                        name: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['disease', 'pest', 'unknown'] },
                        description: { type: Type.STRING },
                        confidence: { type: Type.NUMBER },
                    },
                    required: ['crop', 'name', 'type', 'description', 'confidence']
                }
            }
        });

        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText) as IdentificationResult;
        return parsedResult;
    } catch (err) {
        console.error("AI identification failed in App.tsx:", err);
        return null;
    }
  };


  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'builder':
        return <CollectiveAgronomistPage onBackToLanding={handleGoHome} initialState={initialBuilderState} />;
      case 'identifier':
        return <StandaloneIdentifierPage onBackToLanding={handleGoHome} onNavigateToBuilder={handleNavigateToBuilder} onStartAnalysis={handleStartAnalysis} />;
      case 'landing':
      default:
        return (
          <LandingPage />
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <Header 
        onHomeClick={handleGoHome}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <main className="flex-grow">
        {renderCurrentPage()}
      </main>
      <Footer />
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onGoHome={handleGoHome}
        onStartBuilder={handleStartBuilder}
        onGoToIdentifier={handleGoToIdentifier}
        onOpenAbout={handleOpenAbout}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
};

export default App;