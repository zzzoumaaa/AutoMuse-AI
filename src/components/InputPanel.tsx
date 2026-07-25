import React, { useState } from "react";
import { ConceptInput } from "../types";
import { inferConceptFromPrompt } from "../lib/promptInference";
import {
  Car,
  Calendar,
  Sparkles,
  Palette,
  Globe,
  Users,
  Building2,
  Wand2,
  RotateCcw,
  PenTool,
  Lightbulb,
  X,
  Shuffle,
} from "lucide-react";

interface InputPanelProps {
  input: ConceptInput;
  onChange: (input: ConceptInput) => void;
  onGenerate: () => void;
  onRespin?: () => void;
  onResetStudio?: () => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  "A cyberpunk food truck from 2080 with automated drone delivery",
  "A Porsche hypercar designed for high-speed transit on Mars",
  "An underwater exploration limousine with transparent pressure hull",
  "Batman's stealth daily commute vehicle with active stealth aero",
  "A zero-emission solar-powered luxury shooting brake for Nordic snow tracks",
];

const VEHICLE_TYPES = [
  "Hypercar",
  "Gran Turismo",
  "Autonomous Lounge",
  "Off-Road Rover",
  "Urban eVTOL Ground Hybrid",
  "Track Speedster",
  "Luxury Shooting Brake",
  "Electric Monocoque SUV",
  "Compact Urban Pod",
];

const YEARS = [
  "2030",
  "2035",
  "2040",
  "2045",
  "2050",
  "2055",
  "2060",
  "2065",
  "2070",
  "2075",
  "2080",
  "2085",
  "2090",
  "2100",
];

const DESIGN_STYLES = [
  "Cyberpunk",
  "Luxury / Grand Touring",
  "Retro-Futurism",
  "Parametric / Bio-Organic",
  "Minimalist Brutalism",
  "Aerodynamic Streamline",
  "Kinetic Sculpture",
  "Sci-Fi Industrial",
];

const BRANDS = [
  "Porsche",
  "Bugatti",
  "Lotus",
  "Aston Martin",
  "Rimac",
  "Genesis",
  "Koenigsegg",
  "Lamborghini",
  "Ferrari",
  "Lucid Motors",
  "Custom Atelier",
];

const AUDIENCES = [
  "Young Professionals",
  "High-Net-Worth Collectors",
  "Next-Gen Commuters",
  "Track Enthusiasts",
  "Eco-Luxury Nomads",
  "Autonomous Fleet Passengers",
];

const MARKETS = [
  "Italy",
  "Germany",
  "Japan",
  "United States",
  "Nordic / Sweden",
  "UAE & Middle East",
  "Global Metropolises",
  "Singapore",
];

