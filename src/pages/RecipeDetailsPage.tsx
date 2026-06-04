import React from "react";
import { useParams } from "react-router-dom";

export default function RecipeDetailsPage() {
    const { recipeId } = useParams();

    return <div>Recipe Details Page for ID: {recipeId}</div>;
}
