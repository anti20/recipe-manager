import React from "react";
import type { Ingredient, Recipe } from "../types/recipe";
import IngredientsForm from "./IngredientsForm";
import InstructionsForm from "./InstructionsForm";

const emptyRecipe: Recipe = {
    id: null,
    title: "",
    image: "",
    servings: 1,
    cookingTime: 10,
    ingredients: [],
    instructions: [],
};

type RecipeFormProps = {
    recipeToEdit?: Recipe;
    onSave: (recipe: Recipe) => void;
    onCancel: () => void;
};

export default function RecipeForm({ recipeToEdit, onSave, onCancel }: RecipeFormProps) {
    const [recipe, setRecipe] = React.useState<Recipe>(recipeToEdit ?? emptyRecipe);
    const formRef = React.useRef<HTMLFormElement>(null);

    function updateIngredients(ingredients: Ingredient[]) {
        setRecipe({ ...recipe, ingredients: ingredients });
    }

    function updateInstructions(instructions: string[]) {
        setRecipe({ ...recipe, instructions: instructions });
    }

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        onSave(recipe);
    }

    React.useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const isSaveShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s";
            if (!isSaveShortcut) return;

            event.preventDefault();
            formRef.current?.requestSubmit();
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <form ref={formRef} className="recipe-form" onSubmit={handleSubmit}>
            <div className="recipe-form__grid">
                <label className="recipe-form__field">
                    Title
                    <input type="text" value={recipe.title} onChange={(e) => setRecipe({ ...recipe, title: e.target.value })} />
                </label>

                <label className="recipe-form__field">
                    Image URL
                    <input type="url" value={recipe.image ?? ""} onChange={(e) => setRecipe({ ...recipe, image: e.target.value })} />
                </label>

                <label className="recipe-form__field">
                    Servings
                    <input
                        type="number"
                        value={recipe.servings}
                        min={1}
                        onChange={(e) => setRecipe({ ...recipe, servings: Number(e.target.value) })}
                    />
                </label>

                <label className="recipe-form__field">
                    Cooking time
                    <input
                        type="number"
                        value={recipe.cookingTime}
                        min={1}
                        onChange={(e) => setRecipe({ ...recipe, cookingTime: Number(e.target.value) })}
                    />
                </label>
            </div>

            <IngredientsForm ingredients={recipe.ingredients} onChange={updateIngredients} />

            <InstructionsForm instructions={recipe.instructions} onChange={updateInstructions} />

            <div style={{ display: "flex", gap: "8px" }}>
                <button className="button button--primary recipe-form__submit" type="submit">
                    Save recipe
                </button>

                <button className="button button--secondary" type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}
