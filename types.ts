
export type Theme = 'light' | 'dark';

export enum BodyType {
  SkinnyFat = 'Skinny Fat',
  Ectomorphic = 'Ectomorphic (Lean/Skinny)',
  Mesomorphic = 'Mesomorphic (Athletic/Defined)',
  Endomorphic = 'Endomorphic (Strong/Heavy)'
}

export enum ExperienceLevel {
  Beginner = 'Beginner (The Awakening)',
  Intermediate = 'Intermediate (The Shift)',
  Pro = 'Pro (The Master)'
}

export enum FitnessGoal {
  Slim = 'Slim',
  SlimThick = 'Slim Thick',
  Toned = 'Toned',
  Calisthenics = 'Calisthenics',
  Cardio = 'Cardio',
  Flexibility = 'Flexibility',
  MuscleHypertrophy = 'Muscle Hypertrophy',
  Strength = 'Strength',
  RunningSplits = 'Running (Splits & Strides)',
  LongDistanceRunning = 'Long Distance Running',
  FlexibilitySplits = 'Flexibility (Path to Splits)',
  BulkingProtocol = 'Bulking & Mass Gain'
}

export interface UserProfile {
  name: string;
  pronouns: string;
  height: string;
  currentWeight: string;
  targetWeight: string;
  bodyType: BodyType;
  experienceLevel: ExperienceLevel;
  goals: FitnessGoal[];
  fatFocusAreas: string[];
  cuisines: string[];
  favoriteFoods: string[];
  dietaryRestrictions: string;
  medicalIssues: string;
  dailyStepGoal: number;
  hasOnboarded: boolean;
  onboardingQuizResults?: Record<string, string>;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  isRest: boolean;
}

export interface Exercise {
  name: string;
  reps: string;
  description: string;
  graphicUrl: string;
  category: 'strength' | 'mobility' | 'pilates' | 'cardio' | 'running' | 'flexibility';
  evidence?: string; // Hard information/Scientific evidence
  articleLink?: string; // Reference article or study
}

export interface MealRecommendation {
  original: string;
  alternative: string;
  recipeName: string;
  ingredients: string[];
  macros: { calories: number; protein: number; carbs: number; fat: number };
}

export interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
  mood: number; // 1-5
  isCheckIn: boolean;
}

export interface DailyStats {
  steps: number;
  workoutCompleted: boolean;
  journalCompleted: boolean;
  meditationMinutes: number;
  progressPercentage: number;
  lastActiveTimestamp: number;
}
