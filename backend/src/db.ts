import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";

import { sampleRecipes } from "./seed.js";
import { units, type Ingredient, type Recipe, type RecipeListResult, type RecipeCreateInput, type RecipeSort, type Unit } from "./types.js";

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

type CountRow = {
    count: number;
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
        driver: sqlite3.Database,
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
    const columns = await database.all<{ name: string }[]>("PRAGMA table_info(recipes)");

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
            recipe.id,
        );
    }
}

async function seedDatabaseIfEmpty(database: SqliteDatabase): Promise<void> {
    const existingRecipes = await database.get<{ count: number }>("SELECT COUNT(*) as count FROM recipes");

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
                recipe.cookingTime,
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

async function insertIngredients(database: SqliteDatabase, recipeId: string, ingredients: Ingredient[]): Promise<void> {
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
            ingredient.unit,
        );
    }
}

async function insertInstructions(database: SqliteDatabase, recipeId: string, instructions: string[]): Promise<void> {
    for (const [index, step] of instructions.entries()) {
        await database.run(
            `
        INSERT INTO instruction_steps (recipe_id, position, step)
        VALUES (?, ?, ?)
      `,
            recipeId,
            index,
            step,
        );
    }
}

export async function getRecipes(search: string | undefined, page: number, limit: number, sort: RecipeSort = "title-asc"): Promise<RecipeListResult> {
    const database = await initializeDatabase();
    const normalizedSearch = search?.trim();
    const hasSearch = Boolean(normalizedSearch);
    const offset = (page - 1) * limit;
    const searchCondition = "WHERE title LIKE ? COLLATE NOCASE";
    const searchValue = `%${normalizedSearch}%`;
    const orderByClause = getRecipeListOrderBy(sort);

    const [recipeRows, totalRow] = await Promise.all([
        hasSearch
            ? database.all<RecipeRow[]>(
                  `
            SELECT id, title, image, servings, cooking_time
            FROM recipes
            ${searchCondition}
            ORDER BY ${orderByClause}
            LIMIT ? OFFSET ?
          `,
                  searchValue,
                  limit,
                  offset,
              )
            : database.all<RecipeRow[]>(
                  `
            SELECT id, title, image, servings, cooking_time
            FROM recipes
            ORDER BY ${orderByClause}
            LIMIT ? OFFSET ?
          `,
                  limit,
                  offset,
              ),
        hasSearch
            ? database.get<CountRow>(
                  `
            SELECT COUNT(*) as count
            FROM recipes
            ${searchCondition}
          `,
                  searchValue,
              )
            : database.get<CountRow>(`
          SELECT COUNT(*) as count
          FROM recipes
        `),
    ]);

    const total = totalRow?.count ?? 0;

    const recipeIds = recipeRows.map((recipe) => recipe.id);

    if (recipeIds.length === 0) {
        return {
            recipes: [],
            total,
            page,
            limit,
        };
    }

    const placeholders = recipeIds.map(() => "?").join(", ");

    const [ingredientRows, instructionRows] = await Promise.all([
        database.all<IngredientRow[]>(
            `
      SELECT recipe_id, position, name, quantity, unit
      FROM ingredients
      WHERE recipe_id IN (${placeholders})
      ORDER BY recipe_id ASC, position ASC
    `,
            ...recipeIds,
        ),
        database.all<InstructionRow[]>(
            `
      SELECT recipe_id, position, step
      FROM instruction_steps
      WHERE recipe_id IN (${placeholders})
      ORDER BY recipe_id ASC, position ASC
    `,
            ...recipeIds,
        ),
    ]);

    return {
        recipes: buildRecipes(recipeRows, ingredientRows, instructionRows),
        total,
        page,
        limit,
    };
}

function getRecipeListOrderBy(sort: RecipeSort): string {
    switch (sort) {
        case "title-desc":
            return "title DESC";
        case "cooking-time-asc":
            return "cooking_time ASC, title ASC";
        case "cooking-time-desc":
            return "cooking_time DESC, title ASC";
        case "title-asc":
        default:
            return "title ASC";
    }
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
    const database = await initializeDatabase();

    const recipeRow = await getRecipeRowById(database, id);

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
            recipeRow.id,
        ),
        database.all<InstructionRow[]>(
            `
        SELECT recipe_id, position, step
        FROM instruction_steps
        WHERE recipe_id = ?
        ORDER BY position ASC
      `,
            recipeRow.id,
        ),
    ]);

    return buildRecipes([recipeRow], ingredientRows, instructionRows)[0];
}

