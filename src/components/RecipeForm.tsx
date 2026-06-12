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
        <form onSubmit={handleSubmit}>
            <h2>Recipe form</h2>

            <label>
                Title
                <input type="text" value={recipe.title} onChange={(e) => setRecipe({ ...recipe, title: e.target.value })} />
            </label>

            <label>
                Image URL
                <input type="url" value={recipe.image ?? ""} onChange={(e) => setRecipe({ ...recipe, image: e.target.value })} />
            </label>

            <label>
                Servings
                <input type="number" value={recipe.servings} min={1} onChange={(e) => setRecipe({ ...recipe, servings: Number(e.target.value) })} />
            </label>

            <label>
                Cooking time
                <input
                    type="number"
                    value={recipe.cookingTime}
                    min={1}
                    onChange={(e) => setRecipe({ ...recipe, cookingTime: Number(e.target.value) })}
                />
            </label>

            <IngredientsForm ingredients={recipe.ingredients} onChange={updateIngredients} />

            <InstructionsForm instructions={recipe.instructions} onChange={updateInstructions} />

            <button type="submit">Save recipe</button>

            <pre>{JSON.stringify(recipe, null, 2)}</pre>
        </form>
    );
    return <form>Recipe form</form>;
}
