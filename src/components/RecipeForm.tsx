import React from "react";
import type { Ingredient, NewRecipe } from "../types/recipe";
import IngredientsForm from "./IngredientsForm";
import InstructionsForm from "./InstructionsForm";

const emptyRecipe: NewRecipe = {
    title: "",
    image: "",
    servings: 1,
    cookingTime: 10,
    ingredients: [],
    instructions: [],
};

export default function RecipeForm({ onSave }: { onSave: (recipe: NewRecipe) => void }) {
    const [recipe, setRecipe] = React.useState<NewRecipe>(emptyRecipe);

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

    return (
        <form className="recipe-form" onSubmit={handleSubmit}>
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
                    <input type="number" value={recipe.servings} min={1} onChange={(e) => setRecipe({ ...recipe, servings: Number(e.target.value) })} />
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

            <button className="button button--primary recipe-form__submit" type="submit">
                Save recipe
            </button>
        </form>
    );
}
