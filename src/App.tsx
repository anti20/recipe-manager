import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import CreateRecipePage from "./pages/CreateRecipePage";

function App() {
    return (
        <Router>
            <main>
                <Routes>
                    <Route path="/" element={<RecipesPage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/recipes/new" element={<CreateRecipePage />} />
                    <Route path="/recipes/:recipeId" element={<RecipeDetailsPage />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