export async function createRecipe(recipe: RecipeCreateInput): Promise<Recipe> {
    const database = await initializeDatabase();
    const recipeId = randomUUID();

    await database.exec("BEGIN");

    try {
        await database.run(
            `
        INSERT INTO recipes (id, title, image, servings, cooking_time)
        VALUES (?, ?, ?, ?, ?)
      `,
            recipeId,
            recipe.title,
            recipe.image,
            recipe.servings,
            recipe.cookingTime,
        );

        await insertIngredients(database, recipeId, recipe.ingredients);
        await insertInstructions(database, recipeId, recipe.instructions);

        await database.exec("COMMIT");
    } catch (error) {
        await database.exec("ROLLBACK");
        throw error;
    }

    const createdRecipe = await getRecipeById(recipeId);

    if (!createdRecipe) {
        throw new Error("Failed to load created recipe.");
    }

    return createdRecipe;
}

export async function updateRecipe(id: string, recipe: RecipeCreateInput): Promise<Recipe | undefined> {
    const database = await initializeDatabase();
    const existingRecipe = await getRecipeRowById(database, id);

    if (!existingRecipe) {
        return undefined;
    }

    await database.exec("BEGIN");

    try {
        await database.run(
            `
        UPDATE recipes
        SET title = ?, image = ?, servings = ?, cooking_time = ?
        WHERE id = ?
      `,
            recipe.title,
            recipe.image,
            recipe.servings,
            recipe.cookingTime,
            existingRecipe.id,
        );

        await database.run("DELETE FROM ingredients WHERE recipe_id = ?", existingRecipe.id);
        await database.run("DELETE FROM instruction_steps WHERE recipe_id = ?", existingRecipe.id);

        await insertIngredients(database, existingRecipe.id, recipe.ingredients);
        await insertInstructions(database, existingRecipe.id, recipe.instructions);

        await database.exec("COMMIT");
    } catch (error) {
        await database.exec("ROLLBACK");
        throw error;
    }

    const updatedRecipe = await getRecipeById(existingRecipe.id);

    if (!updatedRecipe) {
        throw new Error("Failed to load updated recipe.");
    }

    return updatedRecipe;
}

export async function deleteRecipe(id: string): Promise<boolean> {
    const database = await initializeDatabase();
    const existingRecipe = await getRecipeRowById(database, id);

    if (!existingRecipe) {
        return false;
    }

    await database.run("DELETE FROM recipes WHERE id = ?", existingRecipe.id);

    return true;
}

async function getRecipeRowById(database: SqliteDatabase, id: string): Promise<RecipeRow | undefined> {
    return (
        (await database.get<RecipeRow>(
            `
        SELECT id, title, image, servings, cooking_time
        FROM recipes
        WHERE id = ?
      `,
            id,
        )) ?? (await getRecipeByNumericRowId(database, id))
    );
}

async function getRecipeByNumericRowId(database: SqliteDatabase, id: string): Promise<RecipeRow | undefined> {
    if (!/^[1-9]\d*$/.test(id)) {
        return undefined;
    }

    return database.get<RecipeRow>(
        `
      SELECT id, title, image, servings, cooking_time
      FROM recipes
      WHERE rowid = ?
    `,
        Number(id),
    );
}

function buildRecipes(recipeRows: RecipeRow[], ingredientRows: IngredientRow[], instructionRows: InstructionRow[]): Recipe[] {
    const ingredientsByRecipeId = ingredientRows.reduce<Map<string, Ingredient[]>>((groupedIngredients, ingredient) => {
        const items = groupedIngredients.get(ingredient.recipe_id) ?? [];

        items.push({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
        });

        groupedIngredients.set(ingredient.recipe_id, items);
        return groupedIngredients;
    }, new Map());

    const instructionsByRecipeId = instructionRows.reduce<Map<string, string[]>>((groupedInstructions, instruction) => {
        const items = groupedInstructions.get(instruction.recipe_id) ?? [];

        items.push(instruction.step);

        groupedInstructions.set(instruction.recipe_id, items);
        return groupedInstructions;
    }, new Map());

    return recipeRows.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image && recipe.image.length > 0 ? recipe.image : null,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: ingredientsByRecipeId.get(recipe.id) ?? [],
        instructions: instructionsByRecipeId.get(recipe.id) ?? [],
    }));
}
