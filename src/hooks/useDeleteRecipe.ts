import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecipe } from "../api/api";

export default function useDeleteRecipe() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRecipe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recipes"] });
        },
    });
}
