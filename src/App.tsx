import React from "react";
import { fetchRecipes } from "./api/api";

function App() {
    React.useEffect(() => {
        fetchRecipes().then((recipes) => {
            console.log("Fetched recipes:", recipes);
        });
    }, []);

    return (
        <main>
            <h1>Recipe Manager</h1>
            <p>Manage your favorite recipes.</p>
        </main>
    );
}

export default App;
