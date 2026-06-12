import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipe } from "../api/api";

export default function useCreateRecipe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRecipe,
        onSuccess: (newRecipe) => {
            queryClient.setQueryData(["recipe", newRecipe.id], newRecipe);
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
        },
    });
}
