export enum MaterialType {
  WALL_LAYER = 'WALL_LAYER',
  INSULATION = 'INSULATION',
  WINDOW = 'WINDOW',
  DOOR = 'DOOR'
}

export interface Material {
  id: string;
  name: string;
  type: MaterialType;
  description: string;
  costIndex: number; // 1-5 scale
  density?: string; // Descriptive
  stcBase: number; // Approximate base Sound Transmission Class contribution
}

export interface SoundSource {
  id: string;
  name: string;
  decibels: number;
  icon: string;
  description: string;
}

export interface RoomConfig {
  source: SoundSource | null;
  outerWall: Material | null;
  innerWall: Material | null;
  cavityFill: Material | null;
  window: Material | null;
  door: Material | null;
}

export interface SimulationResult {
  stcTotal: number;
  dbReduction: number;
  frequencyResponse: { frequency: string; reduction: number }[];
  analysis: string;
  suggestions: string[];
  costEstimate: number;
  success: boolean;
}

export interface AnalysisResponse {
  stc: number;
  analysis: string;
  suggestions: string[];
  frequency_data: { label: string; value: number }[];
}