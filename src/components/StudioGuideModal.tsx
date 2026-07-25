import React from "react";
import { X, BookOpen, Sparkles, CheckCircle2, ShieldCheck, Compass } from "lucide-react";

interface StudioGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudioGuideModal: React.FC<StudioGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#18181a] border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#233026] text-emerald-300 flex items-center justify-center border border-[#384d3d]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 uppercase font-serif tracking-wider">
                Automotive Design Portfolio Guide
              </h2>
              <p className="text-xs text-zinc-400">
                How to integrate AutoMuse AI reports into student & professional transport design portfolios.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-5 text-xs md:text-sm text-zinc-300 font-light leading-relaxed">
          <div className="bg-[#121214] p-4 rounded-xl border border-zinc-800/80 space-y-2">
            <h3 className="font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4" />
              Overcoming Creative Block in Early Design Phases
            </h3>
            <p className="text-zinc-400 text-xs">
              As transport design students (e.g. Royal College of Art, Pforzheim, ArtCenter), early conceptualization requires strong rationale, market positioning, aerodynamic goals, and material stories before placing pen to tablet.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-zinc-200 uppercase text-xs tracking-wider">
              Recommended 4-Step Portfolio Workflow:
            </h4>

            <div className="flex items-start gap-3 bg-[#121214] p-3 rounded-lg border border-zinc-800">
              <span className="w-6 h-6 rounded bg-[#233026] text-emerald-300 text-xs font-bold font-mono flex items-center justify-center flex-shrink-0">
                1
              </span>
              <div>
                <h5 className="font-bold text-zinc-200 text-xs">Define Context & Target Parameters</h5>
                <p className="text-zinc-400 text-xs">
                  Select your vehicle archetype, target market (e.g., Italy, Japan), and timeline (e.g. 2075) to frame your design brief.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#121214] p-3 rounded-lg border border-zinc-800">
              <span className="w-6 h-6 rounded bg-[#233026] text-emerald-300 text-xs font-bold font-mono flex items-center justify-center flex-shrink-0">
                2
              </span>
              <div>
                <h5 className="font-bold text-zinc-200 text-xs">Extract Design Language & Aero Terms</h5>
                <p className="text-zinc-400 text-xs">
                  Incorporate technical terms from the generated report (dash-to-axle, venturi tunnels, active aero flaps, forged monocoque) into your project moodboard and sketch callouts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#121214] p-3 rounded-lg border border-zinc-800">
              <span className="w-6 h-6 rounded bg-[#233026] text-emerald-300 text-xs font-bold font-mono flex items-center justify-center flex-shrink-0">
                3
              </span>
              <div>
                <h5 className="font-bold text-zinc-200 text-xs">Utilize Color & Material Swatches</h5>
                <p className="text-zinc-400 text-xs">
                  Use the generated hex codes and CMF (Color, Materials, Finish) recommendations to establish your vehicle's physical material board.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#121214] p-3 rounded-lg border border-zinc-800">
              <span className="w-6 h-6 rounded bg-[#233026] text-emerald-300 text-xs font-bold font-mono flex items-center justify-center flex-shrink-0">
                4
              </span>
              <div>
                <h5 className="font-bold text-zinc-200 text-xs">Export Studio Markdown for Presentation</h5>
                <p className="text-zinc-400 text-xs">
                  Click "Export Portfolio (.md)" to export clean project descriptions directly to Behance, Notion, or pitch decks.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#121214] p-4 rounded-xl border border-zinc-800 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-zinc-400">
              Designed specifically for automotive design students, concept artists, and car enthusiasts to elevate design project submissions.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#28382c] hover:bg-[#34493a] text-emerald-100 text-xs font-bold uppercase tracking-wider border border-[#445f4b] transition-all"
          >
            Got It • Back to Studio
          </button>
        </div>
      </div>
    </div>
  );
};
