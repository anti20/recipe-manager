import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRecipe } from "../api/api";

export default function useUpdateRecipe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRecipe,
        onSuccess: (updatedRecipe) => {
            queryClient.setQueryData(["recipe", updatedRecipe.id], updatedRecipe);
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
        },
    });
}
