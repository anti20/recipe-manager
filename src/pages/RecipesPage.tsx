import React from "react";
import { Link } from "react-router-dom";
import useRecipes from "../hooks/useRecipes";
import Loading from "../components/Loading";
import ErrorView from "../components/ErrorView";

export default function RecipesPage() {
    const [searchText, setSearchText] = React.useState("");
    const { data: recipes, isLoading, isFetching, error } = useRecipes(searchText);

    if (isLoading && !recipes) return <Loading />;
    if (error) return <ErrorView message={error.message} />;

    function handleSearchTextChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchText(event.target.value);
    }

    return (
        <main className="recipes-page">
            <section className="recipes-section">
                <header className="recipes-header">
                    <h1>Recipes</h1>
                </header>

                <div style={{ display: "flex", gap: "16px" }}>
                    <Link to="/recipes/new" className="button button--primary recipes-create-button">
                        + New recipe
                    </Link>

                    <input
                        type="search"
                        placeholder="Search recipes"
                        className="recipe-search-input"
                        value={searchText}
                        onChange={handleSearchTextChange}
                    />
                </div>

                {isFetching && <Loading />}

                <ul className="recipes-grid">
                    {recipes?.map((recipe) => (
                        <li key={recipe.id} className="recipe-card">
                            <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
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
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
