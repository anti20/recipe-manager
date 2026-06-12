import React from "react";
import RecipeForm from "../components/RecipeForm";
import type { NewRecipe } from "../types/recipe";
import useCreateRecipe from "../hooks/useCreateRecipe";
import { useNavigate } from "react-router-dom";

export default function EditRecipePage() {
    const navigate = useNavigate();
    const { mutate } = useCreateRecipe();

    function handleSave(recipe: NewRecipe) {
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

                <RecipeForm onSave={handleSave} />
            </section>
        </main>
    );
}
