export type Recipe = {
    id: string;
    title: string;
    image: string | null;
    servings: number;
    cookingTime: number; // in minutes
    ingredients: Ingredient[];
    instructions: string[];
};

export type Ingredient = {
    name: string;
    quantity: string;
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
