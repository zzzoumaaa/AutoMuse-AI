import React, { useMemo, useState } from "react";
import { Wind, Filter, Sparkles, Activity, Layers, Flame } from "lucide-react";
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
  path: string; // SVG bezier curve path string
  hotspot: { x: number; y: number }; // percentage position for badge
  label: string;
  value: string;
  detail: string;
  glowColor: string; // hex or color
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

  // Determine vehicle archetype for tailored fallback silhouette & streamline paths
  const archetype = useMemo(() => {
    const type = (vehicleType || "").toLowerCase();
    const prompt = (customPrompt || "").toLowerCase();

    if (type.includes("vtol") || prompt.includes("vtol") || prompt.includes("flying") || prompt.includes("drone")) {
      return "vtol";
    }
    if (type.includes("suv") || type.includes("rover") || prompt.includes("truck") || prompt.includes("offroad")) {
      return "suv";
    }
    if (prompt.includes("underwater") || prompt.includes("submarine") || prompt.includes("ocean")) {
      return "ocean";
    }
    if (prompt.includes("cyberpunk") || prompt.includes("food truck") || prompt.includes("pod")) {
      return "cyber";
    }
    return "hypercar"; // default luxury hypercar / GT
  }, [vehicleType, customPrompt]);

  // Streamlines: Prefer AI-provided aeroStreamlines prop; fallback to dynamic procedural generation
  const streamlines: AeroStreamline[] = useMemo(() => {
    if (aeroStreamlines && aeroStreamlines.length > 0) {
      return aeroStreamlines.map((item, idx) => ({
        id: item.id || `stream-${idx}`,
        title: item.title || item.label || "Aerodynamic Streamline",
        category: item.category || "laminar",
        path: item.path || "M 40,260 C 160,220 280,150 440,130 C 620,110 740,170 950,220",
        hotspot: item.hotspot || { x: 30 + idx * 12, y: 30 + (idx % 3) * 15 },
        label: item.label || "Aero Stream",
        value: item.value || dragCoefficient,
        detail: item.detail || "Curved boundary layer airflow following the unique vehicle surface geometry.",
        glowColor: item.glowColor || ["#10b981", "#06b6d4", "#38bdf8", "#f59e0b", "#a855f7"][idx % 5],
        gradientId: `grad-ai-${idx}-${(item.glowColor || "").replace("#", "")}`,
        strokeWidth: item.strokeWidth || 3.5,
        dashArray: item.dashArray,
      }));
    }

    if (archetype === "vtol") {
      return [
        {
          id: "canopy-flow",
          title: "Upper Canopy Laminar Layer",
          category: "laminar",
          path: "M 80,190 C 200,120 400,110 580,150 C 680,175 800,200 920,210",
          hotspot: { x: 38, y: 32 },
          label: "Acoustic Shield Flow",
          value: "Cd 0.15",
          detail: "Smooth curved airflow sweeping over the flight cockpit to suppress acoustic rotor cabin noise.",
          glowColor: "#10b981", // emerald
          gradientId: "grad-emerald",
          strokeWidth: 3.5,
          dashArray: "12 6",
        },
        {
          id: "forward-vortex",
          title: "Ducted Fan Lift Swirl",
          category: "cooling",
          path: "M 220,130 C 240,80 320,80 340,140 C 350,180 300,220 250,190 C 220,170 230,140 290,135",
          hotspot: { x: 29, y: 22 },
          label: "Front Rotor Vortex",
          value: "+850 kg Lift",
          detail: "Spiral suction vector created by counter-rotating ducted fan shrouds during vertical hovering.",
          glowColor: "#06b6d4", // cyan
          gradientId: "grad-cyan",
          strokeWidth: 3,
        },
        {
          id: "downward-wash",
          title: "Downward Thrust Wash",
          category: "downforce",
          path: "M 320,220 C 340,280 350,340 370,380 M 680,220 C 700,280 710,340 730,380",
          hotspot: { x: 50, y: 78 },
          label: "Vectoring Downwash",
          value: "1,400 kg Vertical Thrust",
          detail: "High-density energy stream directed downward for stable vertical take-off and precision landing.",
          glowColor: "#38bdf8", // electric blue
          gradientId: "grad-blue",
          strokeWidth: 4,
          dashArray: "8 4",
        },
        {
          id: "rear-wake",
          title: "Aft Stabilization Slipstream",
          category: "wake",
          path: "M 620,160 C 720,180 820,190 950,195",
          hotspot: { x: 78, y: 45 },
          label: "Rear Wake Suppression",
          value: "Vortex Suppressed",
          detail: "Clean separation of exhaust air behind the dual vertical stabilizers preventing tail turbulence.",
          glowColor: "#a855f7", // purple
          gradientId: "grad-purple",
          strokeWidth: 3,
        },
      ];
    }

    if (archetype === "suv") {
      return [
        {
          id: "hood-deflection",
          title: "Rugged Hood Air Curtain",
          category: "laminar",
          path: "M 60,260 C 180,240 280,180 420,150 C 580,120 720,180 940,230",
          hotspot: { x: 28, y: 48 },
          label: "Debris & Wind Deflector",
          value: "Cd 0.24",
          detail: "Sweeping boundary stream lifting trail dust and rainwater clear of windscreen glazing.",
          glowColor: "#10b981",
          gradientId: "grad-emerald",
          strokeWidth: 3.5,
        },
        {
          id: "wheel-arch-flow",
          title: "Wheel Arch Pressure Venting",
          category: "cooling",
          path: "M 180,280 C 220,220 280,220 310,270 C 330,300 370,300 420,280",
          hotspot: { x: 25, y: 68 },
          label: "Brake Thermal Venting",
          value: "420 L/s Airflow",
          detail: "High-speed air flushed through front brake calipers and emitted along outer door panels.",
          glowColor: "#06b6d4",
          gradientId: "grad-cyan",
          strokeWidth: 3,
        },
        {
          id: "roof-trail-stream",
          title: "Roofline Trail Streamline",
          category: "underbody",
          path: "M 360,150 C 500,120 680,130 780,200 C 840,240 890,260 960,270",
          hotspot: { x: 62, y: 32 },
          label: "Roof spoiler vortex",
          value: "-15% Drag Coefficient",
          detail: "Curved flow over roof rack cargo channel reuniting smoothly with rear tailgate spoiler.",
          glowColor: "#34d399",
          gradientId: "grad-green",
          strokeWidth: 3,
        },
        {
          id: "ground-clearance-air",
          title: "High-Clearance Underbody Flow",
          category: "wake",
          path: "M 100,320 C 300,315 600,315 920,330",
          hotspot: { x: 50, y: 84 },
          label: "Underbody Venturi Channel",
          value: "Sealed Skidplate",
          detail: "Smooth flat-bottom skidplate guiding air around suspension arms to prevent mud snagging.",
          glowColor: "#38bdf8",
          gradientId: "grad-blue",
          strokeWidth: 3.5,
        },
      ];
    }

    if (archetype === "ocean") {
      return [
        {
          id: "hydro-bow-curve",
          title: "Hydrodynamic Bow Pressure Curve",
          category: "laminar",
          path: "M 50,220 C 180,160 380,150 560,180 C 700,200 840,220 950,230",
          hotspot: { x: 22, y: 40 },
          label: "Sub-surface Hydro Laminar",
          value: "Minimal Cavitation",
          detail: "Sleek liquid displacement streamline curving around pressure-sealed forward dome.",
          glowColor: "#06b6d4",
          gradientId: "grad-cyan",
          strokeWidth: 4,
        },
        {
          id: "stern-propulsion-swirl",
          title: "Stern Jet Hydro-Swirl",
          category: "wake",
          path: "M 720,200 C 780,180 840,170 880,210 C 910,240 860,270 800,260 M 820,240 C 870,240 920,230 970,240",
          hotspot: { x: 84, y: 55 },
          label: "MHD Hydrojet Thrust",
          value: "Silent Propulsive Wave",
          detail: "Magnetohydrodynamic fluid thrust expelled in a tight vortex for silent underwater cruising.",
          glowColor: "#38bdf8",
          gradientId: "grad-blue",
          strokeWidth: 3.5,
        },
      ];
    }

    // Default HYPERCAR / GT / CYBER
    return [
      {
        id: "hood-canopy-sweep",
        title: "Hood & Canopy Boundary Streamline",
        category: "laminar",
        path: "M 40,260 C 160,220 280,150 440,130 C 620,110 740,170 950,220",
        hotspot: { x: 32, y: 35 },
        label: "Laminar Canopy Sweep",
        value: dragCoefficient,
        detail: "Continuous single-stroke airflow hugging the low windscreen and glass canopy without turbulence.",
        glowColor: "#10b981", // emerald neon
        gradientId: "grad-emerald",
        strokeWidth: 4,
        dashArray: "12 6",
      },
      {
        id: "fender-arch-swirl",
        title: "Front Fender & Wheel Arch Vortex",
        category: "cooling",
        path: "M 120,270 C 180,210 250,210 290,265 C 310,290 350,280 410,250",
        hotspot: { x: 22, y: 58 },
        label: "Front Arch Pressure Relief",
        value: "380 L/s Cooling",
        detail: "Air pressure built inside front wheel wells is smoothly extracted over side sill carbon blades.",
        glowColor: "#06b6d4", // cyan neon
        gradientId: "grad-cyan",
        strokeWidth: 3,
      },
      {
        id: "side-scoop-flow",
        title: "Mid-Engine Thermal Intake Scoop",
        category: "cooling",
        path: "M 380,240 C 460,200 540,190 610,230 C 660,260 720,250 820,230",
        hotspot: { x: 54, y: 52 },
        label: "Inverter Thermal Feed",
        value: "Dual Radiator Charge",
        detail: "High-density air compressed into side body intakes to feed power electronics and battery heat exchangers.",
        glowColor: "#34d399", // bright green
        gradientId: "grad-green",
        strokeWidth: 3.5,
      },
      {
        id: "underbody-venturi-tunnel",
        title: "Ground-Effect Venturi Stream",
        category: "underbody",
        path: "M 70,300 C 250,295 550,295 800,290 C 860,285 910,260 960,250",
        hotspot: { x: 48, y: 78 },
        label: "Venturi Downforce Tunnel",
        value: "520 kg Downforce",
        detail: "Underbody ground-effect suction tunnel accelerating air to generate massive cornering grip.",
        glowColor: "#38bdf8", // electric blue
        gradientId: "grad-blue",
        strokeWidth: 4,
        dashArray: "10 5",
      },
      {
        id: "active-wing-swirl",
        title: "Rear Wing & Diffuser Air Swirl",
        category: "downforce",
        path: "M 700,160 C 760,130 840,130 890,170 C 920,200 890,240 820,220 C 790,210 820,180 920,200 C 950,210 970,220 990,230",
        hotspot: { x: 84, y: 38 },
        label: "Morphing Wing Downforce",
        value: "680 kg @ 320 km/h",
        detail: "Swirling trailing vortices created by active rear wing flaps stabilizing high-speed stability.",
        glowColor: "#f59e0b", // amber neon
        gradientId: "grad-amber",
        strokeWidth: 3.5,
      },
      {
        id: "rear-wake-neutralizer",
        title: "Rear Diffuser Wake Neutralizer",
        category: "wake",
        path: "M 810,260 C 870,265 920,255 980,245",
        hotspot: { x: 88, y: 68 },
        label: "Low-Pressure Wake Kill",
        value: "Zero Drag Vortex",
        detail: "Smoothly reuniting top canopy air with underbody exhaust to kill trailing low-pressure drag.",
        glowColor: "#a855f7", // purple neon
        gradientId: "grad-purple",
        strokeWidth: 3,
      },
    ];
  }, [aeroStreamlines, archetype, dragCoefficient]);

  const activeStream = useMemo(() => {
    if (selectedStreamId) {
      return streamlines.find((s) => s.id === selectedStreamId) || streamlines[0];
    }
    return streamlines[0];
  }, [selectedStreamId, streamlines]);

  const filteredStreamlines = useMemo(() => {
    if (activeCategory === "all") return streamlines;
    return streamlines.filter((s) => s.category === activeCategory);
  }, [activeCategory, streamlines]);

  return (
    <div className="bg-[#121214] border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-5">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1b271f] border border-[#324a3a] text-[#7ca887] text-[10px] font-mono tracking-wider uppercase mb-1">
            <Wind className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Wind Tunnel Streamline Simulation</span>
          </div>
          <h3 className="text-base sm:text-xl font-bold text-zinc-100 font-serif uppercase tracking-wider flex items-center gap-2">
            <span>{vehicleName}</span>
            <span className="text-xs font-mono font-normal text-emerald-300 bg-emerald-950/90 border border-emerald-700/60 px-2.5 py-0.5 rounded-md shadow-sm">
              {dragCoefficient}
            </span>
          </h3>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Curved, flowing aerodynamic streamlines illustrating boundary layer air motion & active downforce.
          </p>
        </div>

        {/* Drag & Output Summary Badge */}
        <div className="flex items-center gap-3 bg-[#18181c] border border-zinc-800 p-2.5 rounded-xl text-xs font-mono shadow-inner">
          <div className="text-center px-2">
            <span className="text-[10px] text-zinc-500 uppercase block">Drag Coeff</span>
            <span className="font-bold text-emerald-400 text-sm">{dragCoefficient}</span>
          </div>
          <div className="h-6 w-px bg-zinc-800"></div>
          <div className="text-center px-2">
            <span className="text-[10px] text-zinc-500 uppercase block">Estimated HP</span>
            <span className="font-bold text-zinc-200 text-sm">{estimatedHp}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1 shrink-0">
          <Filter className="w-3 h-3 text-zinc-400" /> Flow Layers:
        </span>
        {[
          { id: "all", label: "All Airflow Streams" },
          { id: "laminar", label: "Laminar Canopy Sweep" },
          { id: "downforce", label: "Downforce & Vortex" },
          { id: "cooling", label: "Thermal Intakes" },
          { id: "underbody", label: "Ground Venturi" },
          { id: "wake", label: "Rear Wake Suppression" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`text-[11px] font-mono px-3 py-1 rounded-lg border transition-all whitespace-nowrap ${
              activeCategory === tab.id
                ? "bg-[#213326] text-emerald-200 border-[#38523f] font-semibold shadow-sm"
                : "bg-[#161618] text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Wind Tunnel Streamline Canvas Stage */}
      <div className="relative w-full h-64 sm:h-72 md:h-80 bg-[#0a0a0c] border border-zinc-800/90 rounded-xl overflow-hidden flex flex-col justify-between p-3 sm:p-4 shadow-2xl group">
        {/* Futuristic CAD Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1c2c22_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none"></div>

        {/* Ambient Neon Wind Tunnel Header */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-500 pointer-events-none">
          <span className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-2.5 py-1 rounded-md text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Front Airflow Stream Entry
          </span>
          <span className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 px-2.5 py-1 rounded-md text-cyan-400">
            Rear Wake Separation Layer
          </span>
        </div>

        {/* SVG Streamlines Stage */}
        <div className="absolute inset-0 w-full h-full p-2 pointer-events-auto">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 1000 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Neon Glow Filter */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Dynamic Glowing Streamline Gradients & Arrow Markers for each stream */}
              {streamlines.map((stream) => (
                <React.Fragment key={stream.id}>
                  <linearGradient id={stream.gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={stream.glowColor} stopOpacity="0.1" />
                    <stop offset="45%" stopColor={stream.glowColor} stopOpacity="0.95" />
                    <stop offset="100%" stopColor={stream.glowColor} stopOpacity="0.2" />
                  </linearGradient>
                  <marker
                    id={`arrow-${stream.id}`}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="8"
                    markerHeight="8"
                    orient="auto"
                  >
                    <path d="M 0 1 L 9 5 L 0 9 L 2.5 5 z" fill={stream.glowColor} />
                  </marker>
                </React.Fragment>
              ))}
            </defs>

            {/* Abstract Subtle Vehicle Silhouette Outline Guide */}
            {archetype === "hypercar" && (
              <g opacity="0.22" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="4 4">
                {/* Low sleek roofline & fenders */}
                <path d="M 80,280 C 180,260 260,220 340,180 C 440,140 600,130 720,160 C 820,180 880,220 940,260 L 920,290 C 800,295 200,295 80,280 Z" />
                {/* Wheels */}
                <circle cx="240" cy="285" r="35" />
                <circle cx="760" cy="285" r="35" />
              </g>
            )}

            {archetype === "suv" && (
              <g opacity="0.22" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="4 4">
                {/* Tall boxy profile */}
                <path d="M 90,290 C 180,270 280,220 380,180 L 720,160 L 860,190 L 920,280 Z" />
                <circle cx="250" cy="290" r="40" />
                <circle cx="750" cy="290" r="40" />
              </g>
            )}

            {archetype === "vtol" && (
              <g opacity="0.22" stroke="#06b6d4" strokeWidth="1.5" fill="none" strokeDasharray="4 4">
                {/* Aero pod with dual ducted rotors */}
                <ellipse cx="500" cy="200" rx="280" ry="60" />
                <circle cx="280" cy="200" r="45" />
                <circle cx="720" cy="200" r="45" />
              </g>
            )}

            {archetype === "ocean" && (
              <g opacity="0.22" stroke="#06b6d4" strokeWidth="1.5" fill="none" strokeDasharray="4 4">
                <path d="M 70,230 C 200,170 500,160 800,200 C 900,215 950,230 960,240 C 920,270 700,280 100,250 Z" />
              </g>
            )}

            {/* Render Flowing Curved Aerodynamic Streamlines */}
            {filteredStreamlines.map((stream) => {
              const isSelected = selectedStreamId === stream.id || (selectedStreamId === null && stream.id === streamlines[0].id);

              return (
                <g key={stream.id} className="cursor-pointer group" onClick={() => setSelectedStreamId(stream.id)}>
                  {/* Glowing Background Blur Path for Neon Glow */}
                  <path
                    d={stream.path}
                    fill="none"
                    stroke={stream.glowColor}
                    strokeWidth={isSelected ? stream.strokeWidth * 2.8 : stream.strokeWidth * 1.5}
                    strokeOpacity={isSelected ? 0.65 : 0.25}
                    filter="url(#neonGlow)"
                    className="transition-all duration-300"
                  />

                  {/* Core Sharp Flow Streamline Path */}
                  <path
                    d={stream.path}
                    fill="none"
                    stroke={`url(#${stream.gradientId})`}
                    strokeWidth={isSelected ? stream.strokeWidth + 1.5 : stream.strokeWidth}
                    strokeDasharray={stream.dashArray || "14 8"}
                    markerEnd={`url(#arrow-${stream.id})`}
                    className={`transition-all duration-300 animate-dash-flow ${isSelected ? "opacity-100" : "opacity-75 hover:opacity-100"}`}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Interactive Hotspot Nodes overlay on the stream curves */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {filteredStreamlines.map((stream) => {
            const isSelected = selectedStreamId === stream.id || (selectedStreamId === null && stream.id === streamlines[0].id);

            return (
              <div
                key={stream.id}
                onClick={() => setSelectedStreamId(stream.id)}
                style={{ top: `${stream.hotspot.y}%`, left: `${stream.hotspot.x}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-all duration-300 ${
                  isSelected ? "scale-110 z-30" : "scale-95 hover:scale-105 z-20"
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-xl backdrop-blur-md transition-all ${
                    isSelected
                      ? "bg-[#16271c] border-emerald-400 text-white shadow-emerald-950/90 ring-2 ring-emerald-500/30"
                      : "bg-[#101012]/90 border-zinc-700/80 text-zinc-300 hover:border-emerald-500/70"
                  }`}
                  style={{ borderColor: isSelected ? stream.glowColor : undefined }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-ping shrink-0"
                    style={{ backgroundColor: stream.glowColor }}
                  ></span>

                  <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-tight whitespace-nowrap">
                    {stream.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Streamline Tech Spec Detail Box (Independent & Well Spaced) */}
      <div className="bg-[#121215] border border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-inner mt-0.5 sm:mt-0"
            style={{ backgroundColor: `${activeStream.glowColor}18`, borderColor: activeStream.glowColor }}
          >
            <Wind className="w-5 h-5" style={{ color: activeStream.glowColor }} />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-zinc-100 font-serif uppercase tracking-wide">
                {activeStream.title}
              </h4>
              <span
                className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border"
                style={{
                  backgroundColor: `${activeStream.glowColor}20`,
                  borderColor: `${activeStream.glowColor}50`,
                  color: activeStream.glowColor,
                }}
              >
                {activeStream.value}
              </span>
            </div>
            <p className="text-xs text-zinc-300 font-light leading-relaxed">
              {activeStream.detail}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-zinc-500 shrink-0 self-start md:self-center bg-zinc-900/80 px-2.5 py-1 rounded border border-zinc-800">
          Select streamline node above to inspect flow parameters
        </span>
      </div>

      {/* Aerodynamic Concept Principles Grid (Dynamic Tones & Values Matching Streamlines) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {streamlines.slice(0, 4).map((stream) => {
          const isSelected = stream.id === activeStream.id;
          return (
            <button
              key={stream.id}
              onClick={() => setSelectedStreamId(stream.id)}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#16271c] border-emerald-500/80 ring-1 ring-emerald-500/30 shadow-lg"
                  : "bg-[#141416] border-zinc-800/80 hover:border-zinc-700 hover:bg-[#18181b]"
              }`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse shadow-sm"
                style={{ backgroundColor: stream.glowColor }}
              ></div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-[10px] uppercase font-mono text-zinc-500 block truncate">
                  {stream.category} • {stream.value}
                </span>
                <span className="text-xs font-semibold text-zinc-200 block truncate">
                  {stream.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
