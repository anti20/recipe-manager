import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchRecipes } from "../api/api";

export default function useRecipes(searchText: string = "", page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ["recipes", searchText, page, limit],
        queryFn: () => fetchRecipes(searchText, page, limit),
        staleTime: 15000,
        placeholderData: keepPreviousData,
    });
}
