import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { CropType, IdentificationResult } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { UploadIcon } from './icons/UploadIcon';

interface ProblemIdentifierProps {
  cropNameMap: Record<CropType, string>;
  onBackToLanding: () => void;
  onIdentificationComplete: (result: IdentificationResult) => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read blob as base64 string"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const resizeImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      URL.revokeObjectURL(url); 
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 400; // Further reduced for mobile performance
      const MAX_HEIGHT = 400; // Further reduced for mobile performance
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        },
        'image/jpeg',
        0.8 // Further reduced quality
      );
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      console.error("Image loading failed:", err);
      reject(new Error("Не вдалося завантажити зображення для обробки."));
    };
  });
};


const ProblemIdentifier: React.FC<ProblemIdentifierProps> = ({ cropNameMap, onBackToLanding, onIdentificationComplete }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      setResult(null);
      setImageSrc(null);
      setImageBlob(null);
      try {
        const resizedBlob = await resizeImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageSrc(e.target?.result as string);
          setImageBlob(resizedBlob);
          setIsLoading(false);
        };
        reader.onerror = () => {
            throw new Error("Не вдалося прочитати оброблене зображення.");
        }
        reader.readAsDataURL(resizedBlob);
      } catch (err: any) {
        console.error("Помилка обробки зображення:", err);
        setError(err.message || "Не вдалося обробити зображення. Будь ласка, спробуйте інше.");
        setIsLoading(false);
      }
    }
  };

  const handleIdentify = async () => {
    if (!imageBlob) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Data = await blobToBase64(imageBlob);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      const cropList = Object.values(CropType).join(', ');
      const promptText = `Проаналізуй це зображення. Ідентифікуй культуру, а також будь-яку хворобу або шкідника.
- У полі 'crop' використовуй значення з цього списку: [${cropList}], або 'unknown', якщо культура не зі списку.
- У полі 'type' використовуй 'disease', 'pest', або 'unknown'.
- Надай відповідь виключно у форматі JSON згідно зі схемою.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data,
              },
            },
            { text: promptText },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                crop: { type: Type.STRING },
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                description: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
            },
            required: ['crop', 'name', 'type', 'description', 'confidence'],
          },
        },
      });
      
      const jsonText = response.text.trim();
      const parsedResult: IdentificationResult = JSON.parse(jsonText);
      setResult(parsedResult);

    } catch (err) {
      console.error("ПОМИЛКА ІДЕНТИФІКАЦІЇ:", err);
      setError('Не вдалося розпізнати проблему. Спробуйте інше фото або перевірте з\'єднання. (Деталі в консолі розробника)');
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setImageSrc(null);
    setImageBlob(null);
    setResult(null);
    setError(null);
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Визначити проблему за фото</h2>
      
      {!imageSrc && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input type="file" accept="image/*" ref={cameraInputRef} onChange={handleFileChange} capture="environment" className="hidden" />
            <button onClick={() => cameraInputRef.current?.click()} className="p-8 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors flex flex-col items-center justify-center">
                <CameraIcon className="w-12 h-12 text-gray-500 mb-2" />
                <span className="font-semibold text-gray-700">Зробити фото</span>
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-8 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center">
                <UploadIcon className="w-12 h-12 text-gray-500 mb-2" />
                <span className="font-semibold text-gray-700">Завантажити з галереї</span>
            </button>
        </div>
      )}

      {imageSrc && (
        <div className="space-y-6">
            <div className="w-full max-w-sm mx-auto">
                <img src={imageSrc} alt="Preview" className="rounded-lg shadow-md w-full h-auto" />
            </div>
            {!result && (
                <div className="flex justify-center">
                    <button onClick={handleIdentify} disabled={isLoading} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-wait">
                        {isLoading ? 'Аналіз...' : 'Аналізувати'}
                    </button>
                     <button onClick={reset} disabled={isLoading} className="ml-4 bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                        Обрати інше
                    </button>
                </div>
            )}
        </div>
      )}
      
      {isLoading && <div className="text-center py-4">{!imageSrc ? 'Обробка фото...' : 'Аналіз...'}</div>}
      {error && <div className="text-center py-4 text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

      {result && (
        <div className="mt-8 border-t pt-6 text-center animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-800">Ідентифіковано: {result.name}</h3>
          <p className="text-lg text-gray-600 mb-1">
              Культура: <strong>{result.crop !== 'unknown' && cropNameMap[result.crop] ? cropNameMap[result.crop].replace(/ів$/, '') : 'Невизначено'}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-4">(Впевненість: {result.confidence.toFixed(1)}%)</p>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">{result.description}</p>

          {result.crop !== 'unknown' && (result.type === 'disease' || result.type === 'pest') ? (
            <button onClick={() => onIdentificationComplete(result)} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                Знайти препарати для боротьби
            </button>
          ) : (
            <p className="text-orange-600 bg-orange-50 p-3 rounded-lg max-w-xl mx-auto">Не вдалося визначити культуру з довідника або класифікувати проблему. Рекомендації недоступні.</p>
          )}

           <button onClick={reset} className="mt-4 text-sm text-gray-600 hover:underline">
                Спробувати інше фото
           </button>
        </div>
      )}
    </div>
  );
};

export default ProblemIdentifier;