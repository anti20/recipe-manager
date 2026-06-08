import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";

import { sampleRecipes } from "./seed.js";
import { units, type Ingredient, type Recipe, type Unit } from "./types.js";

type SqliteDatabase = Database<sqlite3.Database, sqlite3.Statement>;

type RecipeRow = {
  id: string;
  title: string;
  image: string | null;
  servings: number;
  cooking_time: number;
};

type IngredientRow = {
  recipe_id: string;
  position: number;
  name: string;
  quantity: number;
  unit: Unit;
};

type InstructionRow = {
  recipe_id: string;
  position: number;
  step: string;
};

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(currentDirectory, "../data");
const databasePath = path.join(dataDirectory, "recipes.sqlite");

let databasePromise: Promise<SqliteDatabase> | undefined;

export async function initializeDatabase(): Promise<SqliteDatabase> {
  if (!databasePromise) {
    databasePromise = createDatabase();
  }

  return databasePromise;
}

async function createDatabase(): Promise<SqliteDatabase> {
  mkdirSync(dataDirectory, { recursive: true });

  const database = await open({
    filename: databasePath,
    driver: sqlite3.Database
  });

  await database.exec("PRAGMA foreign_keys = ON");

  await database.exec(`
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      image TEXT DEFAULT NULL,
      servings INTEGER NOT NULL,
      cooking_time INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      name TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL CHECK(unit IN (${units.map((unit) => `'${unit}'`).join(", ")})),
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
      UNIQUE(recipe_id, position)
    );

    CREATE TABLE IF NOT EXISTS instruction_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      step TEXT NOT NULL,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
      UNIQUE(recipe_id, position)
    );
  `);

  await ensureRecipeImageColumn(database);
  await syncSeedImages(database);
  await seedDatabaseIfEmpty(database);

  return database;
}

async function ensureRecipeImageColumn(database: SqliteDatabase): Promise<void> {
  const columns = await database.all<{ name: string }[]>(
    "PRAGMA table_info(recipes)"
  );

  const hasImageColumn = columns.some((column) => column.name === "image");
  if (hasImageColumn) {
    return;
  }

  await database.exec("ALTER TABLE recipes ADD COLUMN image TEXT DEFAULT NULL");
}

async function syncSeedImages(database: SqliteDatabase): Promise<void> {
  for (const recipe of sampleRecipes) {
    await database.run(
      `
        UPDATE recipes
        SET image = ?
        WHERE id = ? AND (image IS NULL OR image = '')
      `,
      recipe.image,
      recipe.id
    );
  }
}

async function seedDatabaseIfEmpty(database: SqliteDatabase): Promise<void> {
  const existingRecipes = await database.get<{ count: number }>(
    "SELECT COUNT(*) as count FROM recipes"
  );

  if ((existingRecipes?.count ?? 0) > 0) {
    return;
  }

  await database.exec("BEGIN");

  try {
    for (const recipe of sampleRecipes) {
      await database.run(
        `
          INSERT INTO recipes (id, title, image, servings, cooking_time)
          VALUES (?, ?, ?, ?, ?)
        `,
        recipe.id,
        recipe.title,
        recipe.image,
        recipe.servings,
        recipe.cookingTime
      );

      await insertIngredients(database, recipe.id, recipe.ingredients);
      await insertInstructions(database, recipe.id, recipe.instructions);
    }

    await database.exec("COMMIT");
  } catch (error) {
    await database.exec("ROLLBACK");
    throw error;
  }
}

async function insertIngredients(
  database: SqliteDatabase,
  recipeId: string,
  ingredients: Ingredient[]
): Promise<void> {
  for (const [index, ingredient] of ingredients.entries()) {
    await database.run(
      `
        INSERT INTO ingredients (recipe_id, position, name, quantity, unit)
        VALUES (?, ?, ?, ?, ?)
      `,
      recipeId,
      index,
      ingredient.name,
      ingredient.quantity,
      ingredient.unit
    );
  }
}

async function insertInstructions(
  database: SqliteDatabase,
  recipeId: string,
  instructions: string[]
): Promise<void> {
  for (const [index, step] of instructions.entries()) {
    await database.run(
      `
        INSERT INTO instruction_steps (recipe_id, position, step)
        VALUES (?, ?, ?)
      `,
      recipeId,
      index,
      step
    );
  }
}

export async function getRecipes(): Promise<Recipe[]> {
  const database = await initializeDatabase();

  const [recipeRows, ingredientRows, instructionRows] = await Promise.all([
    database.all<RecipeRow[]>(`
      SELECT id, title, image, servings, cooking_time
      FROM recipes
      ORDER BY title ASC
    `),
    database.all<IngredientRow[]>(`
      SELECT recipe_id, position, name, quantity, unit
      FROM ingredients
      ORDER BY recipe_id ASC, position ASC
    `),
    database.all<InstructionRow[]>(`
      SELECT recipe_id, position, step
      FROM instruction_steps
      ORDER BY recipe_id ASC, position ASC
    `)
  ]);

  return buildRecipes(recipeRows, ingredientRows, instructionRows);
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  const database = await initializeDatabase();

  const recipeRow =
    (await database.get<RecipeRow>(
      `
        SELECT id, title, image, servings, cooking_time
        FROM recipes
        WHERE id = ?
      `,
      id
    )) ?? (await getRecipeByNumericRowId(database, id));

  if (!recipeRow) {
    return undefined;
  }

  const [ingredientRows, instructionRows] = await Promise.all([
    database.all<IngredientRow[]>(
      `
        SELECT recipe_id, position, name, quantity, unit
        FROM ingredients
        WHERE recipe_id = ?
        ORDER BY position ASC
      `,
      recipeRow.id
    ),
    database.all<InstructionRow[]>(
      `
        SELECT recipe_id, position, step
        FROM instruction_steps
        WHERE recipe_id = ?
        ORDER BY position ASC
      `,
      recipeRow.id
    )
  ]);

  return buildRecipes([recipeRow], ingredientRows, instructionRows)[0];
}

async function getRecipeByNumericRowId(
  database: SqliteDatabase,
  id: string
): Promise<RecipeRow | undefined> {
  if (!/^[1-9]\d*$/.test(id)) {
    return undefined;
  }

  return database.get<RecipeRow>(
    `
      SELECT id, title, image, servings, cooking_time
      FROM recipes
      WHERE rowid = ?
    `,
    Number(id)
  );
}

function buildRecipes(
  recipeRows: RecipeRow[],
  ingredientRows: IngredientRow[],
  instructionRows: InstructionRow[]
): Recipe[] {
  const ingredientsByRecipeId = ingredientRows.reduce<Map<string, Ingredient[]>>(
    (groupedIngredients, ingredient) => {
      const items = groupedIngredients.get(ingredient.recipe_id) ?? [];

      items.push({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit
      });

      groupedIngredients.set(ingredient.recipe_id, items);
      return groupedIngredients;
    },
    new Map()
  );

  const instructionsByRecipeId = instructionRows.reduce<Map<string, string[]>>(
    (groupedInstructions, instruction) => {
      const items = groupedInstructions.get(instruction.recipe_id) ?? [];

      items.push(instruction.step);

      groupedInstructions.set(instruction.recipe_id, items);
      return groupedInstructions;
    },
    new Map()
  );

  return recipeRows.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    image: recipe.image && recipe.image.length > 0 ? recipe.image : null,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: ingredientsByRecipeId.get(recipe.id) ?? [],
    instructions: instructionsByRecipeId.get(recipe.id) ?? []
  }));
}
