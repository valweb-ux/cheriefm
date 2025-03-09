"use client"
import { cn } from "@/lib/utils"
import { CheckCircle2 } from "lucide-react"

interface Step {
  id: number
  title: string
  description?: string
}

interface WizardStepsProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export function WizardSteps({ steps, currentStep, onStepClick }: WizardStepsProps) {
  return (
    <div className="mb-8">
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const isClickable = onStepClick && (isCompleted || step.id === currentStep)

          return (
            <div
              key={step.id}
              className={cn("flex flex-col items-center relative z-10", isClickable ? "cursor-pointer" : "")}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCurrent
                      ? "border-primary text-primary"
                      : "border-muted-foreground text-muted-foreground",
                )}
              >
                {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <span>{step.id}</span>}
              </div>

              <div className="text-center mt-2">
                <div
                  className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground mt-1 max-w-[120px]">{step.description}</div>
                )}
              </div>
            </div>
          )
        })}

        {/* Connecting line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted-foreground -z-10">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

