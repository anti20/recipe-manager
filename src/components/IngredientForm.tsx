import React from "react";
import type { Ingredient, IngredientUnit } from "../types/recipe";

const ingredientUnits: IngredientUnit[] = ["g", "dkg", "kg", "ml", "dl", "l", "tsp", "tbsp", "piece", "pinch", "clove"];

interface IngredientFormProps {
    ingredient: Ingredient;
    onChange: (ingredient: Ingredient) => void;
    onRemove: () => void;
}

export default function IngredientForm({ ingredient, onChange, onRemove }: IngredientFormProps) {
    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        onChange({ ...ingredient, name: event.target.value });
    }

    function handleQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
        onChange({ ...ingredient, quantity: Number(event.target.value) });
    }

    function handleUnitChange(event: React.ChangeEvent<HTMLSelectElement>) {
        onChange({ ...ingredient, unit: event.target.value as IngredientUnit });
    }

    return (
        <div>
            <label>
                Name
                <input type="text" value={ingredient.name} onChange={handleNameChange} />
            </label>

            <label>
                Quantity
                <input type="number" value={ingredient.quantity} min={1} onChange={handleQuantityChange} />
            </label>

            <label>
                Unit
                <select value={ingredient.unit} onChange={handleUnitChange}>
                    {ingredientUnits.map((unit) => (
                        <option key={unit} value={unit}>
                            {unit}
                        </option>
                    ))}
                </select>
            </label>

            <button type="button" onClick={onRemove} aria-label="Remove ingredient">
                X
            </button>
        </div>
    );
}
