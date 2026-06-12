import React from "react";
import type { Ingredient } from "../types/recipe";
import IngredientForm from "./IngredientForm";

type IngredientsFormProps = {
    ingredients: Ingredient[];
    onChange: (ingredients: Ingredient[]) => void;
};

const newIngredient: Ingredient = {
    name: "",
    quantity: 1,
    unit: "g",
};

export default function IngredientsForm({ ingredients, onChange }: IngredientsFormProps) {
    function addIngredient() {
        onChange([...ingredients, newIngredient]);
    }

    function updateIngredient(index: number, updatedIngredient: Ingredient) {
        const updatedIngredients = ingredients.map((originalIngredient, i) => {
            return index === i ? updatedIngredient : originalIngredient;
        });
        onChange(updatedIngredients);
    }
    function removeIngredient(index: number) {
        const updatedIngredients = ingredients.filter((_, i) => index !== i);
        onChange(updatedIngredients);
    }

    return (
        <fieldset>
            <legend>Ingredients</legend>

            {ingredients.map((ingredient, index) => (
                <IngredientForm
                    key={index}
                    ingredient={ingredient}
                    onChange={(ingr) => updateIngredient(index, ingr)}
                    onRemove={() => removeIngredient(index)}
                />
            ))}

            <button type="button" onClick={addIngredient}>
                Add ingredient
            </button>
        </fieldset>
    );
}
