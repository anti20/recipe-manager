import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchRecipes } from "../api/api";

export default function useRecipes(searchText: string = "") {
    return useQuery({
        queryKey: ["recipes", searchText],
        queryFn: () => fetchRecipes(searchText),
        staleTime: 15000,
        placeholderData: keepPreviousData,
    });
}
