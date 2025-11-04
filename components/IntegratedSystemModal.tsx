
import React, { useState } from 'react';

interface IntegratedSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (period: number) => void;
}

const IntegratedSystemModal: React.FC<IntegratedSystemModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [period, setPeriod] = useState<number>(90);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (period > 20 && period < 365) {
      onSubmit(period);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Закрити"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <h2 id="modal-title" className="text-2xl font-bold text-green-700 mb-4">Розрахунок інтегрованої системи</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="growing-period" className="block text-gray-700 font-semibold mb-2">
                Вегетаційний період (днів)
            </label>
            <input
                id="growing-period"
                type="number"
                value={period}
                onChange={(e) => setPeriod(parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                min="21"
                max="364"
                required
            />
            <p className="text-xs text-gray-500 mt-1">Введіть тривалість від висадки/сходів до останнього збору.</p>
            <div className="mt-6 flex justify-end">
                <button 
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors mr-3"
                >
                    Скасувати
                </button>
                <button 
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                    Розрахувати
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default IntegratedSystemModal;