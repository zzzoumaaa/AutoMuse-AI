import { SavedConcept } from "../types";

export const PRESET_CONCEPTS: SavedConcept[] = [
  {
    id: "preset-porsche-2075",
    createdAt: "2026-07-22T10:00:00.000Z",
    input: {
      vehicleType: "Hypercar",
      year: "2075",
      designStyle: "Futuristic",
      brandInspiration: "Porsche",
      targetAudience: "Young Professionals",
      countryMarket: "Italy",
    },
    report: {
      vehicleName: "Porsche Taycan Apex 2075",
      designPhilosophy:
        "Inspired by the timeless elegance of Porsche endurance racers and the raw efficiency of 2085 aerospace engineering, this hypercar was crafted for high-speed autonomous coastal travel.",
      vehicleConceptSummary:
        "The Taycan Apex 2075 is an ultra-low-drag, neural-guided hypercar engineered for the high-speed autonomous corridors of Northern Italy. It merges Porsche's iconic flyline silhouette with a seamless liquid-metal body shell.",
      designLanguage:
        "Kinetic Precision: Low-slung proportions defined by a continuous 'single-stroke' roof curve, flush glass-to-carbon surfaces, and monolithic floating fender arches.",
      designDna: [
        { attribute: "Italian Grand Touring", percentage: 55 },
        { attribute: "Aerospace Influence", percentage: 30 },
        { attribute: "Cyberpunk Styling", percentage: 15 },
      ],
      exteriorStylingSuggestions:
        "Continuous 4-point matrix light strip integrated into an active airflow intake channel. Clean monopost side view without side mirrors, utilizing high-speed tactile camera pods.",
      interiorStylingSuggestions:
        "Holographic windshield display with augmented driving line overlay. Minimalist floating dashboard upholstered in dark sage microfiber.",
      colorPaletteSuggestions: [
        { name: "Matte Slate Carbon", hex: "#1f2421", usage: "Primary Monocoque Shell" },
        { name: "Nordic Sage Silk", hex: "#4a5d4e", usage: "Interior Leather & Aero Accent" },
        { name: "Anodized Silver", hex: "#a8b2a9", usage: "Wheel Ribs & Window Frame" },
        { name: "Glow Amber", hex: "#df9b35", usage: "Brake Callipers & HUD Highlights" },
      ],
      materialsList: [
        {
          name: "Bio-engineered Carbon Fibre",
          category: "Structural Monocoque",
          description: "Ultra-high modulus organic composite with self-healing micro-capsules.",
        },
        {
          name: "Self-healing Polymer Shell",
          category: "Body Panels",
          description: "Thermal-memory exterior skin that erases minor scratches automatically.",
        },
        {
          name: "Transparent Electrochromic Solar Glass",
          category: "Canopy & Roof",
          description: "Photovoltaic glazing that generates auxiliary cabin power.",
        },
        {
          name: "Sustainable Bamboo Composites",
          category: "Interior Cockpit",
          description: "Lightweight sustainable wood-fiber structure with ambient backlighting.",
        },
      ],
      materialsRecommendations:
        "Recycled woven carbon-titanium composite, bio-synthetic mycelium leather, acoustic smart glass with opacity-shifting solar tinting.",
      aerodynamicsSuggestions:
        "Venturi underbody tunnels generating ground-effect suction without drag penalty. Active rear diffusers that adjust flap pitch based on lateral G-forces. Target drag coefficient of Cd 0.18.",
      vehicleStructureRecommendations:
        "Ultra-lightweight structural carbon battery floor integrated into the passenger cell as a stress-bearing member. Titanium subframes 3D-printed in topology-optimized organic lattices.",
      sustainabilityRecommendations:
        "Zero-emission solid-state quad-motor drive, 100% circular closed-loop material recycling, photovoltaic micro-skin integrated into the glass roof.",
      professionalDesignDescription:
        "The Porsche Taycan Apex 2075 represents the convergence of racing heritage and zero-emission autonomy. Tailored for Next-Gen Italian Grand Touring, the design exhibits pristine aerodynamic discipline without compromising Porsche's timeless emotional purity.",
      sizeComparison: {
        lengthMeters: "5.2 m",
        comparedTo: "1.3x Lamborghini Revuelto",
        cabinCapacity: "4 Passengers + Cyber-Luggage",
      },
      keySpecs: {
        dragCoefficient: "Cd 0.18",
        estimatedHp: "1,650 HP",
        powertrainType: "Quad-Motor Solid-State EV",
        zeroToSixty: "1.75s",
        topSpeed: "420 km/h / 260 mph",
        chassisMaterial: "Carbon-Titanium Monocoque",
        range: "2,200 km / 1,360 mi",
        passengers: "1 Pilot + 3 Passengers",
        terrainCompatibility: "Ocean • Urban • Mountain",
        autonomyLevel: "Level 6 Fully Autonomous",
        yearOfProduction: "2075",
      },
    },
  },
  {
    id: "preset-bugatti-2050",
    createdAt: "2026-07-22T10:15:00.000Z",
    input: {
      vehicleType: "Gran Turismo",
      year: "2050",
      designStyle: "Cyberpunk Luxury",
      brandInspiration: "Bugatti",
      targetAudience: "High-Net-Worth Collectors",
      countryMarket: "UAE",
    },
    report: {
      vehicleName: "Bugatti Chiron Vision AeroMonocoque",
      designPhilosophy:
        "Crafted as a kinetic monument for high-speed desert hyperways, merging Bugatti's timeless horseshoe heritage with cybernetic surface sculpting.",
      vehicleConceptSummary:
        "An opulent hyper-GT crafted for high-speed desert hyperways. Combining Bugatti's signature horseshoe grille and C-line arch with cybernetic surface sculpting.",
      designLanguage:
        "Sculpted Monolith: Deep parametric cuts, aggressive air scoops, and exposed structural ribbing reminiscent of high-end chronographs.",
      designDna: [
        { attribute: "Cyberpunk Monolith", percentage: 50 },
        { attribute: "French Couture Luxury", percentage: 35 },
        { attribute: "Aerospace Dynamics", percentage: 15 },
      ],
      exteriorStylingSuggestions:
        "Illuminated laser-crystal horseshoe grille feeding dual venturi channels. Split rear light signature floating inside an exposed titanium diffuser structure.",
      interiorStylingSuggestions:
        "Dual-cocoon interior layout with hand-finished titanium center console, analog mechanical timepiece instrument cluster fused with OLED HUD displays.",
      colorPaletteSuggestions: [
        { name: "Obsidian Black", hex: "#121214", usage: "Lower Aerodynamic Skirt" },
        { name: "Emirate Sage", hex: "#384d3e", usage: "Upper Carbon Finish" },
        { name: "Liquid Platinum", hex: "#c0c5c1", usage: "Bugatti C-Line Accent" },
      ],
      materialsList: [
        {
          name: "Forged Carbon-Gold Monocoque",
          category: "Chassis",
          description: "Structural carbon fiber woven with real gold micro-filaments.",
        },
        {
          name: "Liquid Metal Titanium Subframe",
          category: "Suspension & Skeleton",
          description: "3D-printed topology-optimized titanium alloy.",
        },
        {
          name: "Electrochromic Smart Tint Glazing",
          category: "Windshield & Canopy",
          description: "Instant solar dimming glass designed for extreme desert glare.",
        },
        {
          name: "Vegetable-Tanned Artisan Leather",
          category: "Interior Cockpit",
          description: "Sustainable organic leather cured with natural olive leaf extract.",
        },
      ],
      materialsRecommendations:
        "Forged carbon-fiber weave with embedded gold micro-filaments, vegetable-tanned full-grain leather, solid billet aluminum controls.",
      aerodynamicsSuggestions:
        "Active air curtains in front bumper routing vortexes away from wide rear tires. Active rear airbrake with dual-stage deployment.",
      vehicleStructureRecommendations:
        "Monocoque safety cage engineered with crash-absorbing honeycomb composite cores.",
      sustainabilityRecommendations:
        "Synthetic carbon-neutral e-fuel hybrid system paired with energy harvesting suspension dampers.",
      professionalDesignDescription:
        "A statement piece in modern automotive sculpture. Designed for collectors seeking ultimate performance and bespoke craftsmanship.",
      sizeComparison: {
        lengthMeters: "4.9 m",
        comparedTo: "1.1x Bugatti Tourbillon",
        cabinCapacity: "2 Passengers + Tailored Luggage",
      },
      keySpecs: {
        dragCoefficient: "Cd 0.22",
        estimatedHp: "2,100 HP",
        powertrainType: "Flux-Assist Quad-Turbo EV Hybrid",
        zeroToSixty: "1.90s",
        topSpeed: "440 km/h / 273 mph",
        chassisMaterial: "Forged Carbon-Gold Monocoque",
        range: "1,800 km / 1,118 mi",
        passengers: "2 Passengers",
        terrainCompatibility: "High-Speed Hyperways • Coastal",
        autonomyLevel: "Switchable Pilot / AI Co-Pilot",
        yearOfProduction: "2050",
      },
    },
  },
];
