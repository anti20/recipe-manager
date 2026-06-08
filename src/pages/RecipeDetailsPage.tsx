import React from "react";
import { useParams } from "react-router-dom";
import useRecipe from "../hooks/useRecipe";

export default function RecipeDetailsPage() {
    const { recipeId } = useParams();
    const { recipe, loading, error } = useRecipe(recipeId ?? "");

    if (!recipeId) {
        return <p>Recipe id is undefined.</p>;
    }

    if (!recipe) {
        return <p>Recipe not found</p>;
    }

    return (
        <section>
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}

            <h1>{recipe.title}</h1>
            <img src={recipe.image ?? undefined} alt={recipe.title} />

            <h2>Ingredients</h2>
            <ul>
                {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.name}>
                        {ingredient.quantity} {ingredient.unit} {ingredient.name}
                    </li>
                ))}
            </ul>

            <h2>Instructions</h2>
            <ol>
                {recipe.instructions.map((instruction) => (
                    <li key={instruction}>{instruction}</li>
                ))}
            </ol>
        </section>
    );
}
