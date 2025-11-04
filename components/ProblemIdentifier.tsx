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

const resizeImage = (file: File, maxSize: number): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
        const bmp = await createImageBitmap(file, {
            resizeWidth: maxSize,
            resizeHeight: maxSize,
            resizeQuality: 'high',
        });

        const canvas = document.createElement('canvas');
        canvas.width = bmp.width;
        canvas.height = bmp.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(bmp, 0, 0);

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Canvas to Blob conversion failed'));
                }
            },
            'image/jpeg',
            0.9 // 90% quality
        );
    } catch (error) {
        reject(error);
    }
  });
};


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

const ProblemIdentifier: React.FC<ProblemIdentifierProps> = ({ cropNameMap, onBackToLanding, onIdentificationComplete }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [inputKey, setInputKey] = useState<string>(`key-${Date.now()}`);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileTrigger = (useCamera: boolean) => {
    const input = fileInputRef.current;
    if (input) {
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
        const resizedBlob = await resizeImage(file, 1024);
        const base64Data = await blobToBase64(resizedBlob);
        const previewUrl = URL.createObjectURL(resizedBlob);
        
        setImageSrc(previewUrl);
        setImageBase64(base64Data);
      } catch (err: any) {
        console.error("Помилка обробки зображення:", err);
        setError(err.message || "Не вдалося обробити зображення. Будь ласка, спробуйте інше.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleIdentify = async () => {
    if (!imageBase64) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

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
      let userMessage = 'Під час аналізу сталася помилка. Це може бути пов\'язано з тимчасовою проблемою на сервері або з контентом зображення. Будь ласка, спробуйте ще раз або використайте інше фото.';
      if (err instanceof Error && err.message.includes('SAFETY')) {
        userMessage = 'Зображення не вдалося обробити через налаштування безпеки. Спробуйте інше фото.';
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
    setInputKey(`key-reset-${Date.now()}`);
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">Визначити проблему за фото</h2>
      
      <input 
        key={inputKey}
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {!imageSrc && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <button onClick={() => handleFileTrigger(true)} className="p-8 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-colors flex flex-col items-center justify-center">
                <CameraIcon className="w-12 h-12 text-gray-500 mb-2" />
                <span className="font-semibold text-gray-700">Зробити фото</span>
            </button>
            <button onClick={() => handleFileTrigger(false)} className="p-8 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center">
                <UploadIcon className="w-12 h-12 text-gray-500 mb-2" />
                <span className="font-semibold text-gray-700">Завантажити з галереї</span>
            </button>
        </div>
      )}

      {isLoading && !imageSrc && <div className="text-center py-4">Обробка фото...</div>}
      
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
      
      {isLoading && imageSrc && <div className="text-center py-4">Аналіз...</div>}
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