import React, { useState } from "react";
import { ConceptReport, ConceptInput } from "../types";
import { TechnicalSilhouette } from "./TechnicalSilhouette";
import {
  Car,
  Sparkles,
  Palette,
  Layers,
  Wind,
  Shield,
  Leaf,
  FileText,
  Copy,
  Check,
  Download,
  Compass,
  Bookmark,
  BookmarkCheck,
  Gauge,
  Zap,
  Users2,
  Ruler,
  Shuffle,
} from "lucide-react";

interface ConceptReportViewProps {
  report: ConceptReport;
  input: ConceptInput;
  onSaveConcept: () => void;
  isSaved: boolean;
  onRespinConcept?: () => void;
  isRespining?: boolean;
}

const formatTopSpeed = (val?: string): string => {
  if (!val) return "420 km/h / 261 mph";
  return val;
};

const formatRange = (val?: string): string => {
  if (!val) return "2,200 km / 1,367 mi";
  return val;
};

export const ConceptReportView: React.FC<ConceptReportViewProps> = ({
  report,
  input,
  onSaveConcept,
  isSaved,
  onRespinConcept,
  isRespining = false,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyFullReport = () => {
    const fullMarkdown = `
# AUTOMUSE AI CONCEPT REPORT: ${report.vehicleName}
Target Year: ${input.year} | Style: ${input.designStyle} | Brand Inspiration: ${input.brandInspiration}

### DESIGN PHILOSOPHY
"${report.designPhilosophy}"

### VEHICLE CONCEPT SUMMARY
${report.vehicleConceptSummary}

### DESIGN DNA
${(Array.isArray(report.designDna) ? report.designDna : []).map((d) => `- ${d.attribute}: ${d.percentage}%`).join("\n")}

### KEY SPECIFICATIONS
- Top Speed: ${formatTopSpeed(report.keySpecs?.topSpeed)}
- Range: ${formatRange(report.keySpecs?.range)}
- Output: ${report.keySpecs?.estimatedHp}

### COLOR PALETTE SUGGESTIONS
${(Array.isArray(report.colorPaletteSuggestions) ? report.colorPaletteSuggestions : []).map((c) => `- ${c.name} (${c.hex}): ${c.usage}`).join("\n")}

### NEXT-GEN MATERIALS
${(Array.isArray(report.materialsList) ? report.materialsList : []).map((m) => `- ${m.name} (${m.category}): ${m.description}`).join("\n")}
`;
    handleCopyText(fullMarkdown, "full");
  };

  const handleDownloadReport = () => {
    const fullMarkdown = `# AUTOMUSE AI CONCEPT REPORT: ${report.vehicleName}\n\n${report.vehicleConceptSummary}`;
    const blob = new Blob([fullMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.vehicleName.replace(/\s+/g, "_")}_ConceptReport.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
   <div className="space-y-8 animate-fade-in">
      
      {/* 1. Header Banner */}
      <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col items-center justify-center text-center gap-5 relative z-10 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#233026] text-emerald-300 border border-[#384d3d]">
                Year {report.keySpecs?.yearOfProduction || input.year}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-900/90 text-zinc-300 border border-zinc-800">
                {input.brandInspiration} Heritage
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight font-serif uppercase mt-1 text-center break-words max-w-4xl">
              {report.vehicleName}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-2xl text-center font-light leading-relaxed">
              Designed for {input.targetAudience} • {input.vehicleType} Concept Studio Portfolio
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-2">
            <button
              onClick={() => onRespinConcept?.()}
              disabled={isRespining}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-900/90 to-teal-900/90 text-emerald-100 border border-emerald-600/80 shadow-lg cursor-pointer"
            >
              <Shuffle className={`w-4 h-4 text-emerald-300 ${isRespining ? "animate-spin" : ""}`} />
              <span>{isRespining ? "Synthesizing..." : "Respin (New Concept)"}</span>
            </button>

            <button
              onClick={() => onSaveConcept()}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
                isSaved ? "bg-[#253328] text-emerald-200 border-[#3e5443]" : "bg-zinc-900/90 text-zinc-200 border-zinc-700/80"
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4 text-zinc-400" />}
              <span>{isSaved ? "Saved in My Garage" : "Save to My Garage"}</span>
            </button>

            <button
              onClick={handleCopyFullReport}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900/90 text-zinc-200 border border-zinc-700/80"
            >
              {copiedSection === "full" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              <span>{copiedSection === "full" ? "Copied!" : "Copy Report"}</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-semibold bg-[#2a382e] text-emerald-100 border border-[#405748]"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Export Portfolio (.md)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Specs Stats Dashboard */}
      {report.keySpecs && (
        <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 font-mono">
            <Gauge className="w-4 h-4 text-emerald-400" />
            Speculative Performance Metrics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Top Speed</span>
              <span className="text-sm font-bold font-mono text-emerald-300">{formatTopSpeed(report.keySpecs.topSpeed)}</span>
            </div>
            <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Max Range</span>
              <span className="text-sm font-bold font-mono text-zinc-100">{formatRange(report.keySpecs.range)}</span>
            </div>
            <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Power Output</span>
              <span className="text-sm font-bold font-mono text-zinc-100">{report.keySpecs.estimatedHp}</span>
            </div>
            <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800/80">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Drag Coeff</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{report.keySpecs.dragCoefficient}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Design DNA Influence Mix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.isArray(report.designDna) && report.designDna.length > 0 && (
          <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Design DNA Influence Mix
            </h3>

            <div className="space-y-3.5">
              {(Array.isArray(report.designDna) ? report.designDna : []).map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
                    <span>{item.attribute}</span>
                    <span className="font-mono text-emerald-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Size Benchmark */}
        {report.sizeComparison && (
          <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Ruler className="w-4 h-4 text-emerald-400" />
              Vehicle Size & Scale Benchmark
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Overall Length</span>
                <span className="text-sm font-bold text-zinc-100 font-mono">{report.sizeComparison.lengthMeters}</span>
              </div>
              <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800 col-span-2">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Scale Benchmark</span>
                <span className="text-xs font-bold text-emerald-300 font-sans block">{report.sizeComparison.comparedTo}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Wind Tunnel Stage */}
      <div>
        <TechnicalSilhouette
          vehicleType={input.vehicleType}
          vehicleName={report.vehicleName}
          dragCoefficient={report.keySpecs?.dragCoefficient}
          estimatedHp={report.keySpecs?.estimatedHp}
          customPrompt={input.customPrompt}
          aeroStreamlines={report.aeroStreamlines}
        />
      </div>

       {report.aerodynamicsSuggestions && (
        <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3 mt-6">
         <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
         Aerodynamics Explanation
        </h3>


        <p className="text-sm text-zinc-300 leading-relaxed">
          {report.aerodynamicsSuggestions}
        </p>
      </div>
      )}

      {/* 5. Next-Gen Materials */}
      {Array.isArray(report.materialsList) && report.materialsList.length > 0 && (
        <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 font-mono">
            <Layers className="w-4 h-4 text-emerald-400" />
            Next-Gen Sustainable Materials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Array.isArray(report.materialsList) ? report.materialsList : []).map((mat, idx) => (
              <div key={idx} className="bg-[#121214] p-4 rounded-xl border border-zinc-800/90 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-[#1a281e] px-2 py-0.5 rounded border border-[#2f4a38]">
                  {mat.category}
                </span>
                <h4 className="text-xs font-bold text-zinc-100 font-serif">{mat.name}</h4>
                <p className="text-xs text-zinc-400 font-light">{mat.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Professional Design Description */}
{report.professionalDesignDescription && (
  <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
      Professional Design Description
    </h3>

    <p className="text-sm text-zinc-300 leading-relaxed">
      {report.professionalDesignDescription}
    </p>
  </div>
)}

{/* 6. AI Design Insights */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {report.vehicleConceptSummary && (
    <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
        Concept Summary
      </h3>
      <p className="text-sm text-zinc-300 leading-relaxed">
        {report.vehicleConceptSummary}
      </p>
    </div>
  )}

  {report.professionalDesignDescription && (
    <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
        Professional Design Description
      </h3>
      <p className="text-sm text-zinc-300 leading-relaxed">
        {report.professionalDesignDescription}
      </p>
    </div>
  )}

  {report.exteriorStylingSuggestions && (
    <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
        Exterior Styling
      </h3>
      <p className="text-sm text-zinc-300 leading-relaxed">
        {report.exteriorStylingSuggestions}
      </p>
    </div>
  )}

  {report.interiorStylingSuggestions && (
    <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
        Interior Styling
      </h3>
      <p className="text-sm text-zinc-300 leading-relaxed">
        {report.interiorStylingSuggestions}
      </p>
    </div>
  )}

  {report.materialsRecommendations && (
    <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
        Materials Recommendations
      </h3>
      <p className="text-sm text-zinc-300 leading-relaxed">
        {report.materialsRecommendations}
      </p>
    </div>
  )}

  {report.aerodynamicsSuggestions && (
    <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
        Aerodynamics Suggestions
      </h3>
      <p className="text-sm text-zinc-300 leading-relaxed">
        {report.aerodynamicsSuggestions}
      </p>
    </div>
  )}

  {report.vehicleStructureRecommendations && (
    <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
        Vehicle Structure
      </h3>
      <p className="text-sm text-zinc-300 leading-relaxed">
        {report.vehicleStructureRecommendations}
      </p>
    </div>
  )}

  {report.sustainabilityRecommendations && (
    <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
        Sustainability
      </h3>
      <p className="text-sm text-zinc-300 leading-relaxed">
        {report.sustainabilityRecommendations}
      </p>
    </div>
  )}

</div>


      {/* 6. Color Palette Swatches */}
      <div className="bg-[#18181a] border border-zinc-800 rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#6c8c73]" />
          Color Palette Suggestions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Array.isArray(report.colorPaletteSuggestions) ? report.colorPaletteSuggestions : []).map((color, idx) => (
            <div key={idx} className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800 flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-white/20" style={{ backgroundColor: color.hex }}></div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">{color.name}</h4>
                  <span className="text-[11px] font-mono text-zinc-400">{color.hex}</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 font-light pt-2 border-t border-zinc-800/80">{color.usage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};