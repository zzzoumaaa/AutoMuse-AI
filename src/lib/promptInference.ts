import { ConceptInput } from "../types";

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface MatchDetail {
  index: number;
  length: number;
  isExactPhraseOrWord: boolean;
}

/**
 * Evaluates keywords against input text using strict priority rules:
 * 1. Exact phrase match or whole-word match (\bkeyword\b)
 * 2. Multi-character stem or prefix match (minimum 5 consecutive chars)
 * 3. Never match based on single letters, 2-4 letter fragments, or unrelated character substrings.
 */
function getMatchDetail(text: string, keywords: string[]): MatchDetail | null {
  if (!text || !keywords || keywords.length === 0) return null;
  const cleanText = text.toLowerCase();

  let bestDetail: MatchDetail | null = null;

  for (const kw of keywords) {
    if (!kw || kw.trim().length === 0) continue;
    const cleanKw = kw.toLowerCase().trim();
    const escapedKw = escapeRegExp(cleanKw);

    // Priority 1: Exact phrase or whole-word match (\bkw\b)
    const wordBoundaryRegex = new RegExp(`\\b${escapedKw}\\b`, "i");
    const match = wordBoundaryRegex.exec(cleanText);

    if (match) {
      const detail: MatchDetail = {
        index: match.index,
        length: cleanKw.length,
        isExactPhraseOrWord: true,
      };

      if (
        !bestDetail ||
        (!bestDetail.isExactPhraseOrWord && detail.isExactPhraseOrWord) ||
        (detail.isExactPhraseOrWord === bestDetail.isExactPhraseOrWord && detail.length > bestDetail.length) ||
        (detail.isExactPhraseOrWord === bestDetail.isExactPhraseOrWord && detail.length === bestDetail.length && detail.index < bestDetail.index)
      ) {
        bestDetail = detail;
      }
      continue;
    }

    // Priority 2: Stem or prefix match (MINIMUM 5 consecutive characters required)
    if (cleanKw.length >= 5) {
      const stem = cleanKw.replace(/(ing|ers|er|ed|s|es|ic|ity|able|al|ous|ive|ist|ism)$/, "");
      if (stem.length >= 5) {
        const stemRegex = new RegExp(`\\b${escapeRegExp(stem)}`, "i");
        const stemMatch = stemRegex.exec(cleanText);
        if (stemMatch) {
          const detail: MatchDetail = {
            index: stemMatch.index,
            length: stem.length,
            isExactPhraseOrWord: false,
          };

          if (
            !bestDetail ||
            (!bestDetail.isExactPhraseOrWord && detail.length > bestDetail.length) ||
            (!bestDetail.isExactPhraseOrWord && detail.length === bestDetail.length && detail.index < bestDetail.index)
          ) {
            bestDetail = detail;
          }
        }
      }
    }
  }

  return bestDetail;
}

function findBestCategoryMatch(
  text: string,
  categories: Array<{ value: string; keywords: string[] }>
): string | null {
  let bestValue: string | null = null;
  let bestMatchDetail: MatchDetail | null = null;

  for (const cat of categories) {
    const detail = getMatchDetail(text, cat.keywords);
    if (detail) {
      if (!bestMatchDetail) {
        bestMatchDetail = detail;
        bestValue = cat.value;
      } else {
        // Higher priority to exact phrase/word match over stem match
        if (detail.isExactPhraseOrWord && !bestMatchDetail.isExactPhraseOrWord) {
          bestMatchDetail = detail;
          bestValue = cat.value;
        } else if (detail.isExactPhraseOrWord === bestMatchDetail.isExactPhraseOrWord) {
          // Higher priority to longer (more specific/longer phrase) keyword
          if (detail.length > bestMatchDetail.length) {
            bestMatchDetail = detail;
            bestValue = cat.value;
          } else if (detail.length === bestMatchDetail.length) {
            // Higher priority to earlier match index in user prompt
            if (detail.index < bestMatchDetail.index) {
              bestMatchDetail = detail;
              bestValue = cat.value;
            }
          }
        }
      }
    }
  }

  return bestValue;
}

