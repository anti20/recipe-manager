import React from "react";
import RecipeForm from "../components/RecipeForm";
import type { Recipe } from "../types/recipe";
import useUpdateRecipe from "../hooks/useCreateRecipe";
import useRecipe from "../hooks/useRecipe";
import { useNavigate, useParams } from "react-router-dom";

export default function EditRecipePage() {
    const navigate = useNavigate();
    const { mutate } = useUpdateRecipe();
    const { recipeId } = useParams();
    const { data: recipe, isLoading, error } = useRecipe(recipeId ?? "");

    let content: React.ReactElement;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (error) {
        content = <p>{error.message}</p>;
    } else {
        content = <RecipeForm recipeToEdit={recipe} onSave={handleSave} />;
    }

    function handleSave(recipe: Recipe) {
        mutate(recipe, {
            onSuccess(editedRecipe) {
                navigate(`/recipes/${editedRecipe.id}`, { replace: true });
            },
        });
    }

    return (
        <main className="recipe-form-page">
            <section className="recipe-form-card">
                <header className="recipe-form-header">
                    <h1>Edit recipe</h1>
                </header>

                {content}
            </section>
        </main>
    );
}
