interface StepperProps {
  step: number;
  totalSteps: number;
}

export function Stepper({ step, totalSteps }: StepperProps) {
  return (
    <div className="flex items-center space-x-2 mb-6 justify-center">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isActive = i + 1 <= step;
        return (
          <div
            key={i}
            className={`h-2 w-8 rounded-full transition-all duration-300 ${
              isActive ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
}
