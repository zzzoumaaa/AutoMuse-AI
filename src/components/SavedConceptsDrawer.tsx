import React from "react";
import { SavedConcept } from "../types";
import { X, Trash2, ExternalLink, Sparkles, FolderKanban, Car } from "lucide-react";

interface SavedConceptsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedConcepts: SavedConcept[];
  onSelectConcept: (concept: SavedConcept) => void;
  onDeleteConcept: (id: string) => void;
}

export const SavedConceptsDrawer: React.FC<SavedConceptsDrawerProps> = ({
  isOpen,
  onClose,
  savedConcepts,
  onSelectConcept,
  onDeleteConcept,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#161618] border-l border-zinc-800 h-full p-6 flex flex-col shadow-2xl relative">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#223326] border border-[#38523f] flex items-center justify-center">
              <Car className="w-4 h-4 text-[#8eb097]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 uppercase tracking-wider font-serif">
                My Garage
              </h2>
              <p className="text-[11px] text-zinc-400 font-light">Your saved concept collection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {savedConcepts.length === 0 ? (
            <div className="text-center py-16 space-y-3 text-zinc-500">
              <Sparkles className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-light">Your Garage is empty.</p>
              <p className="text-xs text-zinc-600">
                Generate a concept report and click "Save to My Garage" to store your vehicle designs.
              </p>
            </div>
          ) : (
            savedConcepts.map((item, index) => (
              <div
                key={item.id}
                className="bg-[#101012] border border-zinc-800/80 hover:border-[#384d3d] p-4 rounded-xl transition-all space-y-2.5 group relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#7ca887] uppercase tracking-wider">
                      Garage Concept #{index + 1} • {item.input.year}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-100 uppercase font-serif tracking-wide group-hover:text-emerald-300 transition-colors">
                      {item.report.vehicleName}
                    </h3>
                  </div>
                  <button
                    onClick={() => onDeleteConcept(item.id)}
                    className="text-zinc-600 hover:text-red-400 p-1 transition-colors"
                    title="Remove from My Garage"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400">
                  <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {item.input.vehicleType}
                  </span>
                  <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {item.input.designStyle}
                  </span>
                  <span className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {item.input.countryMarket}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-light line-clamp-2">
                  {item.report.vehicleConceptSummary}
                </p>

                <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-zinc-600 font-mono">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => {
                      onSelectConcept(item);
                      onClose();
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors text-xs"
                  >
                    <span>Load Concept</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-zinc-800 text-center text-xs text-zinc-500 font-mono">
          AutoMuse AI • My Garage Collection
        </div>
      </div>
    </div>
  );
};