// Category Configuration Maps with Semantic Expressions
const VEHICLE_TYPE_CATEGORIES = [
  {
    value: "Urban eVTOL Ground Hybrid",
    keywords: [
      "urban evtol ground hybrid",
      "urban evtol",
      "evtol",
      "vtol",
      "flying car",
      "flying vehicle",
      "drone hybrid",
      "skybus",
      "air taxi",
      "vertical takeoff",
      "aerial hybrid",
      "hovercraft",
      "rotorcraft",
      "air vehicle",
      "flying concept",
    ],
  },
  {
    value: "Amphibious Hydro-Aero",
    keywords: [
      "amphibious hydro-aero",
      "amphibious",
      "amphibian",
      "hydro-aero",
      "hydro aero",
      "hydroplane",
      "submersible",
      "watercraft",
      "seaplane",
      "oceanic vehicle",
      "marine hybrid",
      "aquatic vehicle",
      "yacht hybrid",
      "speed boat concept",
      "rescue craft",
      "underwater vehicle",
    ],
  },
  {
    value: "Off-Road Rover",
    keywords: [
      "off-road rover",
      "off road rover",
      "rover",
      "off-road",
      "offroad",
      "off road",
      "overland",
      "overlander",
      "rock crawler",
      "dune buggy",
      "dune crawler",
      "polar rover",
      "expedition vehicle",
      "safari rig",
      "all terrain",
      "all-terrain",
      "terrain vehicle",
    ],
  },
  {
    value: "Electric Monocoque SUV",
    keywords: [
      "electric monocoque suv",
      "monocoque suv",
      "electric suv",
      "crossover",
      "electric truck",
      "pickup truck",
      "utility vehicle",
      "monocoque",
      "4x4 suv",
      "suv",
      "electric pickup",
    ],
  },
  {
    value: "Compact Urban Pod",
    keywords: [
      "compact urban pod",
      "urban pod",
      "compact pod",
      "microcar",
      "micro pod",
      "city pod",
      "commuter pod",
      "robotaxi pod",
      "robo taxi",
      "robotaxi",
      "delivery pod",
      "delivery van",
      "food truck",
      "kei car",
      "keicar",
      "shuttle pod",
      "city shuttle",
      "urban shuttle",
    ],
  },
  {
    value: "Track Speedster",
    keywords: [
      "track speedster",
      "speedster",
      "monoposto",
      "open wheel",
      "formula 1",
      "f1 car",
      "track car",
      "circuit car",
      "barchetta",
      "single seater",
      "race car",
      "racing car",
      "hypertrack",
      "dragster",
      "track day car",
    ],
  },
  {
    value: "Luxury Shooting Brake",
    keywords: [
      "luxury shooting brake",
      "shooting brake",
      "shootingbrake",
      "sports wagon",
      "fast wagon",
      "luxury wagon",
      "estate car",
      "touring wagon",
      "wagon concept",
    ],
  },
  {
    value: "Autonomous Lounge",
    keywords: [
      "autonomous lounge",
      "driverless lounge",
      "self-driving lounge",
      "mobile lounge",
      "mobile suite",
      "mobile office",
      "executive lounge",
      "limousine",
      "limo",
      "chauffeur cabin",
      "passenger suite",
      "sleeper cabin",
    ],
  },
  {
    value: "Gran Turismo",
    keywords: [
      "gran turismo",
      "grand tourer",
      "turismo",
      "fastback coupe",
      "gt coupe",
      "2+2 coupe",
      "sport sedan",
      "luxury sedan",
      "saloon",
      "gt sedan",
    ],
  },
  {
    value: "Hypercar",
    keywords: [
      "hypercar",
      "supercar",
      "megacar",
      "hypersonic car",
      "exotic car",
      "velocity car",
      "hyper car",
      "super car",
    ],
  },
];

const YEAR_CATEGORIES = [
  { value: "2030", keywords: ["2030", "2030s"] },
  { value: "2035", keywords: ["2035", "near future", "next decade"] },
  { value: "2040", keywords: ["2040", "2040s"] },
  { value: "2045", keywords: ["2045"] },
  { value: "2050", keywords: ["2050", "2050s", "mid century", "half century"] },
  { value: "2055", keywords: ["2055"] },
  { value: "2060", keywords: ["2060", "2060s"] },
  { value: "2065", keywords: ["2065"] },
  { value: "2070", keywords: ["2070", "2070s"] },
  { value: "2075", keywords: ["2075", "far future"] },
  { value: "2080", keywords: ["2080", "2080s"] },
  { value: "2085", keywords: ["2085"] },
  { value: "2090", keywords: ["2090"] },
  { value: "2100", keywords: ["2100", "next century", "turn of century", "22nd century"] },
];

