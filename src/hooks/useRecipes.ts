import { useQuery } from "@tanstack/react-query";
import { fetchRecipes } from "../api/api";

export default function useRecipes() {
    return useQuery({
        queryKey: ["recipes"],
        queryFn: fetchRecipes,
    });
}
