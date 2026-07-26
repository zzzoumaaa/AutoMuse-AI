import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { inferConceptFromPrompt } from "./src/lib/promptInference";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client lazily or safely
function getGeminiClient() {
  // Use process.env for Node environment. Vite's import.meta.env is not available in TS Node runtime.
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Wild respin variations array for surprise-me behavior
const RESPIN_VARIATIONS = [
  { id: "apex-splitter-stream", title: "Front Splitter Venturi Tunnels", category: "downforce", path: "M 30,280 C 140,240 260,160 420,130 C 600,100 760,140 960,190", hotspot: { x: 30, y: 48 }, label: "Front Splitter High Suction", value: "+850 kg Downforce", detail: "High-density airflow under the front splitter creating glued-to-track cornering.", glowColor: "#10b981", strokeWidth: 4 },
  { id: "apex-rear-wing-wake", title: "Active Wing Airbrake Flow", category: "wake", path: "M 650,140 C 720,100 800,100 860,140 C 900,170 880,210 820,190", hotspot: { x: 78, y: 32 }, label: "Rear Wing High Pressure", value: "3.2 G Braking", detail: "Airbrake flipping vertical to stall airflow during high-speed deceleration.", glowColor: "#f59e0b", strokeWidth: 3.5 },
];

const RESPIN_ANGLE_VARIATIONS = [
    "Sub-Orbital Transcontinental eVTOL Flying Concept inspired by High Fashion & Aerospace",
    "Biomorphic Active-Aero Quantum Speedster inspired by Nature & Formula Racing",
    "Cyberpunk Heavy-Armor Extreme Expedition Rover combining Sci-Fi & Industrial Design",
    "Autonomous Ultra-Luxury Zero-Gravity Transcontinental Lounge Pod with Scandinavian Luxury",
    "Le Mans Hydro-Plasma Endurance Racer combining Gaming Aesthetics & Aerospace",
    "Deep-Sea Oceanographic Amphibious Speed-Yacht merging Marine Design & Architecture",
    "Minimalist Solid-State Solar Monolith GT inspired by Japanese Minimalism & Sustainable Futures",
    "Monocoque Pure-Speed Open-Cockpit Aero-Blade with Concept Art & Formula 1 DNA",
    "Sleek Eco-Luxury Kinetic Shooting Brake Wagon for Nordic Snow Corridors with Scandinavian Styling",
    "Titanium-Graphene Active Morphing Super-GT combining Cyberpunk & High Fashion",
    "Hyper-Sonic Maglev Intercity Commuter Shuttle with Space Exploration Tech & Industrial Aesthetics",
    "Biomorphic Symbiont Pod with Bio-Luminescent Photovoltaic Skin inspired by Nature & Sci-Fi",
    "Plasma-Levitation Kinetic Monolith with Solar-Sail Folding Wings combining Architecture & Space Exploration",
    "Deep-Sea Hydrofoil Quartz Glass Submersible Yacht blending Marine Engineering & Japanese Minimalism",
    "Cybernetic Extraterrestrial Exoskeleton Heavy Rover with Sci-Fi & Heavy Industrial Aesthetics",
    "Retro-Futuristic Steam-Ionic Grand Tourer with Exposed Kinetic Turbines & High Fashion Tailoring",
  ];

   // Alternate universe presets for Respin fallback mode
  const RESPIN_FALLBACK_ARCHETYPES = [
    {
      vehicleName: "Aetheris GT-9 Quantum Aero",
      vehicleType: "Sub-Orbital eVTOL Ground Hybrid",
      designPhilosophy: "Forged at the boundary where aerospace dynamics meet high-fashion automotive sculpting, the GT-9 redefines zero-gravity personal transit.",
      vehicleConceptSummary: "The Aetheris GT-9 is an ultra-luxury flying ground-hybrid engineered for seamless transcontinental travel between urban landing pads and high-altitude skyways.",
      designLanguage: "Fluid Aerodynamic Canopy: Continuous carbon-glass bubble with swiveling vector thrust pods and active boundary-layer air intake slots.",
      designDna: [
        { attribute: "Aerospace Dynamics", percentage: 55 },
        { attribute: "Italian Elegance", percentage: 30 },
        { attribute: "Quantum Propulsion", percentage: 15 },
      ],
      exteriorStylingSuggestions: "Swept-wing silhouette with titanium-clad vector thrusters, retractable landing gear arches, and a continuous holographic light-bar.",
      interiorStylingSuggestions: "Anti-gravity floating seats upholstered in bio-synthetic mycelium leather with panoramic 360-degree heads-up flight displays.",
      colorPaletteSuggestions: [
        { name: "Nebula Cobalt", hex: "#0f172a", usage: "Main Fuselage Structure" },
        { name: "Emerald Ion", hex: "#10b981", usage: "Rotor Blades & Calipers" },
        { name: "Starlight Platinum", hex: "#e2e8f0", usage: "Wing Ribs & Trim" },
        { name: "Solar Bronze", hex: "#d97706", usage: "Cockpit Ambient Lighting" },
      ],
      materialsList: [
        { name: "Titanium-Graphene Honeycomb", category: "Fuselage", description: "Ultra-lightweight structural core capable of enduring high-altitude pressure shifts." },
        { name: "Electrochromic Solar Glass", category: "Canopy", description: "Instant auto-tinting photovoltaic glass providing ambient shade and auxiliary power." },
        { name: "Organic Fiber Weave", category: "Interior", description: "Zero-carbon recycled carbon-flax seating shells." },
        { name: "Self-Regulating Smart Alloy", category: "Vector Wings", description: "Shape-memory alloy that adjusts curvature dynamically based on airspeed." },
      ],
      materialsRecommendations: "Constructed using titanium-graphene weaves and electrochromic canopy glass to deliver extreme weight reduction and thermal isolation.",
      aerodynamicsSuggestions: "Dual boundary-layer boundary slots directing airflow over swiveling vector blades to achieve instantaneous lift and zero-drag cruising.",
      vehicleStructureRecommendations: "Monocoque carbon safety cell with triply-redundant parachute containment and active magnetic crash-mitigation bumpers.",
      sustainabilityRecommendations: "Powered by a solid-state hydrogen fuel cell paired with solar-harvesting outer skin panels for complete atmospheric carbon neutrality.",
      professionalDesignDescription: "The Aetheris GT-9 represents an alternate-universe vision of mobility, erasing the boundary between supercar performance and vertical sky transit.",
      sizeComparison: { lengthMeters: "5.4 m", comparedTo: "Footprint comparable to Archer Midnight / Joby S4 eVTOL", cabinCapacity: "1 Pilot + 3 Executive Passengers" },
      keySpecs: { topSpeed: "520 km/h / 323 mph", estimatedRange: "1,200 km / 745 mi", dragCoefficient: "Cd 0.14", estimatedHp: "2,100 HP", powertrainType: "Dual Hydrogen Vector-Thrust EV", terrainCompatibility: "Low-Air Corridors • Skyway Pads • Highway", autonomyLevel: "Level 6 Fully Autonomous Flight", yearOfProduction: "2088" },
      aeroStreamlines: [
        { id: "vtol-lift-vortex", title: "Canopy Vector Airflow", category: "laminar", path: "M 60,200 C 180,110 380,90 580,130 C 720,160 850,190 950,200", hotspot: { x: 38, y: 28 }, label: "Boundary Layer Flight Stream", value: "Cd 0.14", detail: "Laminar airflow sweeping over the aerospace canopy during forward cruise.", glowColor: "#10b981", strokeWidth: 3.5 },
        { id: "thruster-intake", title: "Vector Rotor Pressure Relief", category: "cooling", path: "M 120,260 C 180,200 250,200 290,250 C 310,270 350,260 410,230", hotspot: { x: 25, y: 52 }, label: "Thrust Duct Inlet", value: "680 L/s Flow", detail: "High-density intake channel feeding air to the mid-wing vector thrusters.", glowColor: "#06b6d4", strokeWidth: 3 },
        { id: "underbody-suction", title: "Ground-Effect Venturi Channel", category: "underbody", path: "M 70,290 C 250,285 550,285 800,280 C 860,275 910,250 960,240", hotspot: { x: 50, y: 76 }, label: "Underbody Ground Channel", value: "+720 kg Downforce", detail: "Suction channel providing ground-effect stability during high-speed road transit.", glowColor: "#38bdf8", strokeWidth: 4 },
        { id: "wingtip-vortex", title: "Trailing Wingtip Vortex Neutralizer", category: "wake", path: "M 700,150 C 760,120 840,120 890,160 C 920,190 890,230 820,210", hotspot: { x: 82, y: 36 }, label: "Active Wingtip Vortex", value: "Zero Wake Drag", detail: "Trailing vortex blades canceling wingtip turbulence at supersonic speeds.", glowColor: "#f59e0b", strokeWidth: 3.5 },
      ],
    },
    {
      vehicleName: "Ares Terra-Rover 2085",
      vehicleType: "Off-Road Expedition Vessel",
      designPhilosophy: "Engineered for brutal extraterrestrial terrain and uncharted desert tracks, combining indestructible armor with bio-regenerative life support.",
      vehicleConceptSummary: "The Ares Terra-Rover is a heavy-duty autonomous exploration vessel designed to navigate unpaved dune fields, crater rims, and extreme weather corridors.",
      designLanguage: "Cybernetic Exoskeleton: Angular titanium ribcage framing, reinforced portal axles, and integrated active dust-repelling electromagnetic shields.",
      designDna: [
        { attribute: "Tactical Armor", percentage: 50 },
        { attribute: "Off-Road Expedition", percentage: 35 },
        { attribute: "Bio-Support Tech", percentage: 15 },
      ],
      exteriorStylingSuggestions: "Matte olive-slate ceramic armor panels, exposed suspension dampers, high-intensity lidar search beacons, and heavy beadlock wheels.",
      interiorStylingSuggestions: "Hermetically sealed tactical command cabin with dual steering joysticks, thermal imaging HUDs, and modular cargo racks.",
      colorPaletteSuggestions: [
        { name: "Tactical Bronze", hex: "#27272a", usage: "Armored Exoskeleton" },
        { name: "Dune Gold", hex: "#d97706", usage: "Suspension Coils & Beacons" },
        { name: "Forest Olive", hex: "#1c2b20", usage: "Body Panels" },
        { name: "Cyber Teal", hex: "#06b6d4", usage: "HUD & Sensor Glazing" },
      ],
      materialsList: [
        { name: "Ceramic-Matrix Armor", category: "Exoskeleton", description: "Impact-resistant ceramic plating built to withstand high-velocity rock impact." },
        { name: "Non-Pneumatic Airless Tires", category: "Wheels", description: "Self-cleaning titanium-webbed airless tires that adapt stiffness to sand or rock." },
        { name: "Electromagnetic Dust Shield", category: "Glass", description: "Active static field preventing dust accumulation on windshield and optical sensors." },
        { name: "Synthetic Kevlar Interior", category: "Cabin", description: "Fireproof, tear-resistant tactical cockpit linings." },
      ],
      materialsRecommendations: "Utilizes ceramic-matrix armor plates, airless shape-memory tires, and electromagnetic sensor glass for absolute durability in hostile environments.",
      aerodynamicsSuggestions: "High-clearance skidplate airflow deflectors directing debris and sand away from the central battery pack.",
      vehicleStructureRecommendations: "Full-titanium roll cage with integrated winch recovery anchors and sealed pressure hull.",
      sustainabilityRecommendations: "Nuclear-isotope thermionic generator paired with regenerative solar sails for endless off-grid autonomy.",
      professionalDesignDescription: "The Ares Terra-Rover represents an alternate-universe vision of off-road mobility, ready to conquer Mars or extreme Earth wilderness.",
      sizeComparison: { lengthMeters: "6.2 m", comparedTo: "Proportions larger than Rivian R1T / Mercedes Unimog", cabinCapacity: "4 Crew Members + Expedition Gear" },
      keySpecs: { topSpeed: "220 km/h / 137 mph", estimatedRange: "3,500 km / 2,174 mi", dragCoefficient: "Cd 0.38", estimatedHp: "1,850 HP", powertrainType: "Nuclear-Isotope Solid-State EV", terrainCompatibility: "Mars Surface • Dune Tracks • Craters", autonomyLevel: "Level 6 Autonomous Rover", yearOfProduction: "2085" },
      aeroStreamlines: [
        { id: "rover-hood-deflector", title: "Skidplate Sand Deflector", category: "laminar", path: "M 50,260 C 180,240 320,180 480,160 C 650,140 780,200 950,250", hotspot: { x: 32, y: 40 }, label: "Hood Debris Deflector", value: "320 kg Thrust", detail: "Air stream sweeping dust off the optical radar array.", glowColor: "#d97706", strokeWidth: 3.5 },
        { id: "wheel-arch-flow", title: "Portal Axle Cooling Vent", category: "cooling", path: "M 140,280 C 200,220 280,220 320,270 C 350,290 400,280 460,250", hotspot: { x: 26, y: 62 }, label: "Brake Caliper Vent", value: "510 L/s Flow", detail: "Cooling air routed over heavy ceramic brake discs.", glowColor: "#10b981", strokeWidth: 3 },
        { id: "roof-snorkel-stream", title: "High-Altitude Air Intake", category: "cooling", path: "M 320,150 C 440,120 580,120 680,160 C 780,190 850,210 940,230", hotspot: { x: 52, y: 25 }, label: "Roof Air Intake", value: "Pure Induction", detail: "Clean upper air stream feeding the onboard air scrubber.", glowColor: "#38bdf8", strokeWidth: 3.5 },
      ]
    },
    {
      vehicleName: "Neptune Abyss X Hydro-Lounge",
      vehicleType: "Amphibious Hydrofoil Speedster",
      designPhilosophy: "Blurring the line between ultra-luxury road yachting and deep-sea hydrodynamic exploration.",
      vehicleConceptSummary: "The Neptune Abyss X is a dual-mode amphibious luxury concept capable of cruising at high speeds on land and transitioning smoothly into water.",
      designLanguage: "Hydrodynamic Wave Sculpting: Seamless watertight hull, retractable carbon hydrofoils, and electrochromic ocean-view floor panes.",
      designDna: [
        { attribute: "Yachting Craftsmanship", percentage: 50 },
        { attribute: "Hydrodynamic Engineering", percentage: 35 },
        { attribute: "Futuristic Luxury", percentage: 15 },
      ],
      exteriorStylingSuggestions: "Mirror-finish polished titanium hull with active hydrodynamic bow flaps, ocean-depth LED floodlights, and teak-accented deck steps.",
      interiorStylingSuggestions: "Submersible panoramic glass lounge with water-resistant bio-leather armchairs, underwater sonar HUD, and ambient ocean lighting.",
      colorPaletteSuggestions: [
        { name: "Abyss Navy", hex: "#0c1821", usage: "Watertight Hull" },
        { name: "Aquamarine Glow", hex: "#06b6d4", usage: "Hydrofoil Accents" },
        { name: "Teak Gold", hex: "#b45309", usage: "Deck Decking" },
        { name: "Pearl White", hex: "#f8fafc", usage: "Seating Upholstery" },
      ],
      materialsList: [
        { name: "Hydrophobic Carbon Composite", category: "Hull", description: "Zero-drag water-repellent surface treatment for peak hydrodynamic efficiency." },
        { name: "Pressure-Resistant Quartz Glass", category: "Floor & Roof", description: "Reinforced transparent canopy capable of withstanding deep water submersion." },
        { name: "Marine-Grade Teak-Fiber Decking", category: "Exterior Deck", description: "Sustainable recycled wood composite engineered against saltwater corrosion." },
      ],
      materialsRecommendations: "Crafted with hydrophobic carbon composite hulls, marine teak accents, and pressure-resistant quartz glass.",
      aerodynamicsSuggestions: "Dual-purpose aero-hydro foil channels that generate downforce on land and lift over water.",
      vehicleStructureRecommendations: "Double-walled titanium pressure hull with emergency air lock buoyancy chambers.",
      sustainabilityRecommendations: "Water-jet plasma propulsion emitting zero pollutants into ocean ecosystems.",
      professionalDesignDescription: "The Neptune Abyss X offers a transcendent alternate-universe vision of amphibious mobility for coastal luxury living.",
      sizeComparison: { lengthMeters: "7.2 m", comparedTo: "Proportions similar to Triton Submersible / Brabus Shadow", cabinCapacity: "6 Passengers + Dive Equipment" },
      keySpecs: { topSpeed: "340 km/h / 211 mph", estimatedRange: "900 km / 559 mi", dragCoefficient: "Cd 0.16", estimatedHp: "1,600 HP", powertrainType: "Quad-Motor Water-Jet EV", terrainCompatibility: "Ocean Depth • Coastal • Coastal Highway", autonomyLevel: "Level 6 Autonomous Hydro-Pilot", yearOfProduction: "2082" },
      aeroStreamlines: [
        { id: "bow-wave-stream", title: "Hydrofoil Bow Stream", category: "laminar", path: "M 40,260 C 160,220 280,150 440,130 C 620,110 740,170 950,220", hotspot: { x: 38, y: 32 }, label: "Bow Hydro Boundary", value: "Cd 0.16", detail: "Hydrodynamic stream lifting the hull above surface drag.", glowColor: "#06b6d4", strokeWidth: 3.5 },
        { id: "stern-jet-wake", title: "Stern Jet Propulsion Wake", category: "wake", path: "M 700,160 C 760,130 840,130 890,170 C 920,200 890,240 820,220", hotspot: { x: 80, y: 40 }, label: "Jet Thrust Wake", value: "Ultra Smooth", detail: "Zero-turbulence jet output stream.", glowColor: "#10b981", strokeWidth: 4 },
      ],
    },
    {
      vehicleName: "Helios Monolith 2090 Solar-Kinetic GT",
      vehicleType: "Minimalist Solar-Kinetic Monolith",
      designPhilosophy: "Single-volume sculptural architecture powered entirely by continuous solar harvesting and kinetic energy recovery.",
      vehicleConceptSummary: "The Helios Monolith is a sleek, ultra-aerodynamic zero-emission grand tourer designed for seamless coast-to-coast autonomous travel.",
      designLanguage: "Monolithic Geometry: Single continuous glass-and-titanium shell with electrochromic variable opacity and concealed aerodynamic ducts.",
      designDna: [
        { attribute: "Scandinavian Minimalist", percentage: 50 },
        { attribute: "Photovoltaic Solar Tech", percentage: 35 },
        { attribute: "Kinetic Ergonomics", percentage: 15 },
      ],
      exteriorStylingSuggestions: "Satin platinum metallic finish with invisible seam closures, active rear diffuser blades, and full-width LED light ribbons.",
      interiorStylingSuggestions: "Open lounge interior with floating OLED instrument panels, ambient cedar wood trim, and zero-gravity seating.",
      colorPaletteSuggestions: [
        { name: "Platinum Silk", hex: "#e2e8f0", usage: "Main Monocoque" },
        { name: "Obsidian Solar Glass", hex: "#0f172a", usage: "Canopy & Roof" },
        { name: "Forest Emerald", hex: "#10b981", usage: "Ambient Interior Accents" },
        { name: "Copper Anodized", hex: "#b45309", usage: "Wheel Hubs" },
      ],
      materialsList: [
        { name: "Perovskite Photovoltaic Skin", category: "Exterior Body", description: "Ultra-thin solar film capturing 98% of incident sunlight for continuous trickle charging." },
        { name: "Recycled Aerogel Insulation", category: "Cabin Layer", description: "Extreme thermal isolation keeping cabin temperature ambient without AC drag." },
        { name: "Bio-Based Liquid Leather", category: "Interior Seats", description: "Plant-derived leather substitute with natural cooling properties." },
      ],
      materialsRecommendations: "Incorporates perovskite solar skins, aerogel cabin insulation, and recycled aluminum chassis components.",
      aerodynamicsSuggestions: "Continuous laminar canopy airflow feeding into low-drag tail air extraction channels.",
      vehicleStructureRecommendations: "Ultra-rigid aluminum-scandium spaceframe with integrated energy-absorbing crash tubes.",
      sustainabilityRecommendations: "Infinite range solar charging capabilities combined with 100% recyclable interior materials.",
      professionalDesignDescription: "The Helios Monolith presents an visionary alternate-universe concept where clean solar kinetic power defines hyper-luxury touring.",
      sizeComparison: { lengthMeters: "5.2 m", comparedTo: "Proportions comparable to Lucid Air / Polestar Precept", cabinCapacity: "4 Executive Passengers" },
      keySpecs: { topSpeed: "380 km/h / 236 mph", estimatedRange: "1,600 km / 994 mi", dragCoefficient: "Cd 0.13", estimatedHp: "1,450 HP", powertrainType: "Perovskite Solar Solid-State EV", terrainCompatibility: "Transcontinental Highway • Smart City", autonomyLevel: "Level 6 Fully Autonomous", yearOfProduction: "2090" },
      aeroStreamlines: [
        { id: "helios-roof-stream", title: "Monolith Roof Sweep", category: "laminar", path: "M 40,240 C 180,180 380,120 580,140 C 740,160 880,190 960,210", hotspot: { x: 42, y: 30 }, label: "Laminar Solar Canopy Stream", value: "Cd 0.13", detail: "Ultra-smooth air stream passing across the solar skin.", glowColor: "#10b981", strokeWidth: 3.5 },
        { id: "helios-underbody", title: "Diffuser Exit Channel", category: "underbody", path: "M 80,290 C 280,280 580,280 820,270 C 880,260 930,240 980,230", hotspot: { x: 55, y: 75 }, label: "Flat Undertray Venturi", value: "+620 kg Downforce", detail: "Low-drag underbody channel providing high-speed ground stability.", glowColor: "#38bdf8", strokeWidth: 4 },
      ],
    },
    {
      vehicleName: "Valkyrie Apex-0 Hyper-Speedster",
      vehicleType: "Monocoque Open-Cockpit Speedster",
      designPhilosophy: "Stripped of all unnecessary weight to achieve the ultimate 1:1 power-to-weight ratio for pure motorsport sensation.",
      vehicleConceptSummary: "The Valkyrie Apex-0 is an uncompromised open-cockpit hyper-speedster engineered for track records and raw speed.",
      designLanguage: "Aggressive Aero Sculpting: Exposed carbon suspension wishbones, active double-tier rear wing, and halo safety structure.",
      designDna: [
        { attribute: "Le Mans Track Dynamics", percentage: 60 },
        { attribute: "F1 Safety Cell", percentage: 25 },
        { attribute: "Formula E EV Tech", percentage: 15 },
      ],
      exteriorStylingSuggestions: "Raw carbon weave with emerald pinstripes, active airbrake winglets, and central locking magnesium wheels.",
      interiorStylingSuggestions: "Custom-molded carbon bucket seat, telemetry-integrated Yoke steering wheel, and four-point racing harness.",
      colorPaletteSuggestions: [
        { name: "Raw Forged Carbon", hex: "#18181b", usage: "Body & Chassis" },
        { name: "Neon Emerald", hex: "#10b981", usage: "Aero Winglets & Brake Calipers" },
        { name: "Starlight Silver", hex: "#cbd5e1", usage: "Pinstriping" },
      ],
      materialsList: [
        { name: "Forged Carbon Matrix", category: "Bodywork", description: "Ultra-dense composite material engineered for maximum structural rigidity." },
        { name: "Inconel 3D-Printed Exhaust Vents", category: "Heat Shielding", description: "Heat-resistant nickel-chromium alloy for thermal management." },
        { name: "Nomex Flameproof Upholstery", category: "Seat Linings", description: "FIA-grade lightweight fire-resistant cockpit lining." },
      ],
      materialsRecommendations: "Utilizes forged carbon fiber, 3D-printed titanium suspension arms, and Nomex race linings.",
      aerodynamicsSuggestions: "Front splitter air tunnels generating massive downforce over front axle with active rear wing airbrake.",
      vehicleStructureRecommendations: "FIA-homologated carbon-kevlar tub with titanium roll-halo structure.",
      sustainabilityRecommendations: "High-density solid-state battery cells with 99% recyclable energy recovery systems.",
      professionalDesignDescription: "The Valkyrie Apex-0 delivers an exhilarating alternate-universe vision of pure motorsport purity.",
      sizeComparison: { lengthMeters: "4.4 m", comparedTo: "Footprint comparable to Aston Martin Valkyrie / Ferrari Daytona SP3", cabinCapacity: "1 Driver" },
      keySpecs: { topSpeed: "450 km/h / 280 mph", estimatedRange: "600 km / 372 mi", dragCoefficient: "Cd 0.22", estimatedHp: "1,950 HP", powertrainType: "Quad-Motor High-Output EV", terrainCompatibility: "Race Circuit • Trackway", autonomyLevel: "Manual Track Mode • Co-Pilot AI", yearOfProduction: "2078" },
      aeroStreamlines: [
        {
          id: "fly-thrust-fallback",
          title: "Propulsion Spiral Jet Wash",
          category: "wake" as const,
          path: "M 650,180 C 720,140 820,130 880,175 C 920,205 870,245 810,235 C 770,225 790,195 860,190 M 820,210 C 880,210 930,220 980,225",
          hotspot: { x: 82, y: 44 },
          label: "Dual Vectoring Thrust Jet",
          value: "420 m/s Exhaust",
          detail: "Spiral propulsive jet stream exiting rear ion vectoring thrusters for continuous thrust vector control.",
          glowColor: "#10B981",
          strokeWidth: 4,
        },
        {
          id: "fly-canopy-fallback",
          title: "Acoustic Shield Upper Canopy Stream",
          category: "laminar" as const,
          path: "M 60,200 C 180,120 380,110 580,150 C 720,180 850,200 950,210",
          hotspot: { x: 42, y: 32 },
          label: "Canopy Boundary Acoustic Layer",
          value: "Cd 0.14",
          detail: "Smooth curved airflow sweeping over the flight cockpit glazing to suppress acoustic wind rumble.",
          glowColor: "#0bd6d4",
          strokeWidth: 3.5,
        },
        {

         id: "fly-wash-fallback",
         title: "Downward Thrust Wash Vector",
         category: "downforce" as const,
         path: "M 320,220 C 340,280 350,340 370,380 M 680,220 C 700,280 710,340 730,380",
         hotspot: { x: 50, y: 78 },
         label: "Ground Downwash Pressure",
         value: "1450 kg Thrust",
         detail: "High-density thrust stream directed downward for precision vertical hovering and landing stability.",
         glowColor: "#f59e0b",
         strokeWidth: 4,
        },
        {
         id: "fly-tail-fallback",
         title: "Aft Stabilization Slipstream",
         category: "wake" as const,
         path: "M 620,160 C 720,180 820,190 950,195",
         hotspot: { x: 78, y: 45 },
         label: "Rear Wake Suppression",
         value: "Vortex Suppressed",
         detail: "Clean separation of trailing air behind vertical tail fins preventing aerodynamic turbulence.",
         glowColor: "#38bdf8",
         strokeWidth: 3,
        }
      ],
    },
  ];

// Helper to generate procedurally unique aerodynamic streamlines based on archetype, proportions, and seed
function generateProceduralStreamlines(params: {
  vehicleType: string;
  brandInspiration: string;
  customPrompt: string;
  seedNum: number;
  cdVal: string;
}) {
  const { vehicleType, brandInspiration, customPrompt, seedNum, cdVal } = params;
  const promptLower = (customPrompt || "").toLowerCase();
  const typeLower = (vehicleType || "").toLowerCase();

  const isFlying = promptLower.includes("flying") || promptLower.includes("vtol") || promptLower.includes("drone") || typeLower.includes("vtol") || typeLower.includes("flying");
  const isUnderwater = promptLower.includes("underwater") || promptLower.includes("submarine") || promptLower.includes("ocean") || typeLower.includes("ocean") || typeLower.includes("amphibious");
  const isMars = promptLower.includes("mars") || promptLower.includes("rover") || typeLower.includes("rover") || typeLower.includes("off-road") || typeLower.includes("truck");
  const isSpeedster = typeLower.includes("speedster") || typeLower.includes("racing") || typeLower.includes("hypercar") || typeLower.includes("track");
  const isPod = typeLower.includes("pod") || typeLower.includes("micro") || typeLower.includes("shuttle");

  const colors = ["#10b981", "#06b6d4", "#38bdf8", "#f59e0b", "#a855f7", "#ec4899", "#34d399", "#f43f5e"];
  const colorAt = (offset: number) => colors[(seedNum + offset) % colors.length];

  if (isFlying) {
    return [
      {
        id: `fly-lift-${seedNum}`,
        title: "Vectoring Rotor Lift Vortex",
        category: "lift" as const,
        path: "M 180,180 C 200,100 320,90 340,150 C 350,190 280,230 220,190 C 190,165 210,130 280,135",
        hotspot: { x: 28, y: 24 },
        label: "Ducted Rotor Suction Spiral",
        value: `+${820 + (seedNum % 300)} kg Lift`,
        detail: "Low-pressure spiral suction vortex generated by high-speed counter-rotating ducted rotor shrouds.",
        glowColor: colorAt(0),
        strokeWidth: 3.5,
      }
    ];
  }  //


if (isUnderwater) {
   return [
    {
      id: `sub-hydro-${seedNum}`,
      title: "Hydrodynamic Bow Pressure Wave",
      category: "laminar" as const,
      path: "M 50,220 C 180,160 380,150 560,180 C 700,200 840,220 950,230",
      hotspot: { x: 22, y: 40 },
      label: "Bow Displacement Stream",
      value: "Zero Cavitation",
      detail: "Sleek fluid displacement curve hugging the titanium dome to minimize underwater drag.",
      glowColor: colorAt(0),
      strokeWidth: 4,
    },
    {
      id: `sub-hull-${seedNum}`,
      title: "Sub-surface Hull Boundary Layer",
      category: "laminar" as const,
      path: "M 100,250 C 280,230 520,230 760,250 C 860,260 920,265 970,270",
      hotspot: { x: 52, y: 62 },
      label: "Fluid Surface Attachment",
      value: "Laminar Flow",
      detail: "Continuous hydrodynamic fluid flow attached to outer hull ribbing for silent cruising.",
      glowColor: colorAt(1),
      strokeWidth: 3.5,
    },
    {
      id: `sub-jet-${seedNum}`,
      title: "MHD Hydrojet Propulsion Swirl",
      category: "wake" as const,
      path: "M 720,200 C 780,180 840,170 880,210 C 910,240 860,270 800,260 M 820,240 C 870,240 920,230 970,240",
      hotspot: { x: 84, y: 55 },
      label: "MHD Hydrojet Thrust Wave",
      value: "Silent Propulsive Jet",
      detail: "Magnetohydrodynamic fluid thrust expelled in a tight vortex for acoustic stealth.",
      glowColor: colorAt(2),
      strokeWidth: 4,
    },
    {
      id: `sub-keel-${seedNum}`,
      title: "Stabilizing Hydrofoil Keel Flow",
      category: "underbody" as const,
      path: "M 120,290 C 320,285 580,285 820,295",
      hotspot: { x: 48, y: 76 },
      label: "Underbody Keel Channel",
      value: "Low Pressure Drag",
      detail: "High-density underwater current guided through lower keel channels to stabilize deep ocean rolls.",
      glowColor: colorAt(3),
      strokeWidth: 3,
    },
  ];
}

if (isMars) {
  return [
    {
      id: `rover-arch-${seedNum}`,
      title: "Fender & Wheel Arch Debris Venting",
      category: "cooling" as const,
      path: "M 180,280 C 220,220 280,220 310,270 C 330,300 370,300 420,280",
      hotspot: { x: 25, y: 68 },
      label: "Arch Pressure Relief",
      value: `${420 + (seedNum % 150)} L/s Airflow`,
      detail: "Dust and high-speed trail air flushed through rugged front wheel arches and emitted along side armor.",
      glowColor: colorAt(0),
      strokeWidth: 3.5,
    },
    {
      id: `rover-hood-${seedNum}`,
      title: "Rugged Hood Dust Deflector Stream",
      category: "laminar" as const,
      path: "M 60,260 C 180,240 280,180 420,150 C 580,120 720,180 940,230",
      hotspot: { x: 28, y: 48 },
      label: "Debris & Wind Curtain",
      value: "Deflection Shield",
      detail: "High-angle boundary stream lifting dune dust and storm debris clear of windscreen glazing.",
      glowColor: colorAt(1),
      strokeWidth: 3.5,
    },
    {
      id: `rover-skid-${seedNum}`,
      title: "High-Clearance Skidplate Channel",
      category: "underbody" as const,
      path: "M 100,320 C 300,315 600,315 920,330",
      hotspot: { x: 50, y: 84 },
      label: "Underbody Venturi Channel",
      value: "Armored Protection",
      detail: "Smooth flat-bottom skidplate guiding air around heavy suspension wishbones to prevent mud snagging.",
      glowColor: colorAt(2),
      strokeWidth: 4,
    },
    {
      id: `rover-roof-${seedNum}`,
      title: "Roof Rack Cargo Vortex Suppression",
      category: "wake" as const,
      path: "M 360,150 C 500,120 680,130 780,200 C 840,240 890,260 960,270",
      hotspot: { x: 62, y: 32 },
      label: "Roof Cargo Flow Channel",
      value: "-18% Drag Coefficient",
      detail: "Curved flow over roof cargo storage channel reuniting smoothly with rear tailgate spoiler.",
      glowColor: colorAt(3),
      strokeWidth: 3,
    },
  ];
}

if (isSpeedster) {
  return [
    {
      id: `speed-venturi-${seedNum}`,
      title: "Ground-Effect Venturi Suction Tunnel",
      category: "underbody" as const,
      path: "M 70,300 C 250,295 550,295 800,290 C 860,285 910,260 960,250",
      hotspot: { x: 48, y: 78 },
      label: "Underbody Ground Effect",
      value: `+${680 + (seedNum % 250)} kg Downforce`,
      detail: "High-velocity low-pressure suction tunnel accelerating underbody airflow for glued-to-track cornering.",
      glowColor: colorAt(0),
      strokeWidth: 4.5,
    },
    {
      id: `speed-wing-${seedNum}`,
      title: "Active Wing Downforce Airbrake Swirl",
      category: "downforce" as const,
      path: "M 700,160 C 760,130 840,130 890,170 C 920,200 890,240 820,220 M 800,190 C 860,180 920,190 970,210",
      hotspot: { x: 84, y: 38 },
      label: "Morphing Rear Wing Swirl",
      value: `+${820 + (seedNum % 300)} kg @ 320 km/h`,
      detail: "High-density downforce vortex generated by active carbon rear wing flaps during cornering.",
      glowColor: colorAt(1),
      strokeWidth: 4,
    },
    {
      id: `speed-canopy-${seedNum}`,
      title: "Open-Cockpit Virtual Windscreen Air Curtain",
      category: "laminar" as const,
      path: "M 40,260 C 160,220 280,150 440,130 C 620,110 740,170 950,220",
      hotspot: { x: 32, y: 35 },
      label: "Virtual Windscreen Air Stream",
      value: `Cd ${cdVal}`,
      detail: "Active aerodynamic air blade over the front cowl creating a high-speed protective wind barrier.",
      glowColor: colorAt(2),
      strokeWidth: 3.5,
    },
    {
      id: `speed-brake-${seedNum}`,
      title: "Brake Caliper Thermal Pressure Relief",
      category: "cooling" as const,
      path: "M 120,270 C 180,210 250,210 290,265 C 310,290 350,280 410,250",
      hotspot: { x: 22, y: 58 },
      label: "Front Arch Pressure Venting",
      value: `${480 + (seedNum % 180)} L/s Cooling`,
      detail: "Air pressure accumulated in front brake ducting is smoothly extracted over side carbon blades.",
      glowColor: colorAt(3),
      strokeWidth: 3,
    },
    {
      id: `speed-diffuser-${seedNum}`,
      title: "Rear Diffuser Low-Pressure Drag Kill",
      category: "wake" as const,
      path: "M 810,260 C 870,265 920,255 980,245",
      hotspot: { x: 88, y: 68 },
      label: "Diffuser Wake Neutralizer",
      value: "Zero Drag Vortex",
      detail: "Smoothly reuniting top canopy air with underbody exhaust to eliminate trailing low-pressure drag.",
      glowColor: colorAt(4),
      strokeWidth: 3,
    },
  ];
}

// DEFAULT LUXURY / GT / MONOLITH
return [
  {
    id: `lux-roof-${seedNum}`,
    title: `${brandInspiration} Roofline Laminar Sweep`,
    category: "laminar" as const,
    path: "M 40,260 C 160,220 280,150 440,130 C 620,110 740,170 950,220",
    hotspot: { x: 38, y: 32 },
    label: "Roof Boundary Layer Sweep",
    value: `Cd ${cdVal}`,
    detail: "Single-stroke unbroken airflow hugging the electrochromic glass canopy for serene cabin quietness.",
    glowColor: colorAt(0),
    strokeWidth: 4,
  },
  {
    id: `lux-side-${seedNum}`,
    title: "Waistline Body Laminar Flow",
    category: "laminar" as const,
    path: "M 100,270 C 300,250 550,250 800,265 C 880,270 930,265 970,260",
    hotspot: { x: 55, y: 58 },
    label: "Side Door Air Attachment",
    value: "Laminar Glide",
    detail: "Ultra-clean air attachment along the waistline eliminating side mirror turbulent drag.",
    glowColor: colorAt(1),
    strokeWidth: 3.5,
  },
  {
    id: `lux-under-${seedNum}`,
    title: "Low-Drag Smooth Underbody Channel",
    category: "underbody" as const,
    path: "M 70,300 C 250,295 550,295 800,290 C 860,285 910,260 960,250",
    hotspot: { x: 48, y: 78 },
    label: "Flat Undertray Air Sweep",
    value: `+${480 + (seedNum % 200)} kg Stability`,
    detail: "Encapsulated smooth undertray directing air around solid-state battery housing for high-speed stability.",
    glowColor: colorAt(2),
    strokeWidth: 3.5,
  },
  {
    id: `lux-wake-${seedNum}`,
    title: "Rear Tail Wake Detachment Layer",
    category: "wake" as const,
    path: "M 700,160 C 760,130 840,130 890,170 C 920,200 890,240 820,220 M 810,260 C 870,265 920,255 980,245",
    hotspot: { x: 84, y: 38 },
    label: "Tail Vortex Suppression",
    value: "Zero Turbulence",
    detail: "Active rear diffuser blades separating trailing air smoothly to prevent rear suction drag.",
    glowColor: colorAt(3),
    strokeWidth: 3,
  },
];
}

// Robust procedural automotive concept name generator ensuring unique, professional, futuristic names
function generateFuturisticVehicleName(
  brandInspiration: string,
  vehicleType: string,
  year: string,
  customPrompt: string,
  seedNum: number
): string {
  const brandClean = (brandInspiration && brandInspiration !== "Custom Atelier" && brandInspiration !== "Atelier Concept")
    ? brandInspiration
    : "";

  const primarySeries = [
    "Vision", "Project", "Codex", "Prototype", "Concept", "Series", "Aetheris", "Valkyrie",
    "Aegis", "Chronos", "Hyperion", "Spectre", "Zephyr", "Elysium", "Obsidian", "Zenith",
    "Monolith", "Lumina", "Vortex", "Prism", "Quantum", "Continuum", "Helix", "Synergy",
    "Talisman", "Apex", "Kinetix", "AeroBlade", "Pinnacle", "AeroLuxe", "Astral", "Veloce",
    "Strata", "Aura", "Solstice", "Meridian", "Pulsar", "Orbital", "Solus", "Stratos",
    "Valhalla", "Nevera", "Battista", "Mission-X", "Hommage", "Talisman", "Synergy",
    "AeroDyn", "Polymath", "Synthesis", "Venturi"
  ];

  const modelDesignators = [
    "GT-X", "Type-01", "Phase-II", "EV-1", "Vision Next", "Spec-Aero", "Monocoque-1",
    "Codex-9", "Pro-GT", "Aero-V", "Zero-GT", "Mach-1", "R-2080", "Concept-S", "Series-X",
    "Mod-V", "Strato-GT", "Apex-8", "K-1000", "Cyber-GT", "Hyper-V", "E-Luxe", "Quantum-1",
    "Mach-X", "Strato-1", "Solus-GT", "Veloce-8", "Genesis-X", "Aero-9", "Prime-EV"
  ];

  // Pick unique selections using seedNum
  const pIndex = Math.abs(seedNum * 13 + 7) % primarySeries.length;
  const mIndex = Math.abs(seedNum * 29 + 11) % modelDesignators.length;

  const series = primarySeries[pIndex];
  const designator = modelDesignators[mIndex];

  // Extract meaningful keyword if present in customPrompt (excluding common prompt stop words)
  let keyword = "";
  if (customPrompt && typeof customPrompt === "string") {
    const stopWords = new Set([
      "make", "a", "car", "please", "generate", "with", "and", "for", "the", "in", "like", "vehicle",
      "concept", "auto", "drive", "build", "show", "me", "new", "design", "that", "is", "looks", "futuristic", "style"
    ]);
    const cleanedWords = customPrompt
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()));

    if (cleanedWords.length > 0) {
      keyword = cleanedWords[0].charAt(0).toUpperCase() + cleanedWords[0].slice(1).toLowerCase();
    }
  }

  // Assemble name depending on brand and extracted keyword
  if (brandClean) {
    if (keyword && keyword.toLowerCase() !== brandClean.toLowerCase()) {
      return `${brandClean} ${series} '${keyword}' ${designator}`;
    }
    return `${brandClean} ${series} ${designator}`;
  } else {
    if (keyword) {
      return `${series} '${keyword}' ${designator} (${year})`;
    }
    const cleanType = vehicleType.replace(/\s+/g, '');
    return `${series} ${cleanType} ${designator} (${year})`;
  }
}

