export interface ConceptInput {
  vehicleType: string;
  year: string;
  designStyle: string;
  brandInspiration: string;
  targetAudience: string;
  countryMarket: string;
  customPrompt?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  usage: string;
}

export interface KeySpecs {
  dragCoefficient: string;
  estimatedHp: string;
  powertrainType: string;
  zeroToSixty: string;
  topSpeed: string;
  chassisMaterial: string;
  // Fun Speculative Stats
  range: string;
  passengers: string;
  terrainCompatibility: string;
  autonomyLevel: string;
  yearOfProduction: string;
}

export interface DesignDnaItem {
  attribute: string;
  percentage: number;
}

export interface MaterialItem {
  name: string;
  category: string;
  description: string;
}

export interface VehicleSizeComparison {
  lengthMeters: string;
  comparedTo: string;
  cabinCapacity: string;
}

export interface WowFactorFeature {
  title: string;
  category: string;
  description: string;
  impact?: string;
}

export interface AeroStreamlineItem {
  id: string;
  title: string;
  category: "laminar" | "downforce" | "cooling" | "underbody" | "wake" | "lift";
  path: string; // SVG bezier path inside 1000x400 viewBox
  hotspot: { x: number; y: number }; // percentage position for badge
  label: string;
  value: string;
  detail: string;
  glowColor: string; // e.g. #10b981, #06b6d4, #38bdf8, #f59e0b, #a855f7
  strokeWidth?: number;
  dashArray?: string;
}

export interface ConceptReport {
  vehicleName: string;
  designPhilosophy: string;
  vehicleConceptSummary: string;
  designLanguage: string;
  designDna: DesignDnaItem[];
  exteriorStylingSuggestions: string;
  interiorStylingSuggestions: string;
  colorPaletteSuggestions: ColorSwatch[];
  materialsList: MaterialItem[];
  materialsRecommendations: string;
  aerodynamicsSuggestions: string;
  vehicleStructureRecommendations: string;
  sustainabilityRecommendations: string;
  professionalDesignDescription: string;
  sizeComparison: VehicleSizeComparison;
  keySpecs: KeySpecs;
  aeroStreamlines?: AeroStreamlineItem[];
  signatureWowFeature?: WowFactorFeature;
}

export interface SavedConcept {
  id: string;
  input: ConceptInput;
  report: ConceptReport;
  createdAt: string;
  generatedImageUrl?: string;
}
