import React from "react";
import { Link } from "react-router-dom";
import useRecipes from "../hooks/useRecipes";
import Loading from "../components/Loading";
import ErrorView from "../components/ErrorView";

export default function RecipesPage() {
    const [searchText, setSearchText] = React.useState("");
    const [page, setPage] = React.useState(1);
    const { data, isLoading, isFetching, error } = useRecipes(searchText, page, 20);
    const recipes = data?.recipes ?? [];
    const totalPages = data ? Math.ceil(data.total / data.limit) : 0;
    const isPreviousDisabled = page <= 1;
    const isNextDisabled = page >= totalPages;

    if (isLoading && !data) return <Loading />;
    if (error) return <ErrorView message={error.message} />;

    function handleSearchTextChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchText(event.target.value);
        setPage(1);
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

                {totalPages > 1 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1.5rem", gap: "16px" }}>
                        <button
                            type="button"
                            className={`button button--secondary${isPreviousDisabled ? " button--disabled" : ""}`}
                            disabled={isPreviousDisabled}
                            onClick={() => setPage((currentPage) => currentPage - 1)}
                        >
                            Previous
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button
                            type="button"
                            className={`button button--secondary${isNextDisabled ? " button--disabled" : ""}`}
                            disabled={isNextDisabled}
                            onClick={() => setPage((currentPage) => currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
