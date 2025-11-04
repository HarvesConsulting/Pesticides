import React, { useState, useRef } from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { UploadIcon } from './icons/UploadIcon';

const compressImage = (file: File, maxWidth = 1024, quality = 0.8): Promise<{blob: Blob, url: string}> => {
  console.log('[compressImage] Starting compression for file:', file.name, 'size:', file.size);
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('[compressImage] Could not get canvas context.');
      return reject(new Error('Could not get canvas context'));
    }

    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      console.log('[compressImage] Image loaded successfully. Original dimensions:', img.width, 'x', img.height);
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
      
      console.log('[compressImage] Resizing to max dimension:', maxWidth, 'New dimensions:', width, 'x', height);
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('[compressImage] Compression to blob successful. New size:', blob.size);
            resolve({blob, url: dataUrl});
          } else {
            console.error('[compressImage] Canvas toBlob failed.');
            reject(new Error('Canvas toBlob failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = (err) => {
        URL.revokeObjectURL(img.src);
        console.error('[compressImage] Image loading failed:', err);
        reject(new Error('Image loading failed'));
    };
    img.src = URL.createObjectURL(file);
    console.log('[compressImage] Image source set to object URL.');
  });
};


interface ProblemIdentifierProps {
  onImageReady: (blob: Blob, dataUrl: string) => void;
}

const ProblemIdentifier: React.FC<ProblemIdentifierProps> = ({ onImageReady }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    console.log('[ProblemIdentifier] handleFileChange triggered.');
    const input = event.target;
    const file = input.files?.[0];
    
    if (file) {
      console.log('[ProblemIdentifier] File selected:', { name: file.name, size: file.size, type: file.type });
      setIsLoading(true);
      setError(null);

      try {
        const { blob, url } = await compressImage(file);
        console.log('[ProblemIdentifier] Image processing complete, calling onImageReady.');
        onImageReady(blob, url);
        // The parent component will handle the loading state from here
      } catch (err: any) {
        console.error("[ProblemIdentifier] Error processing image:", err);
        setError('Не вдалося обробити зображення. Спробуйте інше фото.');
        setIsLoading(false);
      }
    } else {
        console.log('[ProblemIdentifier] No file selected.');
    }
    // Clear the value to ensure onChange fires again for the same file.
    input.value = '';
  };
  
  const handleResetError = () => {
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Визначити проблему за фото</h2>
      
      <input 
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
            onClick={handleResetError}
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