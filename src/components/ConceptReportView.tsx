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
  RotateCw,
  Gauge,
  Zap,
  Globe2,
  Users2,
  Cpu,
  Ruler,
  Quote,
  Sparkle,
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
  const lower = val.toLowerCase();

  const hasKmh = lower.includes("km/h") || lower.includes("kmh") || lower.includes("kph");
  const hasMph = lower.includes("mph");

  if (hasKmh && hasMph) {
    return val;
  }

  if (lower.includes("mach")) {
    const match = val.match(/mach\s*([\d.]+)/i) || val.match(/([\d.]+)\s*mach/i);
    if (match) {
      const mach = parseFloat(match[1]);
      if (!isNaN(mach)) {
        const kmh = Math.round(mach * 1234.8);
        const mph = Math.round(mach * 767.269);
        return `${val} (${kmh.toLocaleString()} km/h / ${mph.toLocaleString()} mph)`;
      }
    }
    return val;
  }

  if (hasKmh) {
    const match = val.match(/(\d+[\d,.]*)/);
    if (match) {
      const kmh = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(kmh)) {
        const mph = Math.round(kmh * 0.621371);
        return `${kmh.toLocaleString()} km/h / ${mph.toLocaleString()} mph`;
      }
    }
  }

  if (hasMph) {
    const match = val.match(/(\d+[\d,.]*)/);
    if (match) {
      const mph = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(mph)) {
        const kmh = Math.round(mph * 1.60934);
        return `${kmh.toLocaleString()} km/h / ${mph.toLocaleString()} mph`;
      }
    }
  }

  const numMatch = val.match(/(\d+[\d,.]*)/);
  if (numMatch) {
    const num = parseFloat(numMatch[1].replace(/,/g, ""));
    if (!isNaN(num)) {
      const mph = Math.round(num * 0.621371);
      return `${num.toLocaleString()} km/h / ${mph.toLocaleString()} mph`;
    }
  }

  return val;
};

const formatRange = (val?: string): string => {
  if (!val) return "2,200 km / 1,367 mi";
  const lower = val.toLowerCase();

  const hasKm = lower.includes("km");
  const hasMi = lower.includes("mi") || lower.includes("miles");

  if (hasKm && hasMi) {
    return val;
  }

  if (hasKm) {
    const match = val.match(/(\d+[\d,.]*)/);
    if (match) {
      const km = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(km)) {
        const mi = Math.round(km * 0.621371);
        return `${km.toLocaleString()} km / ${mi.toLocaleString()} mi`;
      }
    }
  }

  if (hasMi) {
    const match = val.match(/(\d+[\d,.]*)/);
    if (match) {
      const mi = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(mi)) {
        const km = Math.round(mi * 1.60934);
        return `${km.toLocaleString()} km / ${mi.toLocaleString()} mi`;
      }
    }
  }

  const numMatch = val.match(/(\d+[\d,.]*)/);
  if (numMatch) {
    const num = parseFloat(numMatch[1].replace(/,/g, ""));
    if (!isNaN(num)) {
      const mi = Math.round(num * 0.621371);
      return `${num.toLocaleString()} km / ${mi.toLocaleString()} mi`;
    }
  }

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
Target Audience: ${input.targetAudience} | Market: ${input.countryMarket}

---
### DESIGN PHILOSOPHY
"${report.designPhilosophy}"

### VEHICLE CONCEPT SUMMARY
${report.vehicleConceptSummary}
${
  report.signatureWowFeature
    ? `
### SIGNATURE FUTURISTIC FEATURE
- Feature: ${report.signatureWowFeature.title} (${report.signatureWowFeature.category})
- Description: ${report.signatureWowFeature.description}
- Impact: ${report.signatureWowFeature.impact}
`
    : ""
}
### DESIGN DNA
${report.designDna?.map((d) => `- ${d.attribute}: ${d.percentage}%`).join("\n")}

### KEY SPECIFICATIONS
- Top Speed: ${formatTopSpeed(report.keySpecs.topSpeed)}
- Range: ${formatRange(report.keySpecs.range)}
- Output: ${report.keySpecs.estimatedHp}
- 0-60 MPH: ${report.keySpecs.zeroToSixty || "1.75s"}
- Drag Coefficient: ${report.keySpecs.dragCoefficient}
- Powertrain: ${report.keySpecs.powertrainType}
- Autonomy: ${report.keySpecs.autonomyLevel}
- Terrain: ${report.keySpecs.terrainCompatibility}
- Capacity: ${report.keySpecs.passengers}

### DESIGN LANGUAGE
${report.designLanguage}

### EXTERIOR STYLING SUGGESTIONS
${report.exteriorStylingSuggestions}

### INTERIOR STYLING SUGGESTIONS
${report.interiorStylingSuggestions}

### COLOR PALETTE SUGGESTIONS
${report.colorPaletteSuggestions.map((c) => `- ${c.name} (${c.hex}): ${c.usage}`).join("\n")}

### NEXT-GEN MATERIALS
${report.materialsList?.map((m) => `- ${m.name} (${m.category}): ${m.description}`).join("\n")}

### AERODYNAMICS SUGGESTIONS
${report.aerodynamicsSuggestions}

### VEHICLE STRUCTURE RECOMMENDATIONS
${report.vehicleStructureRecommendations}

### SUSTAINABILITY RECOMMENDATIONS
${report.sustainabilityRecommendations}

### PROFESSIONAL DESIGN DESCRIPTION
${report.professionalDesignDescription}

