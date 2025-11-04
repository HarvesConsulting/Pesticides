
export enum CropType {
  Tomato = 'Tomato',
  Pepper = 'Pepper',
  Cabbage = 'Cabbage',
  Onion = 'Onion',
  Carrot = 'Carrot',
  Pumpkin = 'Pumpkin',
  Eggplant = 'Eggplant',
  Beet = 'Beet',
  Celery = 'Celery',
  Leek = 'Leek',
  Daikon = 'Daikon',
  Garlic = 'Garlic',
}

export enum ProblemType {
  Weeds = 'weeds',
  Diseases = 'diseases',
  Pests = 'pests',
  Integrated = 'integrated',
}

export type PlotType = 'home' | 'field';

export interface Spectrum {
  sensitive: string[];
  moderatelySensitive: string[];
  resistant: string[];
}

export interface Herbicide {
  activeIngredient: string;
  productName: string;
  applicationTime: 'до' | 'після' | 'до/після';
  registrationUA: string;
  registrationWorld: string;
  description: string;
  spectrum: Spectrum;
  applicationInfo: string;
}

export interface FungicideControls {
  bacteriosis: boolean;
  phytophthora: boolean;
  rots: boolean;
  rootRots: boolean;
}

export interface Fungicide {
  activeIngredient: string;
  productName: string;
  category: 1 | 2 | 3;
  controls: FungicideControls;
  rateHome: string | null;
  rateField: string | null;
}

export interface InsecticideControls {
  aphids: boolean;
  thrips: boolean;
  whiteflies: boolean;
  mites: boolean;
  lepidoptera: boolean;
  coleoptera: boolean;
}

export interface Insecticide {
  activeIngredient: string;
  productName: string;
  controls: InsecticideControls;
  rateHome: string | null;
  rateField: string | null;
}

export interface Crop {
  herbicides: Herbicide[];
  fungicides: Fungicide[];
  insecticides: Insecticide[];
}

export type CropData = {
  [key in CropType]: Crop;
};

export interface IdentificationResult {
    crop: CropType | 'unknown';
    name: string;
    type: 'disease' | 'pest' | 'unknown';
    description: string;
    confidence: number;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}
