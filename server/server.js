const express = require("express");
const path = require("path");
const db = require("./db");
const uploader = require("./uploader");
const { upload } = require("./s3");

const app = express();

const PORT = process.env.PORT || 3001;
const awsBucketUrl = "https://nandoseimer.s3.amazonaws.com/";

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

// Add recipe
app.post(
    "/api/recipes/add",
    uploader.single("file"),
    upload,
    async (req, res) => {
        //addRecipe -> get recipe_id
        console.log("server adding recipe", req.body, "req.file", req.file);
        const recipe_id = await db.addRecipe(req.body);
        //addIngredients -> get [item_ids]
        const ingredients = JSON.parse(req.body.ingredients);
        const ingredient_ids = await db.addIngredients(ingredients);
        // handle recipe exists
        if (recipe_id.error) {
            res.statusCode = 400;
            res.json(recipe_id);
            return;
        }
        // addRecipeIngredients
        const recipeItems = { recipe_id, ingredient_ids };
        const recipeItemsResult = await db.addRecipeIngredients(recipeItems);
        // add image
        if (req.file) {
            req.body.url = awsBucketUrl + req.file.filename;
            if (req.file) {
                await db.updateImage(recipe_id, req.body.url);
            }
        }

        res.json(recipeItemsResult);
    }
);

// Update image
app.put(
    "/api/recipes/:id/image",
    uploader.single("file"),
    upload,
    async (req, res) => {
        req.body.url = awsBucketUrl + req.file.filename;
        if (req.file) {
            let result = await db.updateImage(req.params.id, req.body.url);
            console.log("server updateimage result", result);
            if (result) {
                res.json(result);
            } else {
                res.statusCode = 500;
                res.json();
            }
        } else {
            res.json({
                success: false,
            });
        }
    }
);

// Update a recipe
app.put("/api/recipes", async (req, res) => {
    console.log("server updateing recipe", req.body.id);
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

// Delete a recipe
app.post("/api/recipes/delete", async (req, res) => {
    console.log("Server deleting item", req.body);
    res.json(await db.deleteRecipe(req.body));
});

// Get all shopping items
app.get("/api/shopping/items", async (req, res) => {
    console.log("getting shopping items");
    // res.json(await db.getShoppingItems());
    const items = await db.getShoppingItems();
    console.log("server get shopping items items", items);
    let result = [];
    for (const item of items) {
        const tags = await db.getShoppingItemTags(item);
        console.log("tags", tags);
        result.push({ ...item, tags });
    }
    console.log("server get shopping items res", result);
    res.json(result);
});

// Add a shopping item
app.post("/api/shopping/add", async (req, res) => {
    console.log("server adding shopping item", req.body);
    const newItem = await db.addNewShoppingItem(req.body);
    const item_name = req.body.newItem;
    console.log("new", { ...newItem, item_name });
    res.json({ ...newItem, item_name, tags: [] });
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

// Search shopping items
app.get("/api/shopping/search", async (req, res) => {
    console.log(req.query.q);
    try {
        res.json(await db.searchShoppingItems(req.query.q));
    } catch (error) {
        res.status(500);
        res.json({ ...error });
    }
});

// Get ingredients
app.get("/api/ingredients", async (req, res) => {
    console.log("Server get ingredients");
    res.json(await db.getIngredients());
});

// Search ingredients
app.get("/api/ingredients/search", async (req, res) => {
    console.log(req.query.q);
    try {
        res.json(await db.searchIngredients(req.query.q));
    } catch (error) {
        res.status(500);
        res.json({ ...error });
    }
});

// Get tags for item
// app.get("/api/item");

// Remove tag from shopping item
app.post("/api/tags/remove", async (req, res) => {
    try {
        console.log("server remove tag from item", req.body);
        res.json(await db.removeTagFromItem(req.body));
    } catch (error) {
        console.error("server remove tag from item", error);
        res.status(500);
        // res.json({...error});
    }
});

// Add tag
app.post("/api/tags", async (req, res) => {
    try {
        console.log("server add tag", req.body);
        res.json(await db.addTag(req.body));
    } catch (error) {
        console.log("server add tag", error);
        res.status(500);
        res.json({ ...error });
    }
});

// Add tag to shopping item
// TODO

app.get("*", function (req, res) {
    console.log("*ing");
    res.sendFile(path.join(__dirname, "..", "client", "public", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