export const InputPanel: React.FC<InputPanelProps> = ({
  input,
  onChange,
  onGenerate,
  onRespin,
  onResetStudio,
  isLoading,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const normalizeFieldValue = (field: keyof ConceptInput, val: string): string => {
    if (!val) return "";
    const lower = val.toLowerCase().trim();

    if (field === "designStyle") {
      const exact = DESIGN_STYLES.find((ds) => ds.toLowerCase() === lower);
      if (exact) return exact;

      if (lower.includes("cyber")) return "Cyberpunk";
      if (lower.includes("lux")) return "Luxury / Grand Touring";
      if (lower.includes("retro") || lower.includes("vintage") || lower.includes("space age")) return "Retro-Futurism";
      if (lower.includes("para") || lower.includes("bio") || lower.includes("organic")) return "Parametric / Bio-Organic";
      if (lower.includes("min") || lower.includes("brut")) return "Minimalist Brutalism";
      if (lower.includes("aero") || lower.includes("stream")) return "Aerodynamic Streamline";
      if (lower.includes("kin") || lower.includes("sculp")) return "Kinetic Sculpture";
      if (lower.includes("sci") || lower.includes("futur") || lower.includes("indus")) return "Sci-Fi Industrial";

      const partial = DESIGN_STYLES.find((ds) => ds.toLowerCase().includes(lower) || lower.includes(ds.toLowerCase()));
      if (partial) return partial;
    }

    if (field === "targetAudience") {
      const exact = AUDIENCES.find((a) => a.toLowerCase() === lower);
      if (exact) return exact;

      if (lower.includes("collect")) return "High-Net-Worth Collectors";
      if (lower.includes("young") || lower.includes("prof")) return "Young Professionals";
      if (lower.includes("next") || lower.includes("commut")) return "Next-Gen Commuters";
      if (lower.includes("track") || lower.includes("race")) return "Track Enthusiasts";
      if (lower.includes("eco") || lower.includes("nomad")) return "Eco-Luxury Nomads";
      if (lower.includes("auton") || lower.includes("fleet") || lower.includes("passenger")) return "Autonomous Fleet Passengers";

      const partial = AUDIENCES.find((a) => a.toLowerCase().includes(lower) || lower.includes(a.toLowerCase()));
      if (partial) return partial;
    }

    if (field === "vehicleType") {
      const exact = VEHICLE_TYPES.find((v) => v.toLowerCase() === lower);
      if (exact) return exact;

      const partial = VEHICLE_TYPES.find((v) => v.toLowerCase().includes(lower) || lower.includes(v.toLowerCase()));
      if (partial) return partial;
    }

    if (field === "brandInspiration") {
      const exact = BRANDS.find((b) => b.toLowerCase() === lower);
      if (exact) return exact;

      const partial = BRANDS.find((b) => b.toLowerCase().includes(lower) || lower.includes(b.toLowerCase()));
      if (partial) return partial;
    }

    if (field === "countryMarket") {
      const exact = MARKETS.find((m) => m.toLowerCase() === lower);
      if (exact) return exact;

      const partial = MARKETS.find((m) => m.toLowerCase().includes(lower) || lower.includes(m.toLowerCase()));
      if (partial) return partial;
    }

    return val;
  };

  const handleFieldChange = (field: keyof ConceptInput, rawValue: string) => {
    const value = normalizeFieldValue(field, rawValue);
    onChange({
      ...input,
      [field]: value,
    });
  };

  // Automatically infer parameters from custom prompt using semantic inference
  const handleCustomPromptChange = (val: string) => {
    const inferred = inferConceptFromPrompt(val, input);
    onChange({
      ...input,
      ...inferred,
      customPrompt: val,
    });
  };

  const handleReset = () => {
    onChange({
      vehicleType: "",
      year: "",
      designStyle: "",
      brandInspiration: "",
      targetAudience: "",
      countryMarket: "",
      customPrompt: "",
    });
    if (onResetStudio) {
      onResetStudio();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#18181a] border border-zinc-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative background grid and accent glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2d3b32]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto mb-8 flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1a241d] border border-[#2e3e33] text-[#7ca887] text-xs font-mono tracking-wider mb-3.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>STUDIO CONCEPT SPECIFICATION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-normal font-serif uppercase max-w-2xl text-center leading-tight drop-shadow-[0_0_16px_rgba(16,185,129,0.35)]">
          Design Your Dream Vehicle
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2.5 font-light leading-relaxed text-center max-w-lg">
          Describe any concept vehicle you imagine or choose studio preset vectors to generate a complete portfolio report.
        </p>
      </div>

      {/* Friendly Welcome Card for Students & Young Designers - Perfectly Centered */}
      <div className="mb-8 max-w-2xl mx-auto bg-gradient-to-r from-[#1c2920] via-[#1a221d] to-[#151a1e] border border-[#3e5a47]/50 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-4">
        <div className="w-10 h-10 rounded-full bg-[#273d2f] border border-[#486b53] flex items-center justify-center shrink-0 shadow-inner">
          <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col items-center sm:items-start">
          <h3 className="text-sm font-bold text-emerald-200 flex items-center gap-1.5 font-sans justify-center sm:justify-start">
            Welcome, Future Designer! 👋
          </h3>
          <p className="text-xs text-zinc-300 font-light mt-0.5 leading-relaxed">
            Your next great vehicle starts with an idea. Type your vision below or pick a starter prompt—no idea is too wild!
          </p>
        </div>
        <span className="shrink-0 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-[#162b1e] border border-[#2f543a] px-3 py-1 rounded-full shadow-sm">
          ✨ Student & Studio Friendly
        </span>
      </div>

      {/* Primary Custom Prompt Input Box */}
      <div className="mb-8 relative z-10 max-w-4xl mx-auto">
        <div className="bg-[#111113] border border-emerald-900/40 hover:border-emerald-700/60 focus-within:border-emerald-500 rounded-xl p-4 shadow-2xl transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 mb-3">
            <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2 font-mono">
              <PenTool className="w-4 h-4 text-emerald-400" />
              Custom Vision Prompt
            </label>
            <div className="flex items-center gap-2">
              {input.customPrompt ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                  <Sparkles className="w-3 h-3" /> Custom Prompt Active
                </span>
              ) : (
                <span className="text-[10px] font-mono text-zinc-500">
                  Describe any idea • AI interprets on Generate
                </span>
              )}
              {input.customPrompt && (
                <button
                  onClick={() => handleCustomPromptChange("")}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5"
                  title="Clear custom prompt"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <textarea
            value={input.customPrompt || ""}
            onChange={(e) => handleCustomPromptChange(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                onGenerate();
              }
            }}
            placeholder="Describe your dream vehicle... e.g. Design a futuristic amphibious rescue vehicle for 2080, or create an AI-powered autonomous Porsche-inspired hypercar with active morphing aerofoils."
            rows={3}
            className="w-full bg-[#131915]/50 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-y leading-relaxed font-sans p-3 rounded-lg border border-emerald-950/80 focus:border-amber-500/80 focus:bg-[#1a1813]/80 selection:bg-amber-400 selection:text-black transition-all shadow-inner"
          />

          {/* Quick Click Sample Prompts & Direct Prompt Generate Button */}
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 overflow-hidden w-full md:w-auto">
              <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1 shrink-0">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Starters:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-amber-900/40 scrollbar-track-zinc-900/40">
                {SAMPLE_PROMPTS.map((promptText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCustomPromptChange(promptText)}
                    className={`shrink-0 text-[11px] px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap max-w-[260px] sm:max-w-xs truncate ${
                      input.customPrompt === promptText
                        ? "bg-[#382b14] text-amber-200 border-amber-500/80 font-semibold shadow-md shadow-amber-950/60"
                        : "bg-[#18181c] text-zinc-300 border-zinc-800/90 hover:text-amber-200 hover:border-amber-500/60 hover:bg-[#211a12]"
                    }`}
                    title={promptText}
                  >
                    "{promptText}"
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Generate Button inside Prompt Box */}
            <button
              type="button"
              onClick={() => onGenerate()}
              disabled={isLoading}
              className={`w-full md:w-auto px-5 py-2.5 min-h-[44px] rounded-lg font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 border shadow-lg shrink-0 ${
                isLoading
                  ? "bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/40 shadow-emerald-950/50 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                  <span>Generate from Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
        {/* 1. Vehicle Type */}
        <div className="space-y-2 bg-[#121214] p-4 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Car className="w-4 h-4 text-[#6c8c73]" />
              Vehicle Type
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Archetype</span>
          </label>
          <select
            value={input.vehicleType}
            onChange={(e) => handleFieldChange("vehicleType", e.target.value)}
            className="w-full bg-[#1c1c1e] border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-[#526e5a] transition-all cursor-pointer"
          >
            <option value="" disabled hidden>Select Vehicle Type...</option>
            {VEHICLE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {VEHICLE_TYPES.slice(0, 4).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleFieldChange("vehicleType", t)}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                  input.vehicleType === t
                    ? "bg-[#253328] text-emerald-200 border-[#3d5242]"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Target Year */}
        <div className="space-y-2 bg-[#121214] p-4 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#6c8c73]" />
              Concept Year
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Timeline</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input.year}
              onChange={(e) => handleFieldChange("year", e.target.value)}
              placeholder="e.g. 2075"
              className="w-full bg-[#1c1c1e] border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-[#526e5a] transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => handleFieldChange("year", y)}
                className={`text-[11px] px-2.5 py-0.5 rounded-md border transition-all font-mono ${
                  input.year === y
                    ? "bg-[#253328] text-emerald-200 border-[#3d5242]"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Design Style */}
        <div className="space-y-2 bg-[#121214] p-4 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#6c8c73]" />
              Design Style
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Aesthetic</span>
          </label>
          <select
            value={input.designStyle}
            onChange={(e) => handleFieldChange("designStyle", e.target.value)}
            className="w-full bg-[#1c1c1e] border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-[#526e5a] transition-all cursor-pointer"
          >
            <option value="" disabled hidden>Select Design Style...</option>
            {DESIGN_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { full: "Cyberpunk", label: "Cyberpunk" },
              { full: "Luxury / Grand Touring", label: "Luxury" },
              { full: "Retro-Futurism", label: "Retro-Futurism" },
              { full: "Minimalist Brutalism", label: "Minimalist" },
              { full: "Sci-Fi Industrial", label: "Sci-Fi Industrial" },
            ].map(({ full, label }) => (
              <button
                key={full}
                type="button"
                onClick={() => handleFieldChange("designStyle", full)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                  input.designStyle === full
                    ? "bg-[#253328] text-emerald-200 border-[#3d5242] font-semibold shadow-sm"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                }`}
                title={full}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Brand Inspiration */}
        <div className="space-y-2 bg-[#121214] p-4 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#6c8c73]" />
              Brand Inspiration
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Heritage</span>
          </label>
          <select
            value={input.brandInspiration}
            onChange={(e) => handleFieldChange("brandInspiration", e.target.value)}
            className="w-full bg-[#1c1c1e] border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-[#526e5a] transition-all cursor-pointer"
          >
            <option value="" disabled hidden>Select Brand Inspiration...</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["Porsche", "Bugatti", "Lotus", "Aston Martin"].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => handleFieldChange("brandInspiration", b)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                  input.brandInspiration === b
                    ? "bg-[#253328] text-emerald-200 border-[#3d5242] font-semibold shadow-sm"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Target Audience */}
        <div className="space-y-2 bg-[#121214] p-4 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#6c8c73]" />
              Target Audience
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Demographic</span>
          </label>
          <select
            value={input.targetAudience}
            onChange={(e) => handleFieldChange("targetAudience", e.target.value)}
            className="w-full bg-[#1c1c1e] border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-[#526e5a] transition-all cursor-pointer"
          >
            <option value="" disabled hidden>Select Target Audience...</option>
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { full: "Young Professionals", label: "Young Professionals" },
              { full: "High-Net-Worth Collectors", label: "Collectors" },
              { full: "Track Enthusiasts", label: "Track Enthusiasts" },
              { full: "Next-Gen Commuters", label: "Commuters" },
            ].map(({ full, label }) => (
              <button
                key={full}
                type="button"
                onClick={() => handleFieldChange("targetAudience", full)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                  input.targetAudience === full
                    ? "bg-[#253328] text-emerald-200 border-[#3d5242] font-semibold shadow-sm"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                }`}
                title={full}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Country or Market */}
        <div className="space-y-2 bg-[#121214] p-4 rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 transition-all">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#6c8c73]" />
              Country or Market
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Region</span>
          </label>
          <select
            value={input.countryMarket}
            onChange={(e) => handleFieldChange("countryMarket", e.target.value)}
            className="w-full bg-[#1c1c1e] border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-[#526e5a] transition-all cursor-pointer"
          >
            <option value="" disabled hidden>Select Country or Market...</option>
            {MARKETS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["Italy", "Germany", "Japan", "UAE & Middle East"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleFieldChange("countryMarket", m)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                  input.countryMarket === m
                    ? "bg-[#253328] text-emerald-200 border-[#3d5242] font-semibold shadow-sm"
                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control Buttons Footer - Perfectly Centered */}
      <div className="mt-10 flex flex-col items-center justify-center gap-5 pt-8 border-t border-zinc-800/80 text-center">
        {/* Large Prominent Centered Generate & Respin Buttons */}
        <div className="w-full max-w-xl flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onGenerate()}
            disabled={isLoading}
            className={`flex-1 w-full sm:w-auto px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-3 border shadow-2xl ${
              isLoading
                ? "bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed"
                : "bg-gradient-to-r from-[#243829] via-[#334d3a] to-[#243829] hover:from-[#2e4734] hover:to-[#38563f] text-emerald-100 border-[#4d6f55] hover:border-[#638f6d] shadow-emerald-950/60 hover:shadow-emerald-900/80 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Synthesizing Concept...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-emerald-300 animate-pulse" />
                <span>Generate Concept Report</span>
              </>
            )}
          </button>

          {onRespin && (
            <button
              type="button"
              onClick={() => onRespin()}
              disabled={isLoading}
              className={`w-full sm:w-auto px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2.5 border shadow-xl ${
                isLoading
                  ? "bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed"
                  : "bg-[#18261c] hover:bg-[#203326] text-emerald-200 border-[#385441] hover:border-emerald-500 shadow-emerald-950/40 hover:scale-[1.02] active:scale-[0.98]"
              }`}
              title="Forget current concept and generate a fresh alternate universe mobility vision"
            >
              <Shuffle className={`w-4 h-4 text-emerald-400 ${isLoading ? "animate-spin" : ""}`} />
              <span>Respin Concept</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-zinc-400">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-zinc-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <span className="hidden sm:inline text-zinc-700">•</span>

          <div className="text-xs text-zinc-500 font-mono">
            Studio AI Model: Gemini 3.6 Flash
          </div>
        </div>
      </div>
    </section>
  );
};
