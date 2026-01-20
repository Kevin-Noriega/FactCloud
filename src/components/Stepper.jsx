import "../styles/Stepper.css";

export default function Stepper({ currentStep = 1 }) {
  const steps = [
    "Elige un plan",
    "Crea tu cuenta",
    "Finaliza tu compra",
  ];

  return (
    <div className="stepper-container">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div className="stepper-step" key={stepNumber}>
            <div
              className={`step-circle ${
                isCompleted ? "completed" : isActive ? "active" : ""
              }`}
            >
              {stepNumber}
            </div>

            <span
              className={`step-label ${
                isActive ? "active" : isCompleted ? "completed" : ""
              }`}
            >
              {label}
            </span>

            {stepNumber !== steps.length && (
              <div
                className={`step-line ${
                  isCompleted ? "completed" : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