// Helper to generate dynamic studio fallback report when API quota is exhausted
function generateStudioFallbackReport(params: {
  vehicleType: string;
  year: string;
  designStyle: string;
  brandInspiration: string;
  targetAudience: string;
  countryMarket: string;
  customPrompt?: string;
  isRespin?: boolean;
}) {
  const vehicleType = params.vehicleType || "Hypercar";
  const year = params.year || "2075";
  const designStyle = params.designStyle || "Futuristic";
  const brandInspiration = params.brandInspiration || "Atelier Concept";
  const targetAudience = params.targetAudience || "Next-Gen Commuters";
  const countryMarket = params.countryMarket || "Global Metropolises";
  const customPrompt = params.customPrompt || "";
  const isRespin = Boolean(params.isRespin);

  // Seed variation factor based on time and input string hash with random salt to guarantee uniqueness every call
  const randomSalt = Math.floor(Math.random() * 1000000) + Date.now();
  const seedStr = `${vehicleType}_${year}_${brandInspiration}_${customPrompt}_${randomSalt}`;
  let seedNum = randomSalt;
  for (let i = 0; i < seedStr.length; i++) {
    seedNum += seedStr.charCodeAt(i);
  }
  const randVal = (min: number, max: number) => Math.floor(min + ((seedNum * 9301 + 49297) % 233280) / 233280 * (max - min));

  // Generate fresh dynamic professional name
  const freshName = generateFuturisticVehicleName(brandInspiration, vehicleType, year, customPrompt, seedNum);

  // If respin is requested in fallback mode, generate a completely procedurally unique concept every time!
  if (isRespin) {
    const randomAngle = RESPIN_ANGLE_VARIATIONS[Math.floor(Math.random() * RESPIN_ANGLE_VARIATIONS.length)];
    const randomArchetype = RESPIN_FALLBACK_ARCHETYPES[Math.floor(Math.random() * RESPIN_FALLBACK_ARCHETYPES.length)];

   return {
      ...randomArchetype,
      vehicleName: freshName,
      designPhilosophy: `Alternate universe concept engineered around ${randomAngle.toLowerCase()} for ${countryMarket}.`,
      vehicleConceptSummary: `An autonomous ${designStyle.toLowerCase()} ${vehicleType.toLowerCase()} concept designed around the vision: "${randomAngle}".`,
      keySpecs: {
        ...randomArchetype.keySpecs,
        topSpeed: `${420 + (seedNum % 160)} km/h / ${Math.round((420 + (seedNum % 160)) * 0.621371)} mph`,
        range: `${(1800 + (seedNum % 1200)).toLocaleString()} km / ${Math.round((1800 + (seedNum % 1200)) * 0.621371).toLocaleString()} mi`,
        estimatedHp: `${(1200 + (seedNum % 1500)).toLocaleString()} HP`,
        zeroToSixty: `${(1.1 + (seedNum % 15) / 10).toFixed(2)}s (0-60 mph)`,
        yearOfProduction: year || randomArchetype.keySpecs.yearOfProduction || "2085",
      }
    };
  } 

  const promptLower = customPrompt.toLowerCase();
  const typeLower = vehicleType.toLowerCase();

  const isMars = promptLower.includes("mars") || promptLower.includes("planet") || promptLower.includes("rover") || typeLower.includes("rover") || typeLower.includes("off-road") || typeLower.includes("exploration");
  const isFlying = promptLower.includes("flying") || promptLower.includes("vtol") || promptLower.includes("drone") || typeLower.includes("vtol") || typeLower.includes("flying") || typeLower.includes("sky");
  const isUnderwater = promptLower.includes("underwater") || promptLower.includes("submarine") || promptLower.includes("ocean") || typeLower.includes("ocean") || typeLower.includes("amphibious") || typeLower.includes("sub");
  const isPod = typeLower.includes("pod") || typeLower.includes("micro") || typeLower.includes("city") || typeLower.includes("commuter");
  const isSpeedster = typeLower.includes("speedster") || typeLower.includes("open") || typeLower.includes("track") || typeLower.includes("racing") || typeLower.includes("hypercar");
  const isLounge = typeLower.includes("lounge") || typeLower.includes("limo") || typeLower.includes("grand") || typeLower.includes("luxury");
  const isBus = promptLower.includes("bus") || promptLower.includes("shuttle") || promptLower.includes("transit") || typeLower.includes("bus") || typeLower.includes("shuttle");
  const isSpace = promptLower.includes("space") || promptLower.includes("orbital") || promptLower.includes("cruiser") || typeLower.includes("space") || typeLower.includes("orbital");

  // Dynamic naming
  const conceptTitle = freshName;

  // Dynamic Size, Benchmark, Capacity matching concept scale
  let lengthMeters = `${(4.8 + (seedNum % 8) / 10).toFixed(1)} m`;
  let comparedTo = `Footprint comparable to ${brandInspiration} GT Flagship & McLaren W1`;
  let cabinCapacity = "2 Executive Passengers";

  if (isPod) {
    lengthMeters = `${(2.3 + (seedNum % 5) / 10).toFixed(1)} m`; // ~2.5m
    comparedTo = "Designed for narrow Tokyo megacity lanes (similar to Citroën Ami / Mini Vision)";
    cabinCapacity = "2 Urban Commuters";
  } else if (isSpeedster) {
    lengthMeters = `${(4.2 + (seedNum % 5) / 10).toFixed(1)} m`; // ~4.3m
    comparedTo = "Proportions larger than current Le Mans prototypes & comparable to Ferrari Daytona SP3";
    cabinCapacity = "1 Driver";
  } else if (isLounge) {
    lengthMeters = `${(6.8 + (seedNum % 6) / 10).toFixed(1)} m`; // ~7.0m
    comparedTo = "Occupies the footprint of a modern studio apartment; cabin comparable to a private executive jet";
    cabinCapacity = "4-6 Executive Reclining Armchairs";
  } else if (isFlying) {
    lengthMeters = `${(7.8 + (seedNum % 6) / 10).toFixed(1)} m`; // ~8.0m
    comparedTo = "Wingspan & cabin volume comparable to a private executive jet cabin / Archer Midnight eVTOL";
    cabinCapacity = "1 Pilot + 3 Executive Passengers";
  } else if (isUnderwater) {
    lengthMeters = `${(8.8 + (seedNum % 6) / 10).toFixed(1)} m`; // ~9.0m
    comparedTo = "Similar in size to a luxury yacht tender / Triton 3300 Submersible";
    cabinCapacity = "4 Passengers + Deep-Sea Gear";
  } else if (isMars) {
    lengthMeters = `${(10.8 + (seedNum % 6) / 10).toFixed(1)} m`; // ~11.0m
    comparedTo = "Built for Martian exploration outposts; heavy expedition footprint larger than Oshkosh JLTV";
    cabinCapacity = "6 Crew Members + Scientific Equipment";
  } else if (isBus) {
    lengthMeters = `${(11.8 + (seedNum % 6) / 10).toFixed(1)} m`; // ~12.0m
    comparedTo = "Occupies the footprint of a modern studio apartment; mass transit scale comparable to Mercedes Future Bus";
    cabinCapacity = "16 Passengers + Lounge Seating";
  } else if (isSpace) {
    lengthMeters = `${(14.8 + (seedNum % 8) / 10).toFixed(1)} m`; // ~15.0m
    comparedTo = "Orbital hull scale comparable to a private executive jet cabin / SpaceX Starship shuttle";
    cabinCapacity = "8 Passengers + Zero-G Pods";
  }

  // Dynamic Specs & Randomization Arrays
  const wheelConfigs = [
    "4-Wheel Magnetic Hubless Drives",
    "6-Wheel Articulated Planetary Crawler",
    "Dual-Rotor Ducted VTOL Thruster Pods",
    "Hydrofoil Retractable Glide Skids",
    "2-Wheel Gyroscopic Monowheel Balancer",
    "8-Wheel Omni-Directional Planetary Tread",
    "Magnetic Levitation Linear Induction Skids",
    "3-Wheel Delta Reverse Trike Array",
  ];

  const seatingLayouts = [
    "1 Central Jet Fighter Pilot Cockpit",
    "2 Tandem High-G Ergonomic Seats",
    "4 Executive Face-to-Face Club Armchairs",
    "2 Side-by-Side Zero-G Floating Pods",
    "6 Hexagonal Modular Command Seats",
    "16 Perimeter Autonomous Lounge Bench",
    "1 Pilot + 3 Asymmetric Passenger Pods",
  ];

  const powertrains = [
    "Quad-Motor Quantum Solid-State EV",
    "Nuclear-Isotope Thermoelectric Generator",
    "Direct Plasma Fusion Thruster Array",
    "Bio-Synthetic Algae Hydrogen Fuel Cell",
    "Magnetohydrodynamic Induction Hydro-Drive",
    "Dual-Vector Ion Thruster Propulsion",
    "Graphene Ultra-Capacitor Flash Drive",
  ];

  const lightingSignatures = [
    "Monolithic Edge-to-Edge Emerald LED Blade",
    "Holographic Light-Field Projection Bar",
    "Bio-Luminescent Parametric Skin Veins",
    "Pixel-Matrix Dynamic Adaptive Beam",
    "Cybernetic Dual-Streak Kinetic DRL",
  ];

  const cabinArchitectures = [
    "Monolithic Single-Stroke Glass Canopy",
    "Modular Telescoping Pressurized Habitat",
    "Panoramic Electrochromic Hydro-Dome",
    "Gullwing Dual-Stage Kinetic Shell",
    "Sub-Orbital Shielded Ergonomic Capsule",
  ];

  const technologiesList = [
    "Brain-Computer Interface Direct Neural Drive",
    "Active Boundary Layer Micro-Jet Vectoring",
    "Holographic Spatial HUD & Co-Pilot AI",
    "Phase-Change Thermal Aerogel Shield",
    "Acoustic Noise-Cancellation Canopy Matrix",
  ];

  const chosenWheel = wheelConfigs[seedNum % wheelConfigs.length];
  const chosenSeating = seatingLayouts[seedNum % seatingLayouts.length];
  const chosenPowertrain = powertrains[seedNum % powertrains.length];
  const chosenLighting = lightingSignatures[seedNum % lightingSignatures.length];
  const chosenCabin = cabinArchitectures[seedNum % cabinArchitectures.length];
  const chosenTech = technologiesList[seedNum % technologiesList.length];

  let topSpeedKmh = 380 + (seedNum % 160);
  if (isPod) topSpeedKmh = 140 + (seedNum % 60);
  if (isMars) topSpeedKmh = 220 + (seedNum % 80);
  if (isFlying) topSpeedKmh = 480 + (seedNum % 140);
  if (isSpeedster) topSpeedKmh = 440 + (seedNum % 110);
  const topSpeedMph = Math.round(topSpeedKmh * 0.621371);

  let rangeKm = 750 + (seedNum % 900);
  const rangeMi = Math.round(rangeKm * 0.621371);

  const hpVal = 1100 + (seedNum % 1200);
  const cdVal = (0.12 + (seedNum % 22) / 100).toFixed(2);

  // Dynamic DNA Mix
  const dnaMix = [
    { attribute: `${brandInspiration} Heritage`, percentage: 45 + (seedNum % 15) },
    { attribute: `${designStyle} Design Language`, percentage: 30 + (seedNum % 10) },
    { attribute: `${countryMarket} Aesthetic Influence`, percentage: 100 - (45 + (seedNum % 15)) - (30 + (seedNum % 10)) },
  ];

  // Dynamic Materials
  const materialsList = [
    {
      name: isFlying ? "Titanium-Graphene Honeycomb" : isMars ? "Ceramic-Matrix Armor" : "Bio-Engineered Carbon Weave",
      category: "Structural Monocoque",
      description: "Next-gen ultra-lightweight carbon weave maximizing torsional rigidity.",
    },
    {
      name: "Perovskite Photovoltaic Glazing",
      category: "Canopy & Glass",
      description: "Auto-tinting solar glass providing instant climate control and ambient energy harvesting.",
    },
    {
      name: "Recycled Mycelium Leather",
      category: "Cockpit Interior",
      description: "Organic, zero-carbon seating material offering high tactile luxury.",
    },
    {
      name: isMars ? "Airless Shape-Memory Alloy Tread" : "Self-Healing Shape-Memory Surface Skin",
      category: "Exterior Surfaces",
      description: "Adaptive outer surface engineered to maintain pristine aerodynamic smoothness.",
    },
  ];

  const wowFeatures = [
    {
      title: "Retractable Transparent Quartz Wheels",
      category: "Chassis & Propulsion",
      description: "Magnetically levitated rimless transparent quartz rollers that retract into the monocoque bodywork during high-speed flight or maglev mode.",
      impact: "Reduces unsprung wheel mass by 65% while converting kinetic rotation into battery charge.",
    },
    {
      title: "Adaptive Bio-Luminescent Reactive Skin",
      category: "Exterior Materials",
      description: "Surface paint embedding synthetic bioluminescent algae micro-cells that pulse and shift hue in real-time based on velocity, g-force, and energy flow.",
      impact: "Provides active visual telemetry to surrounding traffic with zero power draw.",
    },
    {
      title: "Shape-Shifting Morphing Aerodynamic Boundary Surfaces",
      category: "Active Aerodynamics",
      description: "Memory-alloy outer panels that dynamically deform, extending venturi tunnels or airbrakes seamlessly without mechanical hinges.",
      impact: "Continuously optimizes Drag Coefficient from Cd 0.12 to Cd 0.38 on demand.",
    },
    {
      title: "AI Biometric Emotional Lighting & Sensory Harmony",
      category: "Interior & UX",
      description: "Interior light-field projectors and scent diffusers synchronized with occupant heart rate and neural stress levels via optical steering sensors.",
      impact: "Eliminates driver fatigue and maintains calm acoustic harmony during transit.",
    },
    {
      title: "Perovskite Solar Energy Harvesting Outer Skin",
      category: "Energy Generation",
      description: "Flexible ultra-thin solar skin integrated directly into carbon-fiber panels, harvesting ambient sunlight and city light pollution.",
      impact: "Adds up to 65 km of clean self-generated range per day without grid connection.",
    },
    {
      title: "Autonomous Airborne Scout Drone ('Sky-Scout')",
      category: "Auxiliary Robotics",
      description: "An integrated mini reconnaissance drone housed in the rear cowl that launches on command to map off-road terrain or scout traffic jams.",
      impact: "Provides real-time 3D spatial mapping and aerial photography directly to HUD.",
    },
    {
      title: "Magnetic Levitation High-Speed Glide Mode",
      category: "Drivetrain",
      description: "Underbody linear induction coils that allow the vehicle to lock onto magnetic highway lanes and glide frictionlessly at 500+ km/h.",
      impact: "Near-zero rolling friction for ultra-efficient intercity corridor cruising.",
    },
    {
      title: "Ocean Micro-Purification Hydrojet Propulsion",
      category: "Eco Propulsion",
      description: "Micro-filtration water intakes that scrub microplastics and toxins from water bodies while generating high-thrust jet propulsion.",
      impact: "Purifies up to 10,000 liters of water per hour of sub-surface cruising.",
    },
    {
      title: "Living Mycelium Bio-Material Self-Cleaning Upholstery",
      category: "Sustainable Cabin",
      description: "Organically grown living mycelium leather seats that absorb moisture, self-repair minor scuffs, and naturally purify cabin air.",
      impact: "100% biodegradable cabin materials with active air purification.",
    },
  ];

  const chosenWowFeature = wowFeatures[seedNum % wowFeatures.length];

  return {
    vehicleName: conceptTitle,
    designPhilosophy: `Engineered at the intersection of ${brandInspiration} legacy and ${year} transport requirements in ${countryMarket}, this ${vehicleType.toLowerCase()} balances emotional sculpting with uncompromising efficiency.`,
    vehicleConceptSummary: `The ${conceptTitle} is an advanced ${designStyle.toLowerCase()} ${vehicleType.toLowerCase()} designed for ${targetAudience}. ${customPrompt ? `Created specifically around the user vision: "${customPrompt}". ` : ""}It integrates ${chosenWheel}, a ${chosenCabin}, and ${chosenTech} for complete mobility freedom.`,
    designLanguage: `${designStyle} Kinetic Monolith: Defined by ${chosenLighting}, ${chosenCabin}, and single-stroke aerodynamic surfaces.`,
    signatureWowFeature: chosenWowFeature,
    designDna: dnaMix,
    exteriorStylingSuggestions: `Sculpted silhouette featuring ${chosenLighting}, ${chosenWheel}, and flush optical camera pods replacing physical mirrors.`,
    interiorStylingSuggestions: `Ergonomic cabin featuring ${chosenSeating}, floating holographic HUD, ambient floor light ribbons, and sustainable bio-leather seating.`,
    colorPaletteSuggestions: [
      { name: "Obsidian Slate", hex: "#1c2420", usage: "Main Structural Monocoque" },
      { name: "Emerald Ion", hex: "#10b981", usage: "Aero Accents & Brake Calipers" },
      { name: "Anodized Platinum", hex: "#a8b2a9", usage: "Wheel Ribs & Canopy Trim" },
      { name: "Nordic Mist", hex: "#e2e8f0", usage: "Interior Upholstery Highlights" },
    ],
    materialsList: materialsList,
    materialsRecommendations: `Constructed using bio-engineered carbon fiber, electrochromic photovoltaic glazing, and recycled organic interior textiles.`,
    aerodynamicsSuggestions: `Underbody venturi channels generating low-pressure ground effect suction with active flap trim adjustments to minimize drag.`,
    vehicleStructureRecommendations: `Ultra-rigid carbon-titanium safety cell with integrated crash-absorbing honeycomb zones and solid-state floor module.`,
    sustainabilityRecommendations: `100% recyclable structural composites paired with zero-emission electric powertrain and solar-harvesting outer skin.`,
    professionalDesignDescription: `The ${conceptTitle} presents a studio-grade vision of mobility for ${year}, combining emotional automotive styling with rigorous technical aerodynamic execution.`,
    sizeComparison: {
      lengthMeters: lengthMeters,
      comparedTo: comparedTo,
      cabinCapacity: `${cabinCapacity} (${chosenSeating})`,
    },
    keySpecs: {
      topSpeed: `${topSpeedKmh} km/h / ${topSpeedMph} mph`,
      range: `${rangeKm.toLocaleString()} km / ${rangeMi.toLocaleString()} mi`,
      dragCoefficient: `Cd ${cdVal}`,
      estimatedHp: `${hpVal.toLocaleString()} HP`,
      powertrainType: chosenPowertrain,
      zeroToSixty: `${(1.2 + (seedNum % 15) / 10).toFixed(2)}s (0-60 mph)`,
      chassisMaterial: isFlying ? "Titanium-Graphene Composite Monocoque" : isMars ? "Ceramic-Titanium Matrix Safety Cell" : "Forged Carbon-Fiber Monocoque",
      passengers: cabinCapacity,
      terrainCompatibility: isMars ? "Mars Surface • Dune Tracks" : isUnderwater ? "Ocean Depth • Coastal" : isFlying ? "Low-Air Corridors • Urban Skyways" : "Autobahn • Smart City Corridors",
      autonomyLevel: "Level 6 Fully Autonomous",
      yearOfProduction: year,
    },
    aeroStreamlines: generateProceduralStreamlines({
      vehicleType,
      brandInspiration,
      customPrompt,
      seedNum,
      cdVal,
    }),
  };
}