const DESIGN_STYLE_CATEGORIES = [
  {
    value: "Cyberpunk",
    keywords: [
      "cyberpunk",
      "synthwave",
      "retrowave",
      "blade runner",
      "night city",
      "neon punk",
      "dystopian high tech",
      "high-tech low-life",
    ],
  },
  {
    value: "Kinetic Sculpture",
    keywords: [
      "kinetic sculpture",
      "kinetic art",
      "shape shifting",
      "morphing body",
      "active aerodynamics",
      "origami structure",
      "dynamic sculpture",
      "transforming panels",
    ],
  },
  {
    value: "Parametric / Bio-Organic",
    keywords: [
      "parametric / bio-organic",
      "parametric",
      "bio-organic",
      "bio organic",
      "biomimicry",
      "biomorphic",
      "bionic",
      "cellular voronoi",
      "mycelium structure",
      "skeletal frame",
      "nature inspired",
    ],
  },
  {
    value: "Retro-Futurism",
    keywords: [
      "retro-futurism",
      "retrofuturism",
      "retro futurism",
      "space age",
      "atomic age",
      "art deco",
      "jet age",
      "nostalgic future",
      "vintage future",
    ],
  },
  {
    value: "Minimalist Brutalism",
    keywords: [
      "minimalist brutalism",
      "brutalist",
      "brutalism",
      "stealth wedge",
      "monolithic",
      "polyhedral",
      "armored wedge",
      "faceted stealth",
      "raw geometry",
    ],
  },
  {
    value: "Aerodynamic Streamline",
    keywords: [
      "aerodynamic streamline",
      "aerodynamic",
      "streamline",
      "streamlined",
      "wind tunnel",
      "low drag",
      "teardrop silhouette",
      "slipstream",
      "fluid streamline",
    ],
  },
  {
    value: "Luxury / Grand Touring",
    keywords: [
      "luxury / grand touring",
      "haute couture",
      "bespoke luxury",
      "opulent elegance",
      "royal grand touring",
      "sumptuous luxury",
      "high luxury",
    ],
  },
  {
    value: "Sci-Fi Industrial",
    keywords: [
      "sci-fi industrial",
      "scifi industrial",
      "sci fi industrial",
      "futuristic industrial",
      "quantum mechanical",
      "mecha industrial",
      "starship aesthetic",
      "exo tactical",
      "tactical industrial",
    ],
  },
];

const BRAND_CATEGORIES = [
  { value: "Porsche", keywords: ["porsche", "porsch", "911", "taycan", "weissach", "stuttgart gt3"] },
  { value: "Bugatti", keywords: ["bugatti", "chiron", "tourbillon", "molsheim", "w16", "veyron", "bolide"] },
  { value: "Ferrari", keywords: ["ferrari", "maranello", "prancing horse", "scuderia", "sf90", "laferrari"] },
  { value: "Lamborghini", keywords: ["lamborghini", "lambo", "sant'agata", "countach", "revuelto", "aventador", "huracan"] },
  { value: "Tesla", keywords: ["tesla", "cybertruck", "giga tesla", "cybercab", "roadster plaid"] },
  { value: "Aston Martin", keywords: ["aston martin", "aston", "valhalla", "valkyrie", "gaydon aston"] },
  { value: "Rimac", keywords: ["rimac", "nevera", "mate rimac"] },
  { value: "Lotus", keywords: ["lotus", "evija", "emira", "hethel lotus", "esprit"] },
  { value: "Genesis", keywords: ["genesis", "genesis magma", "genesis x"] },
  { value: "Koenigsegg", keywords: ["koenigsegg", "gemera", "jesko", "regera", "angelholm"] },
  { value: "Lucid Motors", keywords: ["lucid motors", "lucid air", "lucid gravity", "lucid sapphire"] },
  { value: "Custom Atelier", keywords: ["custom atelier", "independent atelier", "bespoke coachbuilder", "boutique atelier", "custom coachbuilder"] },
];

const COUNTRY_CATEGORIES = [
  { value: "Nordic / Sweden", keywords: ["nordic / sweden", "nordic", "sweden", "swedish", "scandinavia", "stockholm", "arctic market", "polar region"] },
  { value: "Japan", keywords: ["japan", "japanese", "tokyo", "osaka", "jdm market", "nippon"] },
  { value: "Italy", keywords: ["italy", "italian", "milan", "monaco", "turin", "modena"] },
  { value: "Germany", keywords: ["germany", "german", "berlin", "stuttgart", "munich", "autobahn"] },
  { value: "United States", keywords: ["united states", "usa", "american market", "california", "detroit", "silicon valley"] },
  { value: "UAE & Middle East", keywords: ["uae & middle east", "dubai", "uae", "middle east", "emirates", "abu dhabi", "gulf region"] },
  { value: "Singapore", keywords: ["singapore", "singaporean", "lion city"] },
  { value: "Global Metropolises", keywords: ["global metropolises", "global metropolis", "megacity", "worldwide urban", "cosmopolitan"] },
];