---
Generated with AutoMuse AI Studio (https://ai.studio/build)
`;
    handleCopyText(fullMarkdown, "full");
  };

  const handleDownloadReport = () => {
    const fullMarkdown = `
# AUTOMUSE AI CONCEPT REPORT: ${report.vehicleName}
Target Year: ${input.year} | Style: ${input.designStyle} | Brand Inspiration: ${input.brandInspiration}
Target Audience: ${input.targetAudience} | Market: ${input.countryMarket}

---
### DESIGN PHILOSOPHY
"${report.designPhilosophy}"

### VEHICLE CONCEPT SUMMARY
${report.vehicleConceptSummary}
${
  report.signatureWowFeature
    ? `
### SIGNATURE FUTURISTIC FEATURE
- Feature: ${report.signatureWowFeature.title} (${report.signatureWowFeature.category})
- Description: ${report.signatureWowFeature.description}
- Impact: ${report.signatureWowFeature.impact}
`
    : ""
}
### DESIGN DNA
${report.designDna?.map((d) => `- ${d.attribute}: ${d.percentage}%`).join("\n")}

### KEY SPECIFICATIONS
- Top Speed: ${formatTopSpeed(report.keySpecs.topSpeed)}
- Range: ${formatRange(report.keySpecs.range)}
- Output: ${report.keySpecs.estimatedHp}
- 0-60 MPH: ${report.keySpecs.zeroToSixty || "1.75s"}
- Drag Coefficient: ${report.keySpecs.dragCoefficient}
- Powertrain: ${report.keySpecs.powertrainType}
- Autonomy: ${report.keySpecs.autonomyLevel}

### DESIGN LANGUAGE
${report.designLanguage}

### EXTERIOR STYLING SUGGESTIONS
${report.exteriorStylingSuggestions}

### INTERIOR STYLING SUGGESTIONS
${report.interiorStylingSuggestions}

### COLOR PALETTE SUGGESTIONS
${report.colorPaletteSuggestions.map((c) => `- ${c.name} (${c.hex}): ${c.usage}`).join("\n")}

### NEXT-GEN MATERIALS
${report.materialsList?.map((m) => `- ${m.name} (${m.category}): ${m.description}`).join("\n")}

### AERODYNAMICS SUGGESTIONS
${report.aerodynamicsSuggestions}

### VEHICLE STRUCTURE RECOMMENDATIONS
${report.vehicleStructureRecommendations}

### SUSTAINABILITY RECOMMENDATIONS
${report.sustainabilityRecommendations}

### PROFESSIONAL DESIGN DESCRIPTION
${report.professionalDesignDescription}
`;
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
      {/* 1. Primary Header Banner & Actions */}
      <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#28382d]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center justify-center text-center gap-5 relative z-10 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#233026] text-emerald-300 border border-[#384d3d] shadow-sm">
                Year {report.keySpecs?.yearOfProduction || input.year}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-900/90 text-zinc-300 border border-zinc-800">
                {input.brandInspiration} Heritage
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-900/90 text-zinc-300 border border-zinc-800">
                {input.designStyle}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-900/90 text-zinc-300 border border-zinc-800">
                {input.countryMarket}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight font-serif uppercase mt-1 text-center drop-shadow-[0_0_16px_rgba(16,185,129,0.3)]">
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-900/90 to-teal-900/90 hover:from-emerald-800 hover:to-teal-800 text-emerald-100 border border-emerald-600/80 hover:border-emerald-500 shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              title="Forget current concept and generate an alternate universe mobility vision"
            >
              <Shuffle className={`w-4 h-4 text-emerald-300 ${isRespining ? "animate-spin" : ""}`} />
              <span>{isRespining ? "Synthesizing Alternate Universe..." : "Respin (New Concept)"}</span>
            </button>

            <button
              onClick={() => onSaveConcept()}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
                isSaved
                  ? "bg-[#253328] text-emerald-200 border-[#3e5443]"
                  : "bg-zinc-900/90 text-zinc-200 hover:text-white border-zinc-700/80 hover:border-zinc-600"
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4 text-zinc-400" />}
              <span>{isSaved ? "Saved in My Garage" : "Save to My Garage"}</span>
            </button>

            <button
              onClick={handleCopyFullReport}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 transition-all shadow-sm"
            >
              {copiedSection === "full" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              <span>{copiedSection === "full" ? "Copied!" : "Copy Report"}</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-semibold bg-[#2a382e] hover:bg-[#34473a] text-emerald-100 border border-[#405748] transition-all shadow-md"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Export Portfolio (.md)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Signature Wow Feature Highlight Banner */}
      {report.signatureWowFeature && (
        <div className="bg-gradient-to-r from-[#17261d] via-[#1a2e22] to-[#121c16] border border-[#2e4736] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                  Signature Futuristic Feature
                </span>
                {report.signatureWowFeature.category && (
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
                    {report.signatureWowFeature.category}
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-emerald-100 tracking-wide">
                {report.signatureWowFeature.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                {report.signatureWowFeature.description}
              </p>
            </div>
            {report.signatureWowFeature.impact && (
              <div className="bg-[#101c14] border border-[#283e2f] p-3.5 rounded-xl shrink-0 w-full md:w-64 space-y-1">
                <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Engineering Impact
                </span>
                <p className="text-xs text-zinc-300 font-mono leading-snug">
                  {report.signatureWowFeature.impact}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Fun Speculative Stats Dashboard */}
      {report.keySpecs && (
        <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Gauge className="w-4 h-4 text-emerald-400" />
              Speculative Performance Metrics
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">Studio Estimates</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800/80 hover:border-emerald-800/60 transition-all">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Top Speed</span>
              <span className="text-sm font-bold font-mono text-emerald-300">{formatTopSpeed(report.keySpecs.topSpeed)}</span>
            </div>

            <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800/80 hover:border-emerald-800/60 transition-all">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Max Range</span>
              <span className="text-sm font-bold font-mono text-zinc-100">{formatRange(report.keySpecs.range)}</span>
            </div>

            <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800/80 hover:border-emerald-800/60 transition-all">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Power Output</span>
              <span className="text-sm font-bold font-mono text-zinc-100">{report.keySpecs.estimatedHp}</span>
            </div>

            <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800/80 hover:border-emerald-800/60 transition-all">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">0-60 MPH</span>
              <span className="text-sm font-bold font-mono text-zinc-100">{report.keySpecs.zeroToSixty}</span>
            </div>

            <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800/80 hover:border-emerald-800/60 transition-all">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Drag Coeff</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{report.keySpecs.dragCoefficient}</span>
            </div>

            <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800/80 hover:border-emerald-800/60 transition-all">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Capacity</span>
              <span className="text-xs font-semibold text-zinc-200 truncate block">{report.keySpecs.passengers || "4 Passengers"}</span>
            </div>

            <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800/80 hover:border-emerald-800/60 transition-all">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Autonomy Level</span>
              <span className="text-xs font-semibold text-emerald-300 truncate block">{report.keySpecs.autonomyLevel || "Level 6"}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Design DNA & Size Comparison Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Design DNA Breakdown Progress Bars */}
        {report.designDna && report.designDna.length > 0 && (
          <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Design DNA Influence Mix
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">100% Total Styling</span>
            </div>

            <div className="space-y-3.5">
              {(report.designDna || []).map((item, idx) => ( 
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
                    <span>{item.attribute}</span>
                    <span className="font-mono text-emerald-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vehicle Size & Scale Comparison */}
        {report.sizeComparison && (
          <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                <Ruler className="w-4 h-4 text-emerald-400" />
                Vehicle Size & Scale Benchmark
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">Proportional Scale</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Overall Length</span>
                <span className="text-sm font-bold text-zinc-100 font-mono">{report.sizeComparison.lengthMeters}</span>
              </div>
              <div className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800 col-span-2">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Scale Benchmark</span>
                <span className="text-xs font-bold text-emerald-300 font-sans block leading-snug break-words">{report.sizeComparison.comparedTo}</span>
              </div>
            </div>

            <div className="p-3 bg-[#121214] border border-zinc-800/80 rounded-xl text-xs text-zinc-300 font-light flex items-center gap-2">
              <Users2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cabin Volume: <strong className="text-zinc-100">{report.sizeComparison.cabinCapacity}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Minimalist Aerodynamic Vector Stage (NO VEHICLE DRAWING OR SECONDARY RENDER) */}
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

      {/* 6. Next-Gen Materials Section */}
      {report.materialsList && report.materialsList.length > 0 && (
        <div className="bg-[#18181a] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-emerald-400" />
              Next-Gen Sustainable Materials Composition
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">Bio-Composites</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(report.materialsList || []).map((mat, idx) => (
              <div
                key={idx}
                className="bg-[#121214] p-4 rounded-xl border border-zinc-800/90 hover:border-emerald-800/60 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-[#1a281e] px-2 py-0.5 rounded border border-[#2f4a38]">
                    {mat.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-zinc-100 font-serif tracking-wide group-hover:text-emerald-300 transition-colors">
                  {mat.name}
                </h4>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {mat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Comprehensive Detailed Report Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Concept Summary */}
        <div className="bg-[#18181a] border border-zinc-800 rounded-xl p-6 shadow-xl space-y-3 relative group">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6c8c73]" />
              1. Vehicle Concept Summary
            </h3>
            <button
              onClick={() => handleCopyText(report.vehicleConceptSummary, "summary")}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            >
              {copiedSection === "summary" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-zinc-200 text-sm leading-relaxed font-light">
            {report.vehicleConceptSummary}
          </p>
        </div>

        {/* Design Language */}
        <div className="bg-[#18181a] border border-zinc-800 rounded-xl p-6 shadow-xl space-y-3 relative group">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#6c8c73]" />
              2. Design Language
            </h3>
            <button
              onClick={() => handleCopyText(report.designLanguage, "lang")}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            >
              {copiedSection === "lang" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-zinc-200 text-sm leading-relaxed font-light">
            {report.designLanguage}
          </p>
        </div>

        {/* Exterior Styling */}
        <div className="bg-[#18181a] border border-zinc-800 rounded-xl p-6 shadow-xl space-y-3 relative group">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Car className="w-4 h-4 text-[#6c8c73]" />
              3. Exterior Styling Suggestions
            </h3>
            <button
              onClick={() => handleCopyText(report.exteriorStylingSuggestions, "ext")}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            >
              {copiedSection === "ext" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-zinc-200 text-sm leading-relaxed font-light whitespace-pre-line">
            {report.exteriorStylingSuggestions}
          </p>
        </div>

        {/* Interior Styling */}
        <div className="bg-[#18181a] border border-zinc-800 rounded-xl p-6 shadow-xl space-y-3 relative group">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6c8c73]" />
              4. Interior Styling Suggestions
            </h3>
            <button
              onClick={() => handleCopyText(report.interiorStylingSuggestions, "int")}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            >
              {copiedSection === "int" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-zinc-200 text-sm leading-relaxed font-light whitespace-pre-line">
            {report.interiorStylingSuggestions}
          </p>
        </div>

        {/* Color Palette Swatches */}
        <div className="bg-[#18181a] border border-zinc-800 rounded-xl p-6 shadow-xl space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#6c8c73]" />
              5. Color Palette Suggestions
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">Curated Swatches</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(report.colorPaletteSuggestions || []).map((color, idx) => (
              <div
                key={idx}
                className="bg-[#121214] p-3.5 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-white/20 shadow-lg flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-zinc-200 truncate">{color.name}</h4>
                    <span className="text-[11px] font-mono text-zinc-400 block">{color.hex}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 font-light border-t border-zinc-800/80 pt-2">
                  <span className="text-[10px] uppercase font-mono text-zinc-500 block">Application</span>
                  {color.usage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Materials Overview */}
        <div className="bg-[#18181a] border border-zinc-800 rounded-xl p-6 shadow-xl space-y-3 relative group">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6c8c73]" />
              6. Materials Recommendations
            </h3>
            <button
              onClick={() => handleCopyText(report.materialsRecommendations, "mat")}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            >
              {copiedSection === "mat" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-zinc-200 text-sm leading-relaxed font-light">
            {report.materialsRecommendations}
          </p>
        </div>

        {/* Aerodynamics */}
        <div className="bg-[#18181a] border border-zinc-800 rounded-xl p-6 shadow-xl space-y-3 relative group">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#6c8c73]" />
              7. Aerodynamics Suggestions
            </h3>
            <button
              onClick={() => handleCopyText(report.aerodynamicsSuggestions, "aero")}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            >
              {copiedSection === "aero" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-zinc-200 text-sm leading-relaxed font-light">
            {report.aerodynamicsSuggestions}
          </p>
        </div>

        {/* Structure */}
        <div className="bg-[#18181a] border border-zinc-800 rounded-xl p-6 shadow-xl space-y-3 relative group">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#6c8c73]" />
              8. Vehicle Structure Recommendations
            </h3>
            <button
              onClick={() => handleCopyText(report.vehicleStructureRecommendations, "struct")}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            >
              {copiedSection === "struct" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-zinc-200 text-sm leading-relaxed font-light">
            {report.vehicleStructureRecommendations}
          </p>
        </div>

        {/* Sustainability */}
        <div className="bg-[#18181a] border border-zinc-800 rounded-xl p-6 shadow-xl space-y-3 relative group">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#6c8c73]" />
              9. Sustainability Recommendations
            </h3>
            <button
              onClick={() => handleCopyText(report.sustainabilityRecommendations, "sust")}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
            >
              {copiedSection === "sust" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-zinc-200 text-sm leading-relaxed font-light">
            {report.sustainabilityRecommendations}
          </p>
        </div>

        {/* Professional Design Description */}
        <div className="bg-[#18181a] border border-zinc-800 rounded-xl p-6 shadow-xl space-y-3 md:col-span-2 relative group">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6c8c73]" />
              10. Professional Design Description
            </h3>
            <button
              onClick={() => handleCopyText(report.professionalDesignDescription, "prof")}
              className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 flex items-center gap-1 text-xs"
            >
              {copiedSection === "prof" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Description</span>
            </button>
          </div>
          <p className="text-zinc-100 text-sm leading-relaxed font-light whitespace-pre-line bg-[#121214] p-4 rounded-lg border border-zinc-800/80 font-serif">
            {report.professionalDesignDescription}
          </p>
        </div>
      </div>
    </div>
  );
};
