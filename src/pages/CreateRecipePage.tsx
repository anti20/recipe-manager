import React from "react";
import RecipeForm from "../components/RecipeForm";
import type { NewRecipe } from "../types/recipe";
import useCreateRecipe from "../hooks/useCreateRecipe";
import { useNavigate } from "react-router-dom";

export default function CreateRecipePage() {
    const navigate = useNavigate();
    const { mutate } = useCreateRecipe();

    function handleSave(recipe: NewRecipe) {
        mutate(recipe, {
            onSuccess(createdRecipe) {
                navigate(`/recipes/${createdRecipe.id}`, { replace: true });
            },
        });
    }

    return <RecipeForm onSave={handleSave} />;
}
