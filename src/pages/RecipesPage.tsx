import React from "react";
import useRecipes from "../hooks/useRecipes";

export default function RecipesPage() {
    const { recipes, loading, error } = useRecipes();

    return (
        <main>
            <h1>Recipes</h1>
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            <ul>
                {recipes?.map((recipe) => (
                    <li key={recipe.id}>{recipe.title}</li>
                ))}
            </ul>
        </main>
    );
}
