import React from "react";
import RecipeForm from "../components/RecipeForm";
import type { Recipe } from "../types/recipe";
import useUpdateRecipe from "../hooks/useUpdateRecipe";
import useRecipe from "../hooks/useRecipe";
import { useNavigate, useParams } from "react-router-dom";
import HomeButton from "../components/HomeButton";
import Loading from "../components/Loading";
import ErrorView from "../components/ErrorView";

export default function EditRecipePage() {
    const navigate = useNavigate();
    const { mutate } = useUpdateRecipe();
    const { recipeId } = useParams();
    const { data: recipe, isLoading, error } = useRecipe(recipeId ?? "");

    let content: React.ReactElement;

    if (!recipeId) {
        content = <ErrorView message="Recipe id is undefined." />;
    } else if (isLoading) {
        content = <Loading />;
    } else if (error) {
        content = <ErrorView message={error.message} />;
    } else {
        content = <RecipeForm recipeToEdit={recipe} onSave={handleSave} onCancel={() => navigate(-1)} />;
    }

    function handleSave(recipe: Recipe) {
        mutate(recipe, {
            onSuccess() {
                navigate(-1);
            },
            onError: (error) => {
                alert(error.message);
            },
        });
    }

    return (
        <main className="recipe-form-page">
            <HomeButton />
            <section className="recipe-form-card">
                <header className="recipe-form-header">
                    <h1>Edit recipe</h1>
                </header>

                {content}
            </section>
        </main>
    );
}
