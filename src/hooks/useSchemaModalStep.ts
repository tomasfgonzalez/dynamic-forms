import { useState, useEffect } from "react";
import type { Schema } from "./useSchemas";

export function useSchemaModalStep(isOpen: boolean, editingSchema: Schema | null) {
  const [step, setStep] = useState<"landing" | "scratch" | "import" | "examples">("landing");

  useEffect(() => {
    if (isOpen) {
      setStep(editingSchema ? "scratch" : "landing");
    }
  }, [isOpen, editingSchema]);

  const goToLanding = () => setStep("landing");
  const goToScratch = () => setStep("scratch");
  const goToImport = () => setStep("import");
  const goToExamples = () => setStep("examples");

  return { step, goToLanding, goToScratch, goToImport, goToExamples, setStep };
}
