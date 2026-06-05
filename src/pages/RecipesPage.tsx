import React from "react";
import { Link } from "react-router-dom";
import useRecipes from "../hooks/useRecipes";

export default function RecipesPage() {
    const { recipes, loading, error } = useRecipes();

    return (
        <main className="recipes-page">
            <section className="recipes-section">
                <header className="recipes-header">
                    <h1>Recipes</h1>
                </header>

                {loading && <p>Loading...</p>}
                {error && <p>{error.message}</p>}
                <ul className="recipes-grid">
                    {recipes?.map((recipe) => (
                        <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                            <li key={recipe.id} className="recipe-card">
                                {recipe.image ? (
                                    <img className="recipe-card__image" src={recipe.image} alt={recipe.title} />
                                ) : (
                                    <div className="recipe-card__image recipe-card__image--placeholder">
                                        🍽 No Image
                                    </div>
                                )}

                                <div className="recipe-card__body">
                                    <h2>{recipe.title}</h2>
                                    <p>
                                        {recipe.servings} servings · {recipe.cookingTime} min
                                    </p>
                                </div>
                            </li>
                        </Link>
                    ))}
                </ul>
            </section>
        </main>
    );
}
