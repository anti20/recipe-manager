import { useQuery } from "@tanstack/react-query";
import { fetchRecipe } from "../api/api";

export default function useRecipe(recipeId: string) {
    return useQuery({
        queryKey: ["recipe", recipeId],
        queryFn: () => fetchRecipe(recipeId),
        staleTime: 15000,
    });
}
