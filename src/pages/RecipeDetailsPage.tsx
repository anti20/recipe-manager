import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useRecipe from "../hooks/useRecipe";
import useDeleteRecipe from "../hooks/useDeleteRecipe";

export default function RecipeDetailsPage() {
    const navigate = useNavigate();
    const { recipeId } = useParams();
    const { data: recipe, isLoading, error } = useRecipe(recipeId ?? "");
    const { mutate } = useDeleteRecipe();

    if (!recipeId) {
        return <p>Recipe id is undefined.</p>;
    }

    if (!recipe) {
        return <p>Recipe not found</p>;
    }

    function deleteRecipe() {
        const shouldDelete = confirm("Are you sure you want to delete this recipe?");

        if (!shouldDelete) return;

        mutate(recipeId ?? "", {
            onSuccess: () => {
                navigate("/", { replace: true });
            },
            onError: (error) => {
                alert(error.message);
            },
        });
    }

    return (
        <main className="recipe-details-page">
            <section className="recipe-details-card">
                {isLoading && <p>Loading...</p>}
                {error && <p>{error.message}</p>}

                <header className="recipe-details-header">
                    <h1>{recipe.title}</h1>

                    <div style={{ display: "flex", gap: "8px" }}>
                        <Link to={`/recipes/${recipe.id}/edit`} className="button button--primary">
                            Edit
                        </Link>

                        <button className="button button--danger" onClick={deleteRecipe}>
                            Delete
                        </button>
                    </div>
                </header>

                {recipe.image && <img className="recipe-details-card__image" src={recipe.image} alt={recipe.title} />}

                <div className="recipe-details-header">
                    <h4>Servings: {recipe.servings} 🍽️</h4>
                    <h4>
                        {recipe.cookingTime} {recipe.cookingTime > 1 ? "mins" : "min"}⏲️
                    </h4>
                </div>

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
