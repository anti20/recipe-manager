import cors from "cors";
import express from "express";

import { getRecipeById, getRecipes, initializeDatabase } from "./db.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/recipes", async (_request, response) => {
  try {
    const recipes = await getRecipes();
    response.json(recipes);
  } catch (error) {
    response.status(500).json({
      message: "Failed to load recipes."
    });
  }
});

app.get("/recipes/:id", async (request, response) => {
  try {
    const recipe = await getRecipeById(request.params.id);

    if (!recipe) {
      response.status(404).json({
        message: "Recipe not found"
      });
      return;
    }

    response.json(recipe);
  } catch (error) {
    response.status(500).json({
      message: "Failed to load recipe."
    });
  }
});

async function startServer(): Promise<void> {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`Recipe backend listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start backend server.", error);
  process.exit(1);
});
