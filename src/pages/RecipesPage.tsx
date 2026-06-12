import React from "react";
import { Link } from "react-router-dom";
import useRecipes from "../hooks/useRecipes";

export default function RecipesPage() {
    const { data: recipes, isLoading, error } = useRecipes();

    return (
        <main className="recipes-page">
            <section className="recipes-section">
                <header className="recipes-header">
                    <h1>Recipes</h1>
                </header>

                {isLoading && <p>Loading...</p>}
                {error && <p>{error.message}</p>}

                <Link to="/recipes/new" className="button button--primary recipes-create-button">
                    + New recipe
                </Link>

                <ul className="recipes-grid">
                    {recipes?.map((recipe) => (
                        <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                            <li key={recipe.id} className="recipe-card">
                                <img
                                    className="recipe-card__image"
                                    src={recipe.image || "/recipe-placeholder.jpg"}
                                    alt={recipe.title}
                                    onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.src = "/recipe-placeholder.jpg";
                                    }}
                                />

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
