import React from 'react';

interface Step {
  number: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  goToStep: (step: number) => void;
}

const CheckIcon = () => (
    <svg className="w-full h-full text-white p-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, goToStep }) => {
  const getStepClass = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <div className="w-full px-4 sm:px-0 mb-12">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const status = getStepClass(step.number);
          const isLast = index === steps.length - 1;
          const isCompleted = status === 'completed';
          const isActive = status === 'active';

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isCompleted && goToStep(step.number)}
                  disabled={!isCompleted}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold
                    ${isCompleted ? 'bg-green-600 text-white cursor-pointer hover:bg-green-700' : ''}
                    ${isActive ? 'bg-white border-4 border-green-600 text-green-600' : ''}
                    ${status === 'inactive' ? 'bg-gray-200 text-gray-500 border-2 border-gray-300' : ''}
                    transition-colors
                  `}
                  aria-label={`Крок ${step.number}: ${step.title}`}
                >
                  {isCompleted ? <CheckIcon /> : step.number}
                </button>
                <p className={`mt-2 text-center text-xs sm:text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {step.title}
                </p>
              </div>
              {!isLast && (
                <div className={`flex-auto border-t-2 transition-colors -mx-2
                  ${isCompleted ? 'border-green-600' : 'border-gray-200'}
                `}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
