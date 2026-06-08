import { fetchRecipe } from "../api/api";
import type { Recipe } from "../types/recipe";
import React from "react";
import { toError } from "../utils/helper";

type UseRecipeResult = {
    recipe: Recipe | null;
    loading: boolean;
    error: Error | null;
};

export default function useRecipe(recipeId: string): UseRecipeResult {
    const [recipe, setRecipe] = React.useState<Recipe | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        async function loadRecipe() {
            try {
                setLoading(true);
                setError(null);

                const data = await fetchRecipe(recipeId);
                console.log(`Fetched recipe with ID: ${recipeId}:`, data);
                setRecipe(data);
            } catch (err) {
                setError(toError(err));
            } finally {
                setLoading(false);
            }
        }

        loadRecipe();
    }, [recipeId]);

    return { recipe, loading, error };
}
