import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchRecipes } from "../api/api";
import type { RecipeSortType } from "../types/recipe";

export default function useRecipes(searchText: string = "", page: number = 1, limit: number = 10, sort: RecipeSortType = "title-asc") {
    return useQuery({
        queryKey: ["recipes", searchText, page, limit, sort],
        queryFn: () => fetchRecipes(searchText, page, limit, sort),
        staleTime: 15000,
        placeholderData: keepPreviousData,
    });
}
