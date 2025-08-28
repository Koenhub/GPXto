interface StepsProps {
  currentStep: number
}

export function Steps({ currentStep }: StepsProps) {
  const steps = [
    { id: 1, name: "Upload" },
    { id: 2, name: "Configure" },
    { id: 3, name: "Convert" },
  ]

  return (
    <div className="w-full">
      <h2 className="text-xl mb-6">Convert GPX File</h2>
      <div className="flex items-center justify-between w-full mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-[50%] w-[calc(100%+1.5rem)] h-px top-3 -z-10 transition-colors duration-300 ${
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                }`}
              />
            )}

            {/* Step circle */}
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full mb-2 transition-all duration-300 ${
                currentStep === step.id
                  ? "border border-primary text-primary"
                  : currentStep > step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step.id}
            </div>

            {/* Step name */}
            <span
              className={`text-xs transition-colors duration-300 ${
                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
