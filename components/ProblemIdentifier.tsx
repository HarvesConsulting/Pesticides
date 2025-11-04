import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { CropType, IdentificationResult } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { UploadIcon } from './icons/UploadIcon';

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

// Власна надійна функція для стиснення зображення
const compressImage = (file: File, maxWidth = 1024, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return reject(new Error('Could not get canvas context'));
    }

    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Звільнення пам'яті
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
            resolve(blob);
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = (err) => {
        URL.revokeObjectURL(img.src); // Звільнення пам'яті при помилці
        reject(new Error('Image loading failed'));
    };
    img.src = URL.createObjectURL(file);
  });
};

// FIX: Define props interface for ProblemIdentifier component
interface ProblemIdentifierProps {
  cropNameMap: Record<CropType, string>;
  onBackToLanding: () => void;
  onIdentificationComplete: (result: IdentificationResult) => void;
}

const ProblemIdentifier: React.FC<ProblemIdentifierProps> = ({ cropNameMap, onBackToLanding, onIdentificationComplete }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [inputKey, setInputKey] = useState<string>(`key-${Date.now()}`);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Очищення blob URL при розмонтуванні компонента
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
          URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

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
    setInputKey(`key-${Date.now()}`);

    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      setResult(null);
      
      if (imageSrc && imageSrc.startsWith('blob:')) {
          URL.revokeObjectURL(imageSrc);
      }
      setImageSrc(null);
      setImageBase64(null);

      try {
        const compressedBlob = await compressImage(file);
        const base64Data = await blobToBase64(compressedBlob);
        const previewUrl = URL.createObjectURL(compressedBlob);
        
        setImageSrc(previewUrl);
        setImageBase64(base64Data);
      } catch (err: any) {
        console.error("Помилка обробки зображення:", err);
        setError('Не вдалося обробити зображення. Спробуйте інше фото.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleIdentify = async () => {
    if (!imageBase64) return;

    setIsLoading(true);
    setError(null);

    try {
      // Перевірка API ключа перенесена всередину try-catch
      if (!process.env.API_KEY) {
        throw new Error('API_KEY is not available');
      }

      const ai = new GoogleGenAI({ 
        apiKey: process.env.API_KEY as string 
      });

      const cropList = Object.values(CropType).join(', ');
      const promptText = `Проаналізуй зображення рослини. Ідентифікуй вид рослини та будь-які видимі хвороби чи шкідників. Надай відповідь українською мовою.
- **crop**: Вид рослини. Має бути одним із цих значень: [${cropList}]. Якщо не впевнений або рослини немає у списку, використовуй 'unknown'.
- **name**: Назва ідентифікованої хвороби, шкідника, або 'Здорова рослина', якщо проблем не виявлено.
- **type**: Тип проблеми. Має бути 'disease', 'pest', або 'unknown'. Якщо рослина здорова, використовуй 'unknown'.
- **description**: Короткий опис твоїх висновків.
- **confidence**: Твоя впевненість в ідентифікації (від 0 до 100).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64,
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
                crop: { type: Type.STRING, description: `Вид рослини. Одне з: ${cropList}, unknown` },
                name: { type: Type.STRING, description: 'Назва хвороби, шкідника, або "Здорова рослина".' },
                type: { type: Type.STRING, description: "Тип проблеми: 'disease', 'pest', або 'unknown'." },
                description: { type: Type.STRING, description: 'Детальний опис знайденої проблеми або стану рослини.' },
                confidence: { type: Type.NUMBER, description: 'Впевненість в ідентифікації у відсотках (0-100).' },
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
      let userMessage = 'Помилка аналізу. Перевірте підключення до інтернету та спробуйте ще раз.';
      
      if (err instanceof Error) {
        if (err.message.includes('API_KEY')) {
          userMessage = 'Помилка конфігурації. Не вдалося отримати доступ до API ключа. Спробуйте оновити сторінку.';
        } else if (err.message.includes('SAFETY')) {
          userMessage = 'Зображення не пройшло перевірку безпеки. Спробуйте інше фото.';
        } else if (err.message.includes('network') || err.message.includes('Network')) {
          userMessage = 'Проблема з мережевим зʼєднанням. Перевірте інтернет.';
        } else if (err.message.includes('quota') || err.message.includes('Quota')) {
          userMessage = 'Перевищено ліміт запитів. Спробуйте пізніше.';
        }
      }
      
      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(null);
    setImageBase64(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    setInputKey(`key-reset-${Date.now()}`);
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

      {!imageSrc && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4">
            <button 
              onClick={() => handleFileTrigger(true)} 
              className="p-4 sm:p-6 md:p-8 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] touch-manipulation"
              disabled={isLoading}
            >
                <CameraIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-500 mb-2" />
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Зробити фото</span>
            </button>
            <button 
              onClick={() => handleFileTrigger(false)} 
              className="p-4 sm:p-6 md:p-8 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center min-h-[100px] sm:min-h-[120px] touch-manipulation"
              disabled={isLoading}
            >
                <UploadIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-500 mb-2" />
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Завантажити з галереї</span>
            </button>
        </div>
      )}

      {isLoading && !imageSrc && (
        <div className="text-center py-6 sm:py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Обробка фото...</p>
        </div>
      )}
      
      {imageSrc && (
        <div className="space-y-4 sm:space-y-6">
            <div className="w-full max-w-sm mx-auto">
                <img 
                  src={imageSrc} 
                  alt="Preview" 
                  className="rounded-lg shadow-md w-full h-auto max-h-[400px] object-contain" 
                />
            </div>
            {!result && (
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <button 
                      onClick={handleIdentify} 
                      disabled={isLoading}
                      className="bg-green-600 text-white font-bold py-3 px-6 sm:px-8 rounded-lg hover:bg-green-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[50px] touch-manipulation"
                    >
                        {isLoading ? 'Аналіз...' : 'Аналізувати'}
                    </button>
                    <button 
                      onClick={reset} 
                      disabled={isLoading}
                      className="bg-gray-200 text-gray-700 font-bold py-3 px-6 sm:px-8 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed min-h-[50px] touch-manipulation"
                    >
                        Обрати інше
                    </button>
                </div>
            )}
        </div>
      )}
      
      {isLoading && imageSrc && (
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Аналіз зображення...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-4 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mt-4">
          {error}
          <button 
            onClick={reset}
            className="ml-3 text-red-700 hover:text-red-900 underline"
          >
            Спробувати знову
          </button>
        </div>
      )}

      {result && (
        <div className="mt-6 sm:mt-8 border-t pt-6 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Ідентифіковано: {result.name}</h3>
          <div className="space-y-2 mb-4">
            <p className="text-base sm:text-lg text-gray-600">
              Культура: <strong>{result.crop !== 'unknown' && cropNameMap[result.crop] ? cropNameMap[result.crop].replace(/ів$/, '') : 'Невизначено'}</strong>
            </p>
            <p className="text-sm text-gray-500">Впевненість: {result.confidence.toFixed(1)}%</p>
          </div>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">{result.description}</p>

          {result.crop !== 'unknown' && (result.type === 'disease' || result.type === 'pest') ? (
            <button 
              onClick={() => onIdentificationComplete(result)} 
              className="bg-blue-600 text-white font-bold py-3 px-6 sm:px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg min-h-[50px] touch-manipulation"
            >
              Знайти препарати для боротьби
            </button>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-xl mx-auto">
              <p className="text-orange-700 text-sm sm:text-base">
                Не вдалося визначити культуру з довідника або класифікувати проблему. Рекомендації недоступні.
              </p>
            </div>
          )}

          <button 
            onClick={reset} 
            className="mt-4 text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors"
          >
            Спробувати інше фото
          </button>
        </div>
      )}
    </div>
  );
};

export default ProblemIdentifier;
