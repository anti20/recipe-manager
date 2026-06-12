import React from "react";
import RecipeForm from "../components/RecipeForm";
import type { Recipe } from "../types/recipe";
import useCreateRecipe from "../hooks/useCreateRecipe";
import { useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";

export default function CreateRecipePage() {
    const navigate = useNavigate();
    const { mutate } = useCreateRecipe();

    function handleSave(recipe: Recipe) {
        mutate(recipe, {
            onSuccess(createdRecipe) {
                navigate(`/recipes/${createdRecipe.id}`, { replace: true });
            },
        });
    }

    return (
        <main className="recipe-form-page">
            <HomeButton />
            <section className="recipe-form-card">
                <header className="recipe-form-header">
                    <h1>Create recipe</h1>
                </header>

                <RecipeForm onSave={handleSave} onCancel={() => navigate(-1)} />
            </section>
        </main>
    );
}
