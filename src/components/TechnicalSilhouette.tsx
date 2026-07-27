import React, { useMemo, useState } from "react";
import { Wind, Filter } from "lucide-react";
import { AeroStreamlineItem } from "../types";

interface TechnicalSilhouetteProps {
  vehicleType: string;
  vehicleName: string;
  dragCoefficient?: string;
  estimatedHp?: string;
  customPrompt?: string;
  aeroStreamlines?: AeroStreamlineItem[];
}

interface AeroStreamline {
  id: string;
  title: string;
  category: "laminar" | "downforce" | "cooling" | "underbody" | "wake" | "lift";
  path: string;
  hotspot: { x: number; y: number };
  label: string;
  value: string;
  detail: string;
  glowColor: string;
  gradientId: string;
  strokeWidth: number;
  dashArray?: string;
}

export const TechnicalSilhouette: React.FC<TechnicalSilhouetteProps> = ({
  vehicleType,
  vehicleName,
  dragCoefficient = "Cd 0.18",
  estimatedHp = "1,450 HP",
  customPrompt = "",
  aeroStreamlines = [],
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedStreamId, setSelectedStreamId] = useState<string | null>(null);

  const streamlines: AeroStreamline[] = useMemo(() => {
    if (Array.isArray(aeroStreamlines) && aeroStreamlines.length > 0) {
      return (Array.isArray(aeroStreamlines) ? aeroStreamlines : []).map((item, idx) => ({
        id: item.id || `stream-${idx}`,
        title: item.title || item.label || "Aerodynamic Streamline",
        category: item.category || "laminar",
        path: item.path || "M 40,260 C 160,220 280,150 440,130 C 620,110 740,170 950,220",
        hotspot: item.hotspot || { x: 30 + idx * 12, y: 30 + (idx % 3) * 15 },
        label: item.label || "Aero Stream",
        value: item.value || dragCoefficient,
        detail: item.detail || "Curved boundary layer airflow following the unique vehicle surface geometry.",
        glowColor: item.glowColor || ["#10b981", "#06b6d4", "#38bdf8", "#f59e0b", "#a855f7"][idx % 5],
        gradientId: `grad-ai-${idx}`,
        strokeWidth: item.strokeWidth || 3.5,
        dashArray: item.dashArray,
      }));
    }

    return [
      {
        id: "hood-canopy-sweep",
        title: "Hood & Canopy Boundary Streamline",
        category: "laminar",
        path: "M 40,260 C 160,220 280,150 440,130 C 620,110 740,170 950,220",
        hotspot: { x: 32, y: 35 },
        label: "Laminar Canopy Sweep",
        value: dragCoefficient,
        detail: "Continuous single-stroke airflow hugging the glass canopy.",
        glowColor: "#10b981",
        gradientId: "grad-emerald",
        strokeWidth: 4,
      },
      {
        id: "underbody-venturi-tunnel",
        title: "Ground-Effect Venturi Stream",
        category: "underbody",
        path: "M 70,300 C 250,295 550,295 800,290 C 860,285 910,260 960,250",
        hotspot: { x: 48, y: 78 },
        label: "Venturi Downforce Tunnel",
        value: "520 kg Downforce",
        detail: "Underbody ground-effect suction tunnel accelerating air.",
        glowColor: "#38bdf8",
        gradientId: "grad-blue",
        strokeWidth: 4,
      },
    ];
  }, [aeroStreamlines, dragCoefficient]);

  const activeStream = useMemo(() => {
    return streamlines.find((s) => s.id === selectedStreamId) || streamlines[0];
  }, [selectedStreamId, streamlines]);

  const filteredStreamlines = useMemo(() => {
    if (activeCategory === "all") return streamlines;
    return streamlines.filter((s) => s.category === activeCategory);
  }, [activeCategory, streamlines]);

  return (
    <div className="bg-[#121214] border border-zinc-800/90 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1b271f] border border-[#324a3a] text-[#7ca887] text-[10px] font-mono tracking-wider uppercase mb-1">
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
            <span>Wind Tunnel Streamline Simulation</span>
          </div>
          <h3 className="text-base sm:text-xl font-bold text-zinc-100 font-serif uppercase tracking-wider flex items-center gap-2">
            <span>{vehicleName}</span>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950/90 border border-emerald-700/60 px-2.5 py-0.5 rounded-md">
              {dragCoefficient}
            </span>
          </h3>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1 shrink-0">
          <Filter className="w-3 h-3 text-zinc-400" /> Flow Layers:
        </span>
        {["all", "laminar", "downforce", "cooling", "underbody", "wake"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[11px] font-mono px-3 py-1 rounded-lg border uppercase transition-all ${
              activeCategory === cat ? "bg-[#213326] text-emerald-200 border-[#38523f]" : "bg-[#161618] text-zinc-400 border-zinc-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-64 sm:h-72 bg-[#0a0a0c] border border-zinc-800/90 rounded-xl overflow-hidden p-4 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#1c2c22_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet">
          <defs>
            {streamlines.map((stream) => (
              <linearGradient key={stream.id} id={stream.gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={stream.glowColor} stopOpacity="0.2" />
                <stop offset="100%" stopColor={stream.glowColor} stopOpacity="0.9" />
              </linearGradient>
            ))}
          </defs>

          {filteredStreamlines.map((stream) => (
            <path
              key={stream.id}
              d={stream.path}
              fill="none"
              stroke={`url(#${stream.gradientId})`}
              strokeWidth={stream.strokeWidth}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              onClick={() => setSelectedStreamId(stream.id)}
            />
          ))}
        </svg>
      </div>

      {/* Active Stream Spec Box */}
      <div className="bg-[#121215] border border-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Wind className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="text-sm font-bold text-zinc-100 font-serif uppercase">{activeStream.title}</h4>
            <p className="text-xs text-zinc-300 font-light">{activeStream.detail}</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded border border-emerald-800">
          {activeStream.value}
        </span>
      </div>
    </div>
  );
};
