import React from "react";
import { Compass, FolderKanban, BookOpen, Cpu, RotateCcw } from "lucide-react";

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  savedCount: number;
  onSelectPreset: (presetId: string) => void;
  onResetStudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenGuide,
  savedCount,
  onSelectPreset,
  onResetStudio,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#121215]/95 backdrop-blur-md border-b border-zinc-800/90 px-4 sm:px-6 lg:px-10 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Top-Left Clean Brand & Home Reset Button */}
        <button
          type="button"
          onClick={() => {
            onResetStudio();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3.5 group text-left transition-all p-1.5 -ml-1.5 rounded-xl hover:bg-zinc-800/50 active:scale-[0.99] select-none"
          title="Return to Studio Home & Start New Design"
        >
          {/* Clean, sleek automotive CPU / Engine icon (No blinking dot) */}
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#243328] to-[#141c16] border border-[#3e5643]/70 shadow-md shadow-[#1c2920]/40 group-hover:border-[#52735a] transition-all shrink-0">
            <Cpu className="w-4 h-4 text-[#8eb097] group-hover:text-emerald-300 transition-colors" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-xl font-bold tracking-wider text-zinc-100 font-serif uppercase group-hover:text-emerald-300 transition-colors leading-tight">
                AutoMuse <span className="text-[#719678] font-sans font-extrabold text-xs px-2 py-0.5 rounded bg-[#1e2a20] border border-[#344a39]">AI</span>
              </h1>
              <span className="text-[10px] tracking-widest text-emerald-400 font-mono uppercase border border-emerald-800/60 px-2 py-0.5 rounded-full bg-emerald-950/40 hidden md:inline-flex items-center gap-1">
                <RotateCcw className="w-2.5 h-2.5" /> Studio v2.5
              </span>
            </div>

            {/* Generous intentional vertical spacing for subtitle */}
            <p className="text-xs text-zinc-400 tracking-wide font-light mt-1 flex items-center gap-1.5">
              <span>Design Your Dream Vehicle</span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-zinc-500 text-[11px] hidden sm:inline font-sans">Automotive Concept Studio</span>
            </p>
          </div>
        </button>

        {/* Quick Actions Navigation Bar */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-0.5 sm:pb-0">
          {/* Preset Pickers */}
          <div className="hidden lg:flex items-center gap-2 mr-1 pl-4 border-l border-zinc-800/80 text-xs">
            <span className="text-zinc-500 font-mono text-[11px] mr-0.5 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#52735a]" /> Presets:
            </span>
            <button
              type="button"
              onClick={() => onSelectPreset("preset-porsche-2075")}
              className="text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-[#1a261c] border border-zinc-800 hover:border-[#384f3e] px-2.5 py-1.5 rounded-lg transition-all text-xs font-medium"
            >
              Porsche 2075
            </button>
            <button
              type="button"
              onClick={() => onSelectPreset("preset-bugatti-2050")}
              className="text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-[#1a261c] border border-zinc-800 hover:border-[#384f3e] px-2.5 py-1.5 rounded-lg transition-all text-xs font-medium"
            >
              Bugatti 2050
            </button>
          </div>

          {/* Guide Modal Trigger */}
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 px-3.5 py-2 rounded-lg transition-all font-medium"
            title="Portfolio & Studio Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#719678]" />
            <span className="hidden sm:inline">Studio Guide</span>
          </button>

          {/* History Drawer Trigger - My Garage */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-2 text-xs text-zinc-200 hover:text-white bg-[#19221b] hover:bg-[#202d24] border border-[#314535] px-4 py-2 rounded-lg transition-all shadow-sm font-medium"
          >
            <FolderKanban className="w-3.5 h-3.5 text-[#8eb097]" />
            <span>My Garage</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-[#38503e] text-emerald-200 rounded-full border border-[#4a6b53]">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

