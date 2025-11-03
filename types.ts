export enum CropType {
  Tomato = 'tomato',
  Pepper = 'pepper',
  Cabbage = 'cabbage',
  Onion = 'onion',
  Carrot = 'carrot',
  Pumpkin = 'pumpkin',
  Eggplant = 'eggplant',
  Beet = 'beet',
  Celery = 'celery',
}

export enum ProblemType {
  Weeds = 'weeds',
  Diseases = 'diseases',
  Pests = 'pests',
  Integrated = 'integrated',
}

export interface Herbicide {
  activeIngredient: string;
  productName: string;
  applicationTime: string;
  registrationUA: string;
  registrationWorld: string;
  description: string;
  spectrum: {
    sensitive: string[];
    moderatelySensitive: string[];
    resistant: string[];
  };
  applicationInfo: string;
}

export interface Fungicide {
  activeIngredient: string;
  productName: string;
  category: 1 | 2 | 3;
  controls: {
    bacteriosis: boolean;
    phytophthora: boolean;
    rots: boolean;
    rootRots: boolean;
  };
}

export interface Insecticide {
    activeIngredient: string;
    productName: string;
    category: 1 | 2 | 3;
    controls: {
        aphids: boolean;
        thrips: boolean;
        whiteflies: boolean;
        mites: boolean;
        lepidoptera: boolean; // лускокрилі
        coleoptera: boolean; // твердокрилі
    };
}

export interface CropProtectionData {
  herbicides: Herbicide[];
  fungicides: Fungicide[];
  insecticides: Insecticide[];
}

export type CropData = Record<CropType, CropProtectionData>;