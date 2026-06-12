export type Recipe = {
    id: string | null;
    title: string;
    image: string | null;
    servings: number;
    cookingTime: number; // in minutes
    ingredients: Ingredient[];
    instructions: string[];
};

export type NewRecipe = Omit<Recipe, "id">;

export type Ingredient = {
    name: string;
    quantity: number;
    unit: IngredientUnit;
};

export type IngredientUnit =
    | "g" // gram
    | "dkg" // decagram
    | "kg" // kilogram
    | "ml" // milliliter
    | "dl" // deciliter
    | "l" // liter
    | "tsp" // teaspoon
    | "tbsp" // tablespoon
    | "piece" // piece
    | "pinch" // pinch
    | "clove"; // clove
