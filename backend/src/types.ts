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
  image: string | null;
  servings: number;
  cookingTime: number;
  ingredients: Ingredient[];
  instructions: string[];
}

export interface RecipeListResult {
  recipes: Recipe[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type RecipeCreateInput = Omit<Recipe, "id" | "image"> & {
  image: string;
};
