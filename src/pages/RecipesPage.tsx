import React from "react";
import { Link, useLocation } from "react-router-dom";
import useRecipes from "../hooks/useRecipes";

export default function RecipesPage() {
    const { data: recipes, isLoading, error } = useRecipes();

    const location = useLocation();
    const navigationState = location.state as {
        successMessage?: string;
    } | null;

    const [successMessage, setSuccessMessage] = React.useState(navigationState?.successMessage ?? null);

    React.useEffect(() => {
        if (!successMessage) return;

        const timeoutId = window.setTimeout(() => {
            setSuccessMessage(null);
        }, 1500);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [successMessage]);

    return (
        <main className="recipes-page">
            {successMessage && <p className="toast toast--success">{successMessage}</p>}

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
                                {recipe.image ? (
                                    <img className="recipe-card__image" src={recipe.image} alt={recipe.title} />
                                ) : (
                                    <div className="recipe-card__image recipe-card__image--placeholder">🍽 No Image</div>
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
