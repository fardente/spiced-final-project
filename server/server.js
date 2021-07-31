const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();

const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "..", "client", "public")));

// Get all Recipes
app.get("/api/recipes", async (req, res) => {
    console.log("getting recipes");
    res.json(await db.getRecipes());
});

// Get recipe by id
app.get("/api/recipes/:id", async (req, res) => {
    console.log("getting recipe", req.params.id);
    res.json(await db.getRecipe(req.params.id));
});

// Update a recipe
app.put("/api/recipes", async (req, res) => {
    console.log("server updateing recipe", req.params.id);
    res.json(await db.updateRecipe(req.body));
});

// Get ingredients for a recipe
app.get("/api/recipes/:id/items", async (req, res) => {
    console.log("getting recipe items", req.params.id);
    res.json(await db.getRecipeItems(req.params.id));
});

// Add ingredients to shopping list
app.post("/api/recipes/buy", async (req, res) => {
    console.log("putting stuff on the shopping list", req.body);
    res.json(await db.addShoppingItems(req.body));
});

// Get all shopping items
app.get("/api/shopping/items", async (req, res) => {
    console.log("getting shopping items");
    res.json(await db.getShoppingItems());
});

// Checkmark a shopping item
app.put("/api/shopping/check", async (req, res) => {
    console.log("checking item", req.body);
    res.json(await db.checkShoppingItem(req.body));
});

// Delete a shopping item
app.post("/api/shopping/delete", async (req, res) => {
    console.log("Server deleting item", req.body);
    res.json(await db.deleteShoppingItem(req.body));
});

app.get("*", function (req, res) {
    console.log("*ing");
    res.sendFile(path.join(__dirname, "..", "client", "public", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
