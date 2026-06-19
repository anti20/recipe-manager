# Recipe Manager API Reference

## Overview

- Base URL: `http://localhost:3000`
- Content type: `application/json`
- CORS: enabled
- API style: REST

This document describes the backend API currently implemented in [backend/src/server.ts](/Users/antalarnoldgati/Projects/recipe-manager/backend/src/server.ts:1).

## Data Models

### Recipe

```json
{
  "id": "string",
  "title": "string",
  "image": "string | null",
  "servings": 4,
  "cookingTime": 30,
  "ingredients": [
    {
      "name": "Flour",
      "quantity": 250,
      "unit": "g"
    }
  ],
  "instructions": ["Mix ingredients", "Bake for 25 minutes"]
}
```

### Recipe Create / Update Payload

`POST /recipes` and `PUT /recipes/:id` expect the same payload shape:

```json
{
  "title": "string",
  "image": "string",
  "servings": 4,
  "cookingTime": 30,
  "ingredients": [
    {
      "name": "Flour",
      "quantity": 250,
      "unit": "g"
    }
  ],
  "instructions": ["Mix ingredients", "Bake for 25 minutes"]
}
```

Validation rules:

- `title` must be a non-empty string.
- `image` must be a non-empty string.
- `servings` must be a positive number.
- `cookingTime` must be a positive number.
- `ingredients` must be a non-empty array.
- Each ingredient must include:
  - `name`: non-empty string
  - `quantity`: finite number
  - `unit`: one of `g`, `dkg`, `kg`, `ml`, `dl`, `l`, `tsp`, `tbsp`, `piece`, `pinch`, `clove`
- `instructions` must be a non-empty array of non-empty strings.

## Endpoints

### GET `/recipes`

Returns a paginated recipe list.

Query parameters:

- `search`: optional string. Filters recipes by title using case-insensitive partial matching.
- `page`: optional positive integer. Default: `1`.
- `limit`: optional positive integer. Default: `10`. Maximum: `50`.
- `sort`: optional string. Default: `title-asc`.

Supported `sort` values:

- `title-asc`
- `title-desc`
- `cooking-time-asc`
- `cooking-time-desc`
- `servings-asc`
- `servings-desc`

If `sort` is missing or invalid, the API falls back to `title-asc`.

Response:

```json
{
  "recipes": [
    {
      "id": "recipe-id",
      "title": "Pancakes",
      "image": "https://example.com/pancakes.jpg",
      "servings": 4,
      "cookingTime": 20,
      "ingredients": [
        {
          "name": "Flour",
          "quantity": 250,
          "unit": "g"
        }
      ],
      "instructions": ["Mix", "Cook"]
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 10
}
```

Behavior:

- Sorting is applied in the database query before pagination.
- Search filters by recipe title only.

Possible responses:

- `200 OK`: list returned successfully
- `500 Internal Server Error`: `{ "message": "Failed to load recipes." }`

Example:

```http
GET /recipes?search=chicken&page=1&limit=20&sort=cooking-time-asc
```

### GET `/recipes/:id`

Returns one recipe by ID.

Path parameters:

- `id`: recipe identifier

Response:

```json
{
  "id": "recipe-id",
  "title": "Pancakes",
  "image": "https://example.com/pancakes.jpg",
  "servings": 4,
  "cookingTime": 20,
  "ingredients": [
    {
      "name": "Flour",
      "quantity": 250,
      "unit": "g"
    }
  ],
  "instructions": ["Mix", "Cook"]
}
```

Possible responses:

- `200 OK`: recipe returned successfully
- `404 Not Found`: `{ "message": "Recipe not found" }`
- `500 Internal Server Error`: `{ "message": "Failed to load recipe." }`

### POST `/recipes`

Creates a new recipe.

Request body:

- Use the Recipe Create / Update Payload shape above.

Response:

- `201 Created` with the created `Recipe`

Possible responses:

- `201 Created`: recipe created successfully
- `400 Bad Request`: `{ "message": "Invalid recipe data" }`
- `500 Internal Server Error`: `{ "message": "Failed to create recipe." }`

### PUT `/recipes/:id`

Updates an existing recipe.

Path parameters:

- `id`: recipe identifier

Request body:

- Use the Recipe Create / Update Payload shape above.

Response:

- `200 OK` with the updated `Recipe`

Possible responses:

- `200 OK`: recipe updated successfully
- `400 Bad Request`: `{ "message": "Invalid recipe data" }`
- `404 Not Found`: `{ "message": "Recipe not found" }`
- `500 Internal Server Error`: `{ "message": "Failed to update recipe." }`

### DELETE `/recipes/:id`

Deletes a recipe by ID.

Path parameters:

- `id`: recipe identifier

Response:

- `204 No Content`

Possible responses:

- `204 No Content`: recipe deleted successfully
- `404 Not Found`: `{ "message": "Recipe not found" }`
- `500 Internal Server Error`: `{ "message": "Failed to delete recipe." }`

## Notes

- `GET /recipes` defaults to sorting by title ascending.
- The backend accepts sort values even if the current frontend does not expose them.
- All validation and status codes in this document reflect the current implementation, not a generalized REST convention.
