import type { Recipe } from "../types/recipe";

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
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return response.json();
}

export function fetchRecipes(): Promise<Recipe[]> {
    return request<Recipe[]>("/recipes");
}