const AUDIENCE_CATEGORIES = [
  {
    value: "Next-Gen Commuters",
    keywords: [
      "next-gen commuters",
      "next gen commuters",
      "next generation",
      "gen z",
      "gen alpha",
      "future generation",
      "future generations",
      "tomorrow's drivers",
      "future mobility users",
      "next wave of consumers",
      "city commuters",
      "daily commuters",
      "urban commuters",
      "urbanites",
      "city dwellers",
      "transit riders",
      "mass transit",
      "shuttle passengers",
      "commuters",
      "daily mobility",
    ],
  },
  {
    value: "Young Professionals",
    keywords: [
      "young professionals",
      "young executives",
      "working professionals",
      "career-oriented individuals",
      "corporate workers",
      "office commuters",
      "early career professionals",
      "business professionals",
      "modern professionals",
      "tech entrepreneurs",
      "digital nomads",
      "tech workers",
      "young grads",
      "entrepreneurs",
    ],
  },
  {
    value: "Track Enthusiasts",
    keywords: [
      "track enthusiasts",
      "race drivers",
      "circuit drivers",
      "motorsport drivers",
      "motorsport fans",
      "lap time purists",
      "paddock drivers",
      "track day drivers",
      "gearheads",
      "petrolheads",
      "time attack racers",
      "circuit purists",
      "apex hunters",
      "track drivers",
    ],
  },
  {
    value: "High-Net-Worth Collectors",
    keywords: [
      "high-net-worth collectors",
      "collectors",
      "collector",
      "automotive collectors",
      "car collectors",
      "luxury buyers",
      "car enthusiasts",
      "limited-edition buyers",
      "millionaires",
      "billionaires",
      "vip buyers",
      "bespoke buyers",
      "connoisseurs",
      "curators",
      "ultra wealthy",
      "hnwi",
    ],
  },
  {
    value: "Eco-Luxury Nomads",
    keywords: [
      "eco-luxury nomads",
      "eco nomads",
      "solar nomads",
      "off-grid travelers",
      "off grid explorers",
      "overland explorers",
      "wilderness travelers",
      "zero emission nomads",
      "green travelers",
      "sustainable nomads",
      "expeditioners",
      "eco adventurers",
      "glamping nomads",
    ],
  },
  {
    value: "Autonomous Fleet Passengers",
    keywords: [
      "autonomous fleet passengers",
      "robotaxi riders",
      "self-driving passengers",
      "driverless commuters",
      "autonomous passengers",
      "hands-free travelers",
      "fleet passengers",
      "self driving riders",
      "autonomous riders",
    ],
  },
];

export function inferConceptFromPrompt(
  val: string,
  currentInput?: Partial<ConceptInput>
): Partial<ConceptInput> {
  if (!val || val.trim().length <= 2) {
    return { customPrompt: val };
  }

  const text = val.trim();
  // Preserve original user prompt string 100% as entered
  const result: Partial<ConceptInput> = { customPrompt: val };

  // 1. Vehicle Type
  const matchedVehicleType = findBestCategoryMatch(text, VEHICLE_TYPE_CATEGORIES);
  if (matchedVehicleType) {
    result.vehicleType = matchedVehicleType;
  } else if (currentInput?.vehicleType) {
    result.vehicleType = currentInput.vehicleType;
  }

  // 2. Year (also check explicit 4-digit year regex e.g. 2075)
  const explicitYearMatch = text.match(/\b(20[2-9]\d|2100)\b/);
  if (explicitYearMatch) {
    result.year = explicitYearMatch[1];
  } else {
    const matchedYear = findBestCategoryMatch(text, YEAR_CATEGORIES);
    if (matchedYear) {
      result.year = matchedYear;
    } else if (currentInput?.year) {
      result.year = currentInput.year;
    }
  }

  // 3. Design Style
  const matchedStyle = findBestCategoryMatch(text, DESIGN_STYLE_CATEGORIES);
  if (matchedStyle) {
    result.designStyle = matchedStyle;
  } else if (currentInput?.designStyle) {
    result.designStyle = currentInput.designStyle;
  }

  // 4. Brand Inspiration
  const matchedBrand = findBestCategoryMatch(text, BRAND_CATEGORIES);
  if (matchedBrand) {
    result.brandInspiration = matchedBrand;
  } else if (currentInput?.brandInspiration) {
    result.brandInspiration = currentInput.brandInspiration;
  }

  // 5. Country / Market
  const matchedCountry = findBestCategoryMatch(text, COUNTRY_CATEGORIES);
  if (matchedCountry) {
    result.countryMarket = matchedCountry;
  } else if (currentInput?.countryMarket) {
    result.countryMarket = currentInput.countryMarket;
  }

  // 6. Target Audience
  const matchedAudience = findBestCategoryMatch(text, AUDIENCE_CATEGORIES);
  if (matchedAudience) {
    result.targetAudience = matchedAudience;
  } else if (currentInput?.targetAudience) {
    result.targetAudience = currentInput.targetAudience;
  }

  return result;
}
