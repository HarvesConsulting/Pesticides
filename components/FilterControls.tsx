import React from 'react';

export interface FilterOption {
  key: string;
  label: string;
}

interface FilterControlsProps {
  options: FilterOption[];
  activeFilters: Record<string, boolean>;
  onFilterChange: (filterKey: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ options, activeFilters, onFilterChange }) => {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
      <h4 className="font-semibold text-gray-700 mb-2">Фільтрувати за дією на:</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => onFilterChange(option.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors
              ${activeFilters[option.key]
                ? 'bg-green-600 text-white shadow'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterControls;