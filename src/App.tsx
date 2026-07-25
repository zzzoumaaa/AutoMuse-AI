import React, { useState, useEffect } from "react";
import { ConceptInput, ConceptReport, SavedConcept } from "./types";
import { PRESET_CONCEPTS } from "./data/presetConcepts";
import { Header } from "./components/Header";
import { InputPanel } from "./components/InputPanel";
import { ConceptReportView } from "./components/ConceptReportView";
import { SavedConceptsDrawer } from "./components/SavedConceptsDrawer";
import { StudioGuideModal } from "./components/StudioGuideModal";
import { AlertCircle, Sparkles, Wand2 } from "lucide-react";

export default function App() {
  const [input, setInput] = useState<ConceptInput>({
    vehicleType: "",
    year: "",
    designStyle: "",
    brandInspiration: "",
    targetAudience: "",
    countryMarket: "",
    customPrompt: "",
  });

  const [currentReport, setCurrentReport] = useState<ConceptReport | null>(null);

  const [savedConcepts, setSavedConcepts] = useState<SavedConcept[]>(() => {
    try {
      const stored = localStorage.getItem("automuse_saved_concepts");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load saved concepts:", e);
    }
    return PRESET_CONCEPTS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Persist saved concepts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("automuse_saved_concepts", JSON.stringify(savedConcepts));
    } catch (e) {
      console.error("Failed to persist saved concepts:", e);
    }
  }, [savedConcepts]);

  // Check if current report is saved
  const isCurrentSaved = savedConcepts.some(
    (c) => c.report.vehicleName === currentReport?.vehicleName
  );

  // API Call to generate concept report
  const handleGenerateConcept = async (overrideInput?: ConceptInput | unknown, isRespin = false) => {
    setIsLoading(true);
    setError(null);
    setCurrentReport(null); // Reset concept state for fresh independent generation

    // Validate if overrideInput is a valid ConceptInput object (not a React SyntheticEvent)
    const isValidInputObj =
      overrideInput &&
      typeof overrideInput === "object" &&
      "vehicleType" in overrideInput &&
      typeof (overrideInput as any).vehicleType === "string";

    const payload = isValidInputObj ? (overrideInput as ConceptInput) : input;

    try {
      const response = await fetch("/api/generate-concept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          isRespin,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        setCurrentReport(result.data);
        if (result.meta) {
          setInput((prev) => ({
            ...prev,
            vehicleType: result.meta.vehicleType || prev.vehicleType,
            year: result.meta.year || prev.year,
            designStyle: result.meta.designStyle || prev.designStyle,
            brandInspiration: result.meta.brandInspiration || prev.brandInspiration,
            targetAudience: result.meta.targetAudience || prev.targetAudience,
            countryMarket: result.meta.countryMarket || prev.countryMarket,
            customPrompt: typeof result.meta.customPrompt === "string" ? result.meta.customPrompt : prev.customPrompt,
          }));
        }
        // Scroll smoothly to report
        setTimeout(() => {
          const reportElement = document.getElementById("concept-report-section");
          if (reportElement) {
            reportElement.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        throw new Error(result.error || "Server returned an error generating concept.");
      }
    } catch (err: any) {
      console.error("Error generating concept:", err);
      setError(
        err?.message || "Failed to generate concept. Please ensure API key is configured or try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Re-spin (Surprise me) wild creative variation
  const handleRespinConcept = () => {
    handleGenerateConcept(input, true);
  };

  // Save current concept to history
  const handleSaveCurrentConcept = () => {
    if (!currentReport) return;

    if (isCurrentSaved) {
      // Remove
      setSavedConcepts((prev) =>
        prev.filter((c) => c.report.vehicleName !== currentReport.vehicleName)
      );
    } else {
      // Add
      const newSaved: SavedConcept = {
        id: `concept-${Date.now()}`,
        input,
        report: currentReport,
        createdAt: new Date().toISOString(),
      };
      setSavedConcepts((prev) => [newSaved, ...prev]);
    }
  };

  // Load a preset or saved concept
  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_CONCEPTS.find((p) => p.id === presetId);
    if (found) {
      setInput(found.input);
      setCurrentReport(found.report);
      const reportElement = document.getElementById("concept-report-section");
      if (reportElement) {
        reportElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSelectSavedConcept = (conceptItem: SavedConcept) => {
    setInput(conceptItem.input);
    setCurrentReport(conceptItem.report);
    const reportElement = document.getElementById("concept-report-section");
    if (reportElement) {
      reportElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteSavedConcept = (id: string) => {
    setSavedConcepts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleResetStudio = () => {
    setInput({
      vehicleType: "",
      year: "",
      designStyle: "",
      brandInspiration: "",
      targetAudience: "",
      countryMarket: "",
      customPrompt: "",
    });
    setCurrentReport(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 flex flex-col font-sans selection:bg-[#3e5443] selection:text-white">
      {/* Studio Header Navigation */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        savedCount={savedConcepts.length}
        onSelectPreset={handleSelectPreset}
        onResetStudio={handleResetStudio}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-10">
        {/* Error Alert Toast */}
        {error && (
          <div className="bg-red-950/80 border border-red-800/80 rounded-xl p-4 flex items-center justify-between gap-3 text-red-200 text-xs font-mono shadow-xl animate-fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="px-2.5 py-1 rounded bg-red-900/60 hover:bg-red-800 text-red-100 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. Vehicle Concept Input Section */}
        <div id="input-section">
          <InputPanel
            input={input}
            onChange={setInput}
            onGenerate={handleGenerateConcept}
            onRespin={handleRespinConcept}
            onResetStudio={handleResetStudio}
            isLoading={isLoading}
          />
        </div>

        {/* 2. Generated Concept Report View Section */}
        {currentReport && (
          <div id="concept-report-section" className="pt-2">
            <ConceptReportView
              report={currentReport}
              input={input}
              onSaveConcept={handleSaveCurrentConcept}
              isSaved={isCurrentSaved}
              onRespinConcept={handleRespinConcept}
              isRespining={isLoading}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0e10] border-t border-zinc-800/80 py-8 px-4 text-center text-xs text-zinc-500 font-mono space-y-2 mt-12">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#526e5a]"></span>
          <span className="text-zinc-400 font-semibold uppercase tracking-wider font-serif">
            AutoMuse AI Studio
          </span>
        </div>
        <p className="font-light text-zinc-500 max-w-md mx-auto">
          Automotive & Transport Design AI Studio for Students, Concept Artists & Enthusiasts. Powered by Gemini 3.6 Flash.
        </p>
        <p className="text-[10px] text-zinc-600">
          © {new Date().getFullYear()} AutoMuse AI • Luxury Automotive Design System
        </p>
      </footer>

      {/* History Side Drawer */}
      <SavedConceptsDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedConcepts={savedConcepts}
        onSelectConcept={handleSelectSavedConcept}
        onDeleteConcept={handleDeleteSavedConcept}
      />

      {/* Portfolio Studio Guide Modal */}
      <StudioGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
