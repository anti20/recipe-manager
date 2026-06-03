export const units = [
  "g",
  "dkg",
  "kg",
  "ml",
  "dl",
  "l",
  "tsp",
  "tbsp",
  "piece",
  "pinch",
  "clove",
] as const;

export type Unit = (typeof units)[number];

export interface Ingredient {
  name: string;
  quantity: number;
  unit: Unit;
}

export interface Recipe {
  id: string;
  title: string;
  servings: number;
  cookingTime: number;
  ingredients: Ingredient[];
  instructions: string[];
}
