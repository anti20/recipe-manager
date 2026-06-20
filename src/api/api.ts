import type { Recipe, RecipeSortType } from "../types/recipe";

const BASE_URL = "http://localhost:3000";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<TResponse, TBody = undefined>(endpoint: string, method: HttpMethod = "GET", body?: TBody): Promise<TResponse> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
    }

    if (response.status === 204) {
        return undefined as TResponse;
    }

    return response.json();
}

export function fetchRecipes(
    searchText: string = "",
    page: number = 1,
    limit: number = 20,
    sort: RecipeSortType = "title-asc",
): Promise<RecipesResponse> {
    const searchParams = new URLSearchParams();
    if (searchText.trim()) {
        searchParams.set("search", searchText.trim());
    }
    searchParams.set("page", page.toString());
    searchParams.set("limit", limit.toString());
    searchParams.set("sort", sort);
    return request<RecipesResponse>(`/recipes?${searchParams.toString()}`);
}

export function fetchRecipe(recipeId: string): Promise<Recipe> {
    return request<Recipe>(`/recipes/${recipeId}`);
}

export function createRecipe(recipe: Recipe): Promise<Recipe> {
    return request<Recipe, Recipe>(`/recipes`, "POST", recipe);
}

export function updateRecipe(recipe: Recipe): Promise<Recipe> {
    return request<Recipe, Recipe>(`/recipes/${recipe.id}`, "PUT", recipe);
}

export function deleteRecipe(recipeId: string): Promise<void> {
    return request<void>(`/recipes/${recipeId}`, "DELETE");
}

type RecipesResponse = {
    recipes: Recipe[];
    page: number;
    limit: number;
    total: number;
};
