import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { UploadIcon } from './icons/UploadIcon';
import AnalysisView from './AnalysisView';
import { IdentificationResult, CropType } from '../types';

const compressImage = (file: File, maxWidth = 1024, quality = 0.8): Promise<{blob: Blob, url: string}> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return reject(new Error('Could not get canvas context'));
    }

    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxWidth) {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({blob, url});
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Image loading failed'));
    };
    img.src = URL.createObjectURL(file);
  });
};

interface ProblemIdentifierProps {
  cropNameMap: Record<CropType, string>;
  onIdentificationComplete: (result: IdentificationResult) => void;
}

const ProblemIdentifier: React.FC<ProblemIdentifierProps> = ({ cropNameMap, onIdentificationComplete }) => {
  const [processedImage, setProcessedImage] = useState<{ src: string; blob: Blob } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState<string>(`key-${Date.now()}`);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (processedImage?.src) {
          URL.revokeObjectURL(processedImage.src);
      }
    };
  }, [processedImage]);

  const handleFileTrigger = (useCamera: boolean) => {
    const input = fileInputRef.current;
    if (input) {
        input.value = '';
        if (useCamera) {
            input.setAttribute('capture', 'environment');
        } else {
            input.removeAttribute('capture');
        }
        input.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      if (processedImage?.src) {
        URL.revokeObjectURL(processedImage.src);
      }
      setProcessedImage(null);

      try {
        const { blob, url } = await compressImage(file);
        setProcessedImage({ src: url, blob });
      } catch (err: any) {
        console.error("Помилка обробки зображення:", err);
        setError('Не вдалося обробити зображення. Спробуйте інше фото.');
        setInputKey(`key-error-${Date.now()}`);
      } finally {
        setIsLoading(false);
      }
    }
    // Скидаємо ключ інпуту, щоб onChange спрацьовував надійно
    setInputKey(`key-change-${Date.now()}`);
  };
  
  const handleReset = () => {
    if (processedImage?.src) {
        URL.revokeObjectURL(processedImage.src);
    }
    setProcessedImage(null);
    setError(null);
    setIsLoading(false);
    setInputKey(`key-reset-${Date.now()}`);
  }

  if (processedImage) {
    return (
        <AnalysisView 
            imageSrc={processedImage.src}
            imageBlob={processedImage.blob}
            cropNameMap={cropNameMap}
            onIdentificationComplete={onIdentificationComplete}
            onReset={handleReset} 
        />
    )
  }

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Визначити проблему за фото</h2>
      
      <input 
        key={inputKey}
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {isLoading ? (
        <div className="text-center py-6 sm:py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Обробка фото...</p>
        </div>
      ) : error ? (
         <div className="text-center py-4 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mt-4">
          {error}
          <button 
            onClick={handleReset}
            className="ml-3 text-red-700 hover:text-red-900 underline"
          >
            Спробувати знову
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4">
            <button 
              onClick={() => handleFileTrigger(true)} 
              className="p-4 sm:p-6 md:p-8 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] touch-manipulation"
            >
                <CameraIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-500 mb-2" />
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Зробити фото</span>
            </button>
            <button 
              onClick={() => handleFileTrigger(false)} 
              className="p-4 sm:p-6 md:p-8 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] touch-manipulation"
            >
                <UploadIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-500 mb-2" />
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Завантажити з галереї</span>
            </button>
        </div>
      )}
    </div>
  );
};

export default ProblemIdentifier;