const VEHICLE_TYPES_LIST = [
  "Urban eVTOL Ground Hybrid",
  "Amphibious Hydro-Aero",
  "Off-Road Rover",
  "Electric Monocoque SUV",
  "Compact Urban Pod",
  "Track Speedster",
  "Luxury Shooting Brake",
  "Autonomous Lounge",
  "Gran Turismo",
  "Hypercar",
];

const YEARS_LIST = [
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

const DESIGN_STYLES_LIST = [
  "Cyberpunk",
  "Kinetic Sculpture",
  "Parametric / Bio-Organic",
  "Retro-Futurism",
  "Minimalist Brutalism",
  "Aerodynamic Streamline",
  "Luxury / Grand Touring",
  "Sci-Fi Industrial",
];

const BRAND_INSPIRATIONS_LIST = [
  "Porsche",
  "Bugatti",
  "Ferrari",
  "Lamborghini",
  "Tesla",
  "Aston Martin",
  "Rimac",
  "Lotus",
  "Genesis",
  "Koenigsegg",
  "Lucid Motors",
  "Custom Atelier",
];

const TARGET_AUDIENCES_LIST = [
  "Next-Gen Commuters",
  "Young Professionals",
  "Track Enthusiasts",
  "High-Net-Worth Collectors",
  "Eco-Luxury Nomads",
  "Autonomous Fleet Passengers",
];

const COUNTRY_MARKETS_LIST = [
  "Nordic / Sweden",
  "Japan",
  "Italy",
  "Germany",
  "United States",
  "UAE & Middle East",
  "Singapore",
  "Global Metropolises",
];

function getRandomOption<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

// API endpoint to generate an automotive concept report
app.post("/api/generate-concept", async (req, res) => {
  const {
    vehicleType: rawVehicleType,
    year: rawYear,
    designStyle: rawDesignStyle,
    brandInspiration: rawBrandInspiration,
    targetAudience: rawTargetAudience,
    countryMarket: rawCountryMarket,
    customPrompt = "",
    isRespin = false,
  } = req.body || {};

  // Parse custom prompt for semantic matches across all categories (only when NOT respinning)
  const hasPrompt = !isRespin && customPrompt && typeof customPrompt === "string" && customPrompt.trim().length > 2;
  const promptInferred = hasPrompt ? inferConceptFromPrompt(customPrompt) : {};

  // Determine concept parameters (Priority: Prompt Inferred (non-respin) > Respin Random > User Selection > Fallback Default)
  let vehicleType = isRespin ? getRandomOption(VEHICLE_TYPES_LIST) : (promptInferred.vehicleType || rawVehicleType || "Hypercar");
  let year = isRespin ? getRandomOption(YEARS_LIST) : (promptInferred.year || rawYear || "2075");
  let designStyle = isRespin ? getRandomOption(DESIGN_STYLES_LIST) : (promptInferred.designStyle || rawDesignStyle || "Sci-Fi Industrial");
  let brandInspiration = isRespin ? getRandomOption(BRAND_INSPIRATIONS_LIST) : (promptInferred.brandInspiration || rawBrandInspiration || "Custom Atelier");
  let targetAudience = isRespin ? getRandomOption(TARGET_AUDIENCES_LIST) : (promptInferred.targetAudience || rawTargetAudience || "Next-Gen Commuters");
  let countryMarket = isRespin ? getRandomOption(COUNTRY_MARKETS_LIST) : (promptInferred.countryMarket || rawCountryMarket || "Global Metropolises");

  // Models to attempt in order of preference (using standard models)
  const MODELS_TO_TRY = ["gemini-3.6-flash", "gemini-3.6-flash-lite"];

  const randomAngle = RESPIN_ANGLE_VARIATIONS[Math.floor(Math.random() * RESPIN_ANGLE_VARIATIONS.length)];

  const systemInstruction = `You are AutoMuse AI, an elite automotive and transport design mentor created for students, concept artists, and car dreamers.
Your task is to generate an imaginative, authentic, studio-grade concept vehicle project report suitable for a luxury automotive design portfolio presentation.

*** CREATIVITY DIRECTIVE ***
Creativity is strictly prioritized over conservative realism!
AVOID generating:
- Generic hypercars or derivative luxury sports cars.
- Slight modifications of existing vehicles (e.g. slight tweaks to a Porsche 911, Ferrari, or Aventador).
- Conservative, conventional automotive designs.

PRIORITIZE:
- Concept art aesthetics and speculative mobility visions.
- Futopian futures, alternate timelines, cybernetic/biomorphic/kinetic transportation concepts.
- Wild automotive experiments (e.g., sub-orbital eVTOL Sky-GTs, biomorphic symbiont pods with bio-luminescent skin, plasma-levitation kinetic monoliths, deep-sea hydrofoil ocean yachts, heavy armored extraterrestrial rovers, magnetic levitation shuttles).
- Speculative next-gen materials (e.g., perovskite photovoltaic skins, electrochromic quartz glazing, self-healing memory alloys, recycled mycelium leather, aerogel thermal buffers).
- Unconventional specs, bold proportional benchmarks, and imaginative design DNA.
Every concept should feel like it arrived from a completely different future timeline!

*** SURPRISE ME MODE & INSPIRATION DIRECTIVES ***
Generate concepts inspired by diverse visual and engineering disciplines, combining multiple inspirations when appropriate:
- Fashion (haute couture tailored silhouettes, flowing fabric drapes, metallic accents)
- Aerospace (variable-sweep wings, scramjet fairings, titanium heat shielding)
- Marine Design (hydrofoil blades, wave-piercing bows, nautilus hulls)
- Architecture (brutalist cantilevers, parametric facades, minimalist glass pavilions)
- Nature (biomorphic exoskeleton shells, honeycomb ribbing, bio-luminescence)
- Formula Racing (extreme downforce tunnels, active winglets, central monocoque cells)
- Science Fiction (quantum drives, shield emitters, holographic control spheres)
- Cyberpunk (neon optic veins, heavy armor plates, exposed mechanical conduits)
- Japanese Minimalism (zen geometry, uncluttered surfaces, paper-slide door mechanisms)
- Scandinavian Luxury (warm neutral matte wood, sustainable wool weaves, ambient light hearths)
- Space Exploration (pressurized airlocks, radiation buffers, planetary treads)
- Industrial Design (raw brushed aluminum, exposed kinetic fasteners, tactile dials)
- Sustainable Futures (mycelium leather, algae fuel cells, perovskite solar skin)
- Concept Art (dramatic silhouettes, high-contrast lighting, speculative proportions)
- Gaming Aesthetics (neon accent blades, HUD telemetry rings, aggressive geometric facets)

CRITICAL CONCEPT MEMORY RESET DIRECTIVE:
Every generation must be treated as an independent design session. Do not use previous generations as inspiration unless explicitly requested by the user. Avoid iterative modifications of existing concepts and instead create entirely new concepts from scratch with unique design DNA, naming, benchmarks, materials, specs, and procedural aerodynamic streamlines.

*** RANDOMIZATION REQUIREMENTS ***
Randomize every generated concept across all 16 of these dimensions to avoid predictable patterns:
1. Wheel Configurations: 4-wheel magnetic hubless, 6-wheel articulated crawler, 2-wheel gyroscopic monowheel, quad-rotor ducted VTOL, hydrofoil pod skids, 8-wheel planetary omni-directional, maglev runners, 3-wheel delta trike.
2. Seating Layouts: 1 Central Jet Fighter Pilot Cockpit, 2 Tandem Seats, 4 Executive Face-to-Face Lounge, 2 Side-by-Side Zero-G Pods, 6 Hexagonal Pods, 16 Perimeter Lounge, 1 Pilot + 3 Asymmetric Pods.
3. Powertrains: Quad-Motor Quantum Solid-State EV, Nuclear-Isotope Thermoelectric Generator, Direct Plasma Fusion Thruster, Cold-Gas Micro-Thrusters, Bio-Synthetic Algae Fuel Cell, Magnetohydrodynamic Induction Drive, Dual-Vector Ion Thrusters.
4. Production Years: 2035, 2045, 2055, 2065, 2075, 2088, 2100, 2150, 2200.
5. Materials: Perovskite Photovoltaic Skin, Bio-Engineered Carbon Weave, Aerogel Thermal Shield, Electrochromic Quartz Glazing, Titanium-Graphene Honeycomb, Recycled Mycelium Leather, Shape-Memory Liquid Alloy.
6. Technologies: Holographic Augmented Spatial HUD, Brain-Computer Interface Neural Drive, Active Boundary Layer Micro-Jets, Quantum Telemetry AI, Bio-Luminescent Mood Matrix, Phase-Change Thermal Armor, Acoustic Active Cancellation Canopy.
7. Cabin Architecture: Monolithic Floating Glass Canopy, Modular Telescoping Pressurized Habitat, Panoramic Hydro-Glass Dome, Gullwing Kinetic Shell, Sub-Orbital Pressurized Capsule.
8. Mobility Type: Sub-Orbital eVTOL, Deep-Sea Hydrofoil, Planetary Crawler, Intercity Maglev, Hyper-Sonic Sky-GT, Biomorphic Urban Pod, High-Track Speedster.
9. Terrain: Mars Basalt Dunes, Deep Ocean Trench, Low-Air Sky Corridors, Smart Megacity Corridors, Autobahn Hyper-Lanes, Lunar Dust Basins, Glacial Ice Shelves.
10. Inspirations: Brand Heritage, Cyberpunk, Biomorphism, Brutalism, Aerospace Dynamics, Deep Sea Bioluminescence, Industrial Kinetic Sculpture.
11. Aerodynamic Designs: Venturi Suction Tunnels, Active Boundary Layer Jets, Rotor Lift Vortices, Airbrake Air-Curtains, Hydrodynamic Bow Waves, Wake Neutralizer Swirls.
12. Vehicle Proportions: Lengths strictly adapted to scale (2.5m micro pod, 4.3m speedster, 7.0m lounge, 8.0m flying VTOL, 9.0m submarine, 11.0m rover, 12.0m bus, 15.0m space cruiser).
13. Exterior Styling: Continuous LED light ribbons, parametric cooling gills, active kinetic flaps, flush optical camera pods, morphing winglets, flush door actuators.
14. Interior Styling: Floating zero-gravity seats, holographic instrument ring, ambient light veins, eco-leather upholstery, sensory acoustic floor.
15. Benchmark References: Custom benchmarks matched to archetype (e.g. Citroën Ami, Ferrari Daytona SP3, Rolls-Royce Spectre, Archer Midnight eVTOL, Triton Submersible, NASA Mars Rover, Mercedes Future Bus, SpaceX Starship).
16. Lighting Signatures: Monolithic LED Blade, Holographic Projection Bar, Bio-Luminescent Veins, Parametric Pixel Matrix, Cybernetic Dual-Bar DRL.

VEHICLE SIZE AND SCALE BENCHMARK REQUIREMENTS:
Vehicle dimensions (lengthMeters), comparedTo benchmarks, and cabinCapacity MUST adapt dynamically to the generated concept type. Never limit concepts to traditional car dimensions (4.5m - 5.0m)! Incorporate evocative, real-world scale benchmark descriptions in 'comparedTo' such as:
- Urban Pod (~2.5m): "Designed for narrow Tokyo megacity lanes (similar to Citroën Ami / Mini Vision)"
- Racing Concept / Speedster (~4.3m): "Larger than current Le Mans prototypes & comparable to Ferrari Daytona SP3"
- Luxury Lounge (~7.0m): "Occupies the footprint of a modern studio apartment; cabin comparable to a private executive jet"
- Flying Vehicle / eVTOL (~8.0m): "Cabin volume comparable to a private executive jet cabin / Archer Midnight eVTOL"
- Submarine / Underwater Vessel (~9.0m): "Similar in size to a luxury yacht tender / Triton 3300 Submersible"
- Mars Exploration Vehicle (~11.0m): "Built for Martian exploration outposts; heavy expedition footprint larger than Oshkosh JLTV"
- Autonomous Bus (~12.0m): "Occupies the footprint of a modern studio apartment; mass transit scale"
- Luxury Space Cruiser (~15.0m): "Orbital hull scale comparable to a private executive jet cabin / SpaceX Starship shuttle"
NEVER reuse generic benchmark vehicles (such as always using 'Lamborghini Revuelto') across different concept types! Match benchmarks ('comparedTo') and cabin capacities ('cabinCapacity') to the vehicle scale.

Output rules:
1. Provide highly creative, bold, futuristic, and studio-quality responses tailored strictly to the requested vehicle type, style, era, and custom vision description.
2. VEHICLE NAME: Invent a completely fresh, high-end, futuristic, professional automotive concept name (e.g. combining brand/studio prefix with sophisticated model codenames or aerodynamic project identifiers like 'Porsche Vision Strato-X', 'Aston Martin Codex Horizon-GT', 'Aegis Quantum-I', 'Spectre Zero-GT', 'Solus Hyper-Aero'). DO NOT use generic clichés, plain sentences, or repeat names across generations.
3. DESIGN PHILOSOPHY: Include a poetic 1-2 sentence philosophy statement (e.g. "Inspired by the elegance of Italian grand tourers and the efficiency of modern aerospace engineering, this vehicle was designed for autonomous coastal travel in 2085.").
4. FUN SPECULATIVE STATS: Generate creative, speculative, futuristic stats:
   - Top Speed (e.g., "420 km/h / 260 mph")
   - Range (e.g., "2,200 km / 1,360 mi")
   - Passengers (e.g., "1 Pilot + 3 Passengers" or "4 Passengers + Cyber-Luggage")
   - Powertrain (e.g., "Hydrogen Plasma Hybrid", "Solid-State Quantum Core", "Fusion-Assisted Quad EV")
   - Terrain Compatibility (e.g., "Ocean • Urban • Mountain", "Mars Surface • Dune Tracks", "Autobahn • Low-Air Corridors")
   - Autonomy Level (e.g., "Level 6 Fully Autonomous", "Switchable Co-Pilot AI")
   - Year of Production (e.g., "2088")
5. MATERIALS SECTION: Recommend 4 next-gen, futuristic, or sustainable automotive materials tailored to this exact vehicle.
6. DESIGN DNA: Provide a 3-part percentage mix of design influences summing to 100%.
7. VEHICLE SIZE COMPARISON: Provide real-world length (e.g., "4.6m"), a custom benchmark comparison tailored to vehicle type, and cabin capacity.
8. SIGNATURE WOW FACTOR FEATURE: Every concept MUST contain one unique, memorable, futuristic feature that sets it apart (in 'signatureWowFeature' object with 'title', 'category', 'description', and 'impact'). Examples: Retractable transparent wheels, adaptive bio-luminescent paint, shape-shifting aerodynamic surfaces, AI emotional lighting, solar energy harvesting skin, autonomous drone companion, magnetic levitation mode, ocean purification propulsion, living bio-material interiors.
9. PROCEDURAL ARTISTIC AERODYNAMIC STREAMLINES: Generate 4 to 5 procedurally unique artistic airflow streamline curves ('aeroStreamlines') specifically adapted to this vehicle's category, size, shape, and custom vision.
   - Hypercar: sharp aggressive sweeping canopy & active wing curves
   - Luxury GT: elegant flowing roofline & underbody channels
   - Flying vehicle / VTOL: circular lift & propulsion airflow swirls
   - Off-road rover: arch pressure vents, hood deflectors, & underbody skidplate flow
   - Urban pod: minimal soft perimeter flow
   - Racing concept: Venturi suction tunnels & diffuser downforce
   - Amphibious / Ocean: hydrodynamic bow curves & stern jet propulsion waves
   Each streamline item must have: id, title, category ('laminar', 'downforce', 'cooling', 'underbody', 'wake', 'lift'), path (SVG bezier curve string inside 1000x400 viewBox), hotspot ({x, y} percentage coords 10-90), label, value, detail, glowColor (hex like #10b981, #06b6d4, #38bdf8, #f59e0b, #a855f7).
10. Return strict JSON matching the provided schema.`;

  let prompt = "";
  if (isRespin) {
    prompt = `*** RESPIN DIRECTIVE: COMPLETE NEW DESIGN SESSION ***
FORGET ALL PREVIOUS CONCEPTS AND SPECIFICATIONS ENTIRELY.
This is a completely brand-new, unconstrained automotive design session representing an alternate universe vision of mobility.

Design Seed Direction: "${randomAngle}"

CRITICAL MANDATORY RESPIN GENERATION REQUIREMENTS:
1. VEHICLE CATEGORY: Generate a brand-new vehicle category/archetype appropriate for this seed direction (e.g., Sub-Orbital eVTOL Flying Concept, Biomorphic Active-Aero Quantum Speedster, Cyberpunk Heavy-Armor Off-Road Expedition Rover, Deep-Sea Hydrofoil Lounge Yacht, Monocoque Open-Cockpit Speedster, etc.).
2. VEHICLE NAME: Generate a completely new, unique, professional futuristic vehicle name with an evocative model code or project designation (e.g., 'Codex Horizon GT', 'Solus Strato-9', 'Zephyr Apex-X', 'Monolith Type-01'). Never repeat names from previous turns.
3. DIMENSIONS & BENCHMARKS: Generate brand-new dimensions and a custom benchmark comparison tailored specifically to this new vehicle type.
4. DESIGN DNA: Generate 3 brand-new design DNA influences with percentages summing to 100%.
5. MATERIALS: Recommend 4 completely new, next-gen, futuristic, or sustainable automotive materials.
6. SPECIFICATIONS: Generate new specs (Top Speed with both km/h and mph, Range with both km and mi, Horsepower, Powertrain, Autonomy, Terrain).
7. AERODYNAMIC STREAMLINES: Generate 4 to 5 brand-new procedural aerodynamic streamlines tailored specifically to this new vehicle category's airflow profile.
8. DESIGN PHILOSOPHY & STORY: Generate a brand-new design philosophy, exterior & interior styling suggestions, and color palette.

DO NOT make slight modifications to any previous concept. Every Respin generation MUST feel like an alternate universe version of mobility created from scratch!`;
  } else {
    prompt = `Generate a complete, highly distinctive, professional automotive concept report for:
- Vehicle Type: ${vehicleType}
- Target Year: ${year}
- Design Style: ${designStyle}
- Brand Inspiration: ${brandInspiration}
- Target Audience: ${targetAudience}
- Country / Market: ${countryMarket}

IMPORTANT: Every generation must be treated as an independent design session. Do not use previous generations as inspiration unless explicitly requested by the user. Avoid iterative modifications of existing concepts and instead create entirely new concepts from scratch with unique naming, proportions, benchmarks, materials, specs, and procedural aerodynamic streamlines.`;

    if (customPrompt && typeof customPrompt === "string" && customPrompt.trim().length > 0) {
      prompt += `\n\n- *** USER CUSTOM VISION / DESCRIPTION ***: "${customPrompt.trim()}"
CRITICAL REQUIREMENT: The user has provided a custom description above. PRIORITIZE THIS CUSTOM VISION DESCRIPTION FIRST! Generate the vehicle name, design philosophy, concept summary, design DNA, materials, and technical specs specifically tailored around this prompt!`;
    }
  }

  let generatedData = null;

  try {
    const ai = getGeminiClient();
    const sessionNonce = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const finalPromptWithNonce = `${prompt}\n\n[MANDATORY CREATIVE VARIANCE SEED: ${sessionNonce}]`;

    for (const modelName of MODELS_TO_TRY) {
      try {
        console.log(`Attempting concept generation with model: ${modelName}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: finalPromptWithNonce,
          config: {
            systemInstruction,
            temperature: 1.05,
            topP: 0.95,
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                vehicleName: {
                  type: Type.STRING,
                  description: "Distinctive, futuristic vehicle concept name",
                },
                designPhilosophy: {
                  type: Type.STRING,
                  description: "Poetic 1-2 sentence concept narrative philosophy statement",
                },
                vehicleConceptSummary: {
                  type: Type.STRING,
                  description: "High-level concept overview and mission statement",
                },
                designLanguage: {
                  type: Type.STRING,
                  description: "Form language philosophy, proportions, and core aesthetics",
                },
                designDna: {
                  type: Type.ARRAY,
                  description: "Array of 3 design DNA percentage influences summing to 100",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      attribute: { type: Type.STRING, description: "Style or influence name (e.g. Italian Elegance)" },
                      percentage: { type: Type.NUMBER, description: "Percentage weighting (e.g. 70)" },
                    },
                    required: ["attribute", "percentage"],
                  },
                },
                exteriorStylingSuggestions: {
                  type: Type.STRING,
                  description: "Detailed breakdown of silhouette, lighting, aerodynamics, and bodywork",
                },
                interiorStylingSuggestions: {
                  type: Type.STRING,
                  description: "Detailed layout of cockpit ergonomics, luxury materials, HUD, and ambient architecture",
                },
                colorPaletteSuggestions: {
                  type: Type.ARRAY,
                  description: "Array of 3-4 color palette swatches",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Name of the paint / finish" },
                      hex: { type: Type.STRING, description: "6-character hex color code with #" },
                      usage: { type: Type.STRING, description: "Where this color is applied" },
                    },
                    required: ["name", "hex", "usage"],
                  },
                },
                materialsList: {
                  type: Type.ARRAY,
                  description: "Array of 4 advanced/sustainable vehicle materials",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Material name (e.g. Bio-engineered Carbon Fibre)" },
                      category: { type: Type.STRING, description: "Category (e.g. Monocoque Shell, Glass, Interior)" },
                      description: { type: Type.STRING, description: "Brief property description" },
                    },
                    required: ["name", "category", "description"],
                  },
                },
                materialsRecommendations: {
                  type: Type.STRING,
                  description: "In-depth paragraph describing material choices and engineering benefits",
                },
                aerodynamicsSuggestions: {
                  type: Type.STRING,
                  description: "Active aero, venturi tunnels, surface drag reduction, downforce optimization",
                },
                vehicleStructureRecommendations: {
                  type: Type.STRING,
                  description: "Chassis monocoque, battery integration, structural subframes, safety cell",
                },
                sustainabilityRecommendations: {
                  type: Type.STRING,
                  description: "Lifecycle eco-materials, closed-loop recycling, zero-emission powertrain, solar skins",
                },
                professionalDesignDescription: {
                  type: Type.STRING,
                  description: "A comprehensive studio portfolio description ready for Behance or design reviews",
                },
                sizeComparison: {
                  type: Type.OBJECT,
                  description: "Vehicle size comparison and cabin scale metrics",
                  properties: {
                    lengthMeters: { type: Type.STRING, description: "e.g. 5.2 m" },
                    comparedTo: { type: Type.STRING, description: "e.g. 1.3x Lamborghini Revuelto" },
                    cabinCapacity: { type: Type.STRING, description: "e.g. 4 Passengers + Cyber-Luggage" },
                  },
                  required: ["lengthMeters", "comparedTo", "cabinCapacity"],
                },
                keySpecs: {
                  type: Type.OBJECT,
                  description: "Estimated technical metrics for the concept vehicle",
                  properties: {
                    dragCoefficient: { type: Type.STRING, description: "e.g. Cd 0.18" },
                    estimatedHp: { type: Type.STRING, description: "e.g. 1,650 HP" },
                    powertrainType: { type: Type.STRING, description: "e.g. Quad-Motor Solid-State EV" },
                    zeroToSixty: { type: Type.STRING, description: "e.g. 1.75 seconds" },
                    topSpeed: { type: Type.STRING, description: "e.g. 420 km/h / 261 mph (MUST include both km/h and mph)" },
                    chassisMaterial: { type: Type.STRING, description: "e.g. Forged Carbon Monocoque" },
                    range: { type: Type.STRING, description: "e.g. 2,200 km / 1,367 mi (MUST include both km and miles)" },
                    passengers: { type: Type.STRING, description: "e.g. 1 Pilot + 3 Passengers" },
                    terrainCompatibility: { type: Type.STRING, description: "e.g. Ocean • Urban • Mountain" },
                    autonomyLevel: { type: Type.STRING, description: "e.g. Level 6 Fully Autonomous" },
                    yearOfProduction: { type: Type.STRING, description: "e.g. 2088" },
                  },
                  required: [
                    "dragCoefficient",
                    "estimatedHp",
                    "powertrainType",
                    "zeroToSixty",
                    "topSpeed",
                    "chassisMaterial",
                    "range",
                    "passengers",
                    "terrainCompatibility",
                    "autonomyLevel",
                    "yearOfProduction",
                  ],
                },
                aeroStreamlines: {
                  type: Type.ARRAY,
                  description: "Array of 4-5 procedurally custom artistic aerodynamic streamline curves",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      category: { type: Type.STRING, description: "laminar, downforce, cooling, underbody, wake, or lift" },
                      path: { type: Type.STRING, description: "SVG bezier path inside 1000x400 viewBox" },
                      hotspot: {
                        type: Type.OBJECT,
                        properties: {
                          x: { type: Type.NUMBER },
                          y: { type: Type.NUMBER },
                        },
                        required: ["x", "y"],
                      },
                      label: { type: Type.STRING },
                      value: { type: Type.STRING },
                      detail: { type: Type.STRING },
                      glowColor: { type: Type.STRING, description: "hex color string like #10b981" },
                    },
                    required: ["id", "title", "category", "path", "hotspot", "label", "value", "detail", "glowColor"],
                  },
                },
              },
              required: [
                "vehicleName",
                "designPhilosophy",
                "vehicleConceptSummary",
                "designLanguage",
                "designDna",
                "exteriorStylingSuggestions",
                "interiorStylingSuggestions",
                "colorPaletteSuggestions",
                "materialsList",
                "materialsRecommendations",
                "aerodynamicsSuggestions",
                "vehicleStructureRecommendations",
                "sustainabilityRecommendations",
                "professionalDesignDescription",
                "sizeComparison",
                "keySpecs",
              ],
            },
          },
        });

        const jsonText = response.text || "{}";
        generatedData = JSON.parse(jsonText);
        console.log(`Successfully generated concept report using model ${modelName}`);
        break; // Stop loop on success
      } catch (modelError: any) {
        console.warn(`Model ${modelName} unavailable, falling back to next option.`);
        // Continue to next model in loop
      }
    }
  } catch (err) {
    console.warn("Client initialization error, using studio fallback generator:", err);
  }

  // Fallback if API models were rate-limited or failed
  if (!generatedData) {
    console.log("Using dynamic AutoMuse AI Studio Fallback Report generator.");
    generatedData = generateStudioFallbackReport({
      vehicleType,
      year,
      designStyle,
      brandInspiration,
      targetAudience,
      countryMarket,
      customPrompt,
      isRespin,
    });
  }

  // Post-process generated data to guarantee mph and miles metrics in topSpeed and range
  if (generatedData) {
    if (!generatedData.keySpecs) {
      generatedData.keySpecs = {};
    }
    const ks = generatedData.keySpecs;

    // Top Speed
    let speedVal = ks.topSpeed || ks.top_speed || ks.estimatedTopSpeed || ks.speed;
    if (!speedVal || typeof speedVal !== "string" || speedVal.trim().length === 0) {
      speedVal = "420 km/h / 261 mph";
    }
    const lowerSpeed = speedVal.toLowerCase();
    if (!lowerSpeed.includes("mph")) {
      if (lowerSpeed.includes("mach")) {
        const match = speedVal.match(/mach\s*([\d.]+)/i) || speedVal.match(/([\d.]+)\s*mach/i);
        if (match) {
          const mach = parseFloat(match[1]);
          if (!isNaN(mach)) {
            const kmh = Math.round(mach * 1234.8);
            const mph = Math.round(mach * 767.269);
            speedVal = `${speedVal} (${kmh.toLocaleString()} km/h / ${mph.toLocaleString()} mph)`;
          }
        }
      } else {
        const numMatch = speedVal.match(/(\d+[\d,.]*)/);
        if (numMatch) {
          const num = parseFloat(numMatch[1].replace(/,/g, ""));
          if (!isNaN(num)) {
            const mph = Math.round(num * 0.621371);
            speedVal = `${num.toLocaleString()} km/h / ${mph.toLocaleString()} mph`;
          }
        } else {
          speedVal = `${speedVal} (261 mph)`;
        }
      }
    }
    ks.topSpeed = speedVal;

    // Range
    let rangeVal = ks.range || ks.estimatedRange || ks.maxRange;
    if (!rangeVal || typeof rangeVal !== "string" || rangeVal.trim().length === 0) {
      rangeVal = "2,200 km / 1,367 mi";
    }
    const lowerRange = rangeVal.toLowerCase();
    if (!lowerRange.includes("mi") && !lowerRange.includes("miles")) {
      const numMatch = rangeVal.match(/(\d+[\d,.]*)/);
      if (numMatch) {
        const num = parseFloat(numMatch[1].replace(/,/g, ""));
        if (!isNaN(num)) {
          const mi = Math.round(num * 0.621371);
          rangeVal = `${num.toLocaleString()} km / ${mi.toLocaleString()} mi`;
        }
      } else {
        rangeVal = `${rangeVal} (1,367 mi)`;
      }
    }
    ks.range = rangeVal;

    // 0-60 MPH
    if (!ks.zeroToSixty) {
      ks.zeroToSixty = "1.75s (0-60 mph)";
    }

    // Vehicle Name fallback & quality check
    if (
      !generatedData.vehicleName ||
      typeof generatedData.vehicleName !== "string" ||
      generatedData.vehicleName.trim().length === 0 ||
      generatedData.vehicleName.toLowerCase().includes("make a car")
    ) {
      const seedNum = Math.floor(Math.random() * 1000000) + Date.now();
      generatedData.vehicleName = generateFuturisticVehicleName(
        brandInspiration,
        vehicleType,
        year,
        customPrompt,
        seedNum
      );
    }
  }

  res.json({
    success: true,
    data: generatedData,
    meta: {
      vehicleType,
      year,
      designStyle,
      brandInspiration,
      targetAudience,
      countryMarket,
      customPrompt: isRespin ? randomAngle : customPrompt,
      generatedAt: new Date().toISOString(),
    },
  });
});

// Start server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AutoMuse AI Server running on http://localhost:${PORT}`);
  });
}

startServer()
