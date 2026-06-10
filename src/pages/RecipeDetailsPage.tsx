import React from "react";
import { useParams } from "react-router-dom";
import useRecipe from "../hooks/useRecipe";

export default function RecipeDetailsPage() {
    const { recipeId } = useParams();
    const { data: recipe, isLoading, error } = useRecipe(recipeId ?? "");

    if (!recipeId) {
        return <p>Recipe id is undefined.</p>;
    }

    if (!recipe) {
        return <p>Recipe not found</p>;
    }

    return (
        <main className="recipe-details-page">
            <section className="recipe-details-card">
                {isLoading && <p>Loading...</p>}
                {error && <p>{error.message}</p>}

                <h1>{recipe.title}</h1>

                {recipe.image && <img className="recipe-details-card__image" src={recipe.image} alt={recipe.title} />}

                <div className="recipe-details-card__grid">
                    <section className="recipe-details-section">
                        <h2>Ingredients</h2>
                        <ul className="recipe-details-list">
                            {recipe.ingredients.map((ingredient) => (
                                <li key={ingredient.name}>
                                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="recipe-details-section">
                        <h2>Instructions</h2>
                        <ol className="recipe-details-steps">
                            {recipe.instructions.map((instruction) => (
                                <li key={instruction}>{instruction}</li>
                            ))}
                        </ol>
                    </section>
                </div>
            </section>
        </main>
    );
}
