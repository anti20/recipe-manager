import React from "react";
import { Link } from "react-router-dom";
import useRecipes from "../hooks/useRecipes";
import Loading from "../components/Loading";
import ErrorView from "../components/ErrorView";
import type { RecipeSortType } from "../types/recipe";

const sortOptions = [
    { value: "title-asc", label: "Title (A-Z)" },
    { value: "title-desc", label: "Title (Z-A)" },
    { value: "cooking-time-asc", label: "Cooking time (shortest)" },
    { value: "cooking-time-desc", label: "Cooking time (longest)" },
];

export default function RecipesPage() {
    const [searchText, setSearchText] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [sort, setSort] = React.useState<RecipeSortType>("title-asc");
    const { data, isLoading, isFetching, error } = useRecipes(searchText, page, 20, sort);
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

    function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const sortType = (event.target.value as RecipeSortType) ?? "title-asc";
        setSort(sortType);
        setPage(1);
    }

    return (
        <main className="recipes-page">
            <section className="recipes-section">
                <header className="recipes-header">
                    <h1>Recipes</h1>
                </header>

                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "24px", marginLeft: "36px" }}>
                    <Link to="/recipes/new" className="button button--primary">
                        + New recipe
                    </Link>

                    <input
                        type="search"
                        placeholder="Search recipes"
                        className="recipe-search-input"
                        value={searchText}
                        onChange={handleSearchTextChange}
                    />

                    <label className="recipe-sort-label">
                        Sort by
                        <select value={sort} onChange={handleSortChange} className="recipe-sort-select">
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    {isFetching && (
                        <div
                            style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                border: "3px solid rgba(110, 178, 139, 0.18)",
                                borderTopColor: "#6eb28b",
                                animation: "loading-spin 0.85s linear infinite",
                                flexShrink: 0,
                            }}
                        />
                    )}
                </div>

                {recipes.length === 0 && <ErrorView message="No recipes found" style={{ minHeight: "400px" }} />}

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
