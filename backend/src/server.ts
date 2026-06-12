import cors from "cors";
import express from "express";

import {
  createRecipe,
  deleteRecipe,
  getRecipeById,
  getRecipes,
  initializeDatabase,
  updateRecipe
} from "./db.js";
import {
  units,
  type Ingredient,
  type RecipeCreateInput,
  type Unit
} from "./types.js";

const app = express();
const port = 3000;
const allowedUnits = new Set<string>(units);

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

app.post("/recipes", async (request, response) => {
  const recipe = parseRecipeInput(request.body);

  if (!recipe) {
    response.status(400).json({
      message: "Invalid recipe data"
    });
    return;
  }

  try {
    const createdRecipe = await createRecipe(recipe);
    response.status(201).json(createdRecipe);
  } catch (error) {
    response.status(500).json({
      message: "Failed to create recipe."
    });
  }
});

app.put("/recipes/:id", async (request, response) => {
  const recipe = parseRecipeInput(request.body);

  if (!recipe) {
    response.status(400).json({
      message: "Invalid recipe data"
    });
    return;
  }

  try {
    const updatedRecipe = await updateRecipe(request.params.id, recipe);

    if (!updatedRecipe) {
      response.status(404).json({
        message: "Recipe not found"
      });
      return;
    }

    response.status(200).json(updatedRecipe);
  } catch (error) {
    response.status(500).json({
      message: "Failed to update recipe."
    });
  }
});

app.delete("/recipes/:id", async (request, response) => {
  try {
    const deletedRecipe = await deleteRecipe(request.params.id);

    if (!deletedRecipe) {
      response.status(404).json({
        message: "Recipe not found"
      });
      return;
    }

    response.status(204).send();
  } catch (error) {
    response.status(500).json({
      message: "Failed to delete recipe."
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

function parseRecipeInput(body: unknown): RecipeCreateInput | undefined {
  if (!isRecord(body)) {
    return undefined;
  }

  const { title, image, servings, cookingTime, ingredients, instructions } =
    body;

  if (
    !isNonEmptyString(title) ||
    !isNonEmptyString(image) ||
    !isPositiveNumber(servings) ||
    !isPositiveNumber(cookingTime) ||
    !Array.isArray(ingredients) ||
    ingredients.length === 0 ||
    !Array.isArray(instructions) ||
    instructions.length === 0
  ) {
    return undefined;
  }

  const parsedIngredients: Ingredient[] = [];

  for (const ingredient of ingredients) {
    const parsedIngredient = parseIngredient(ingredient);

    if (!parsedIngredient) {
      return undefined;
    }

    parsedIngredients.push(parsedIngredient);
  }

  const parsedInstructions: string[] = [];

  for (const instruction of instructions) {
    if (!isNonEmptyString(instruction)) {
      return undefined;
    }

    parsedInstructions.push(instruction);
  }

  return {
    title,
    image,
    servings,
    cookingTime,
    ingredients: parsedIngredients,
    instructions: parsedInstructions
  };
}

function parseIngredient(ingredient: unknown): Ingredient | undefined {
  if (!isRecord(ingredient)) {
    return undefined;
  }

  const { name, quantity, unit } = ingredient;

  if (
    !isNonEmptyString(name) ||
    !isFiniteNumber(quantity) ||
    !isAllowedUnit(unit)
  ) {
    return undefined;
  }

  return {
    name,
    quantity,
    unit
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isPositiveNumber(value: unknown): value is number {
  return isFiniteNumber(value) && value > 0;
}

function isAllowedUnit(value: unknown): value is Unit {
  return typeof value === "string" && allowedUnits.has(value);
}

startServer().catch((error) => {
  console.error("Failed to start backend server.", error);
  process.exit(1);
});
