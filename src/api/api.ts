import type { Recipe } from "../types/recipe";

const BASE_URL = "http://localhost:3000";

export async function fetchRecipes(): Promise<Recipe[]> {
    const response = await fetch(`${BASE_URL}/recipes`);
    return response.json();
}
