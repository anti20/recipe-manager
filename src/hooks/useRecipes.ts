import React from "react";
import { fetchRecipes } from "../api/api";
import type { Recipe } from "../types/recipe";
import { toError, delay } from "../utils/helper";

type UseRecipesResult = {
    recipes: Recipe[] | null;
    loading: boolean;
    error: Error | null;
};

export default function useRecipes(): UseRecipesResult {
    const [recipes, setRecipes] = React.useState<Recipe[] | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        const abortController = new AbortController();
        const { signal } = abortController;

        async function loadRecipes() {
            try {
                setLoading(true);
                setError(null);

                const data = await fetchRecipes();
                console.log("Fetched recipes:", data);
                if (!signal.aborted) {
                    setRecipes(data);
                }
            } catch (err) {
                if (signal.aborted) return;
                setError(toError(err));
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadRecipes();

        return () => {
            abortController.abort();
        };
    }, []);

    return { recipes, loading, error };
}
