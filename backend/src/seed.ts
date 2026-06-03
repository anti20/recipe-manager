import type { Recipe } from "./types.js";

export const sampleRecipes: Recipe[] = [
  {
    id: "creamy-garlic-pasta",
    title: "Creamy Garlic Pasta",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
    servings: 4,
    cookingTime: 25,
    ingredients: [
      { name: "spaghetti", quantity: 400, unit: "g" },
      { name: "garlic", quantity: 4, unit: "clove" },
      { name: "heavy cream", quantity: 300, unit: "ml" },
      { name: "parmesan", quantity: 80, unit: "g" },
      { name: "olive oil", quantity: 2, unit: "tbsp" },
      { name: "salt", quantity: 1, unit: "tsp" },
      { name: "black pepper", quantity: 2, unit: "pinch" }
    ],
    instructions: [
      "Cook the spaghetti in salted boiling water until al dente.",
      "Warm the olive oil in a pan and gently saute the garlic for 1 minute.",
      "Pour in the cream, add the parmesan, and stir until smooth.",
      "Toss the drained pasta with the sauce and season with salt and pepper."
    ]
  },
  {
    id: "paprika-chicken-traybake",
    title: "Paprika Chicken Traybake",
    image: "https://images.unsplash.com/photo-1512058454905-c1afe2e4c6c9?auto=format&fit=crop&w=1200&q=80",
    servings: 4,
    cookingTime: 50,
    ingredients: [
      { name: "chicken thighs", quantity: 8, unit: "piece" },
      { name: "potatoes", quantity: 800, unit: "g" },
      { name: "red onion", quantity: 2, unit: "piece" },
      { name: "smoked paprika", quantity: 2, unit: "tsp" },
      { name: "olive oil", quantity: 3, unit: "tbsp" },
      { name: "salt", quantity: 1, unit: "tsp" },
      { name: "black pepper", quantity: 3, unit: "pinch" }
    ],
    instructions: [
      "Heat the oven to 200 C and line a large tray.",
      "Cut the potatoes and onions into wedges and spread them on the tray.",
      "Rub the chicken with olive oil, paprika, salt, and pepper, then place on top.",
      "Roast for 40 minutes, turning the vegetables once, until the chicken is cooked through."
    ]
  },
  {
    id: "tomato-lentil-soup",
    title: "Tomato Lentil Soup",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    servings: 6,
    cookingTime: 35,
    ingredients: [
      { name: "red lentils", quantity: 250, unit: "g" },
      { name: "carrot", quantity: 2, unit: "piece" },
      { name: "onion", quantity: 1, unit: "piece" },
      { name: "garlic", quantity: 2, unit: "clove" },
      { name: "chopped tomatoes", quantity: 400, unit: "g" },
      { name: "vegetable stock", quantity: 1.2, unit: "l" },
      { name: "olive oil", quantity: 1, unit: "tbsp" }
    ],
    instructions: [
      "Heat the olive oil in a pot and soften the onion, carrot, and garlic.",
      "Add the lentils, chopped tomatoes, and stock, then bring to a boil.",
      "Reduce the heat and simmer for 25 minutes until the lentils are tender.",
      "Blend lightly for a thicker texture and serve hot."
    ]
  }
];
