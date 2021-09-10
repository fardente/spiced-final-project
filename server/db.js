const pg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = pg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("./secrets.json");
    db = pg(`postgres:${dbUser}:${dbPass}@localhost:5432/recipemanager`);
}

function stringHelper(string) {
    string = string.trim();
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string;
}

async function getShoppingItems() {
    try {
        const { rows } = await db.query(
            `SELECT s.id, s.checked, i.item_name FROM shopping_items AS s
            JOIN items as i
            ON i.id = s.item_id
            ORDER BY
            s.checked ASC, s.id DESC`,
            []
        );
        return rows;
    } catch (error) {
        console.error("Error getting shopping items", error);
    }
}

async function addNewShoppingItem({ newItem }) {
    newItem = stringHelper(newItem);
    try {
        console.log("db addnews", newItem);
        const id = await addIngredient(newItem);
        console.log("added, new/old id: ", id);
        const res = await addShoppingItem(id);
        if (res.length < 1) return { error: "already on list" };
        console.log("added so shopping:", res);
        return res[0];
    } catch (error) {
        console.error("DB addNewShoppingItem error ", error);
    }
}

async function addShoppingItem(id) {
    console.log("adding shoopinitembyid", id);
    try {
        const { rows } = await db.query(
            `INSERT INTO shopping_items (item_id) VALUES ($1) ON CONFLICT DO NOTHING RETURNING *`,
            [id]
        );
        console.log("adding shoppinbyid", rows);
        return rows;
    } catch (error) {
        console.error("db add shopping item", id, error);
    }
}

async function addShoppingItems(data) {
    let result = [];
    for (const item in data) {
        try {
            const { rows } = await addShoppingItem(data[item]);
            result.push(rows);
        } catch (error) {
            console.error("db add multiple shopping items", data[item], error);
        }
    }
    return result;
}

async function checkShoppingItem({ id, checked }) {
    try {
        const { rows } = await db.query(
            `UPDATE shopping_items SET checked = $2 WHERE id = $1 RETURNING *`,
            [id, checked]
        );
        return rows;
    } catch (error) {
        console.error("DB check item", error);
    }
}

async function deleteShoppingItem({ id }) {
    try {
        const { rows } = await db.query(
            `DELETE FROM shopping_items WHERE id = $1`,
            [id]
        );
        return rows;
    } catch (error) {
        console.error("DB delete shopping item", error);
    }
}

async function getRecipes() {
    try {
        const { rows } = await db.query(
            `SELECT * FROM recipes ORDER BY id DESC`,
            []
        );
        return rows;
    } catch (error) {
        console.error("Error getting recipes", error);
    }
}

async function getRecipe(id) {
    try {
        const { rows } = await db.query(
            `SELECT * FROM recipes
        WHERE id = $1`,
            [id]
        );
        return rows;
    } catch (error) {
        console.error("db getRecipe error", id, error);
    }
}

async function getRecipeItems(recipe_id) {
    try {
        const { rows } = await db.query(
            `SELECT *, CASE WHEN EXISTS
            (SELECT * FROM shopping_items s WHERE s.item_id = ri.item_id)
            THEN true ELSE false END AS exists
            FROM recipe_items ri
            JOIN items
            ON ri.item_id = items.id 
            WHERE recipe_id = $1`,
            [recipe_id]
        );
        return rows;
    } catch (error) {
        console.error("db getRecipeItems Error", recipe_id, error);
    }
}
// async function getRecipeItems(recipe_id) {
//     try {
//         const { rows } = await db.query(
//             `SELECT * FROM recipe_items
//             JOIN items
//             ON recipe_items.item_id = items.id
//             WHERE recipe_id = $1`,
//             [recipe_id]
//         );
//         console.log("db getRecipeItems", recipe_id, rows);
//         return rows;
//     } catch (error) {
//         console.error("Error getting RecipeItems", recipe_id, error);
//     }
// }

async function addRecipe({ recipe_name, recipe_preparation }) {
    console.log("DB addRecipe adding", recipe_name, recipe_preparation);
    recipe_name = stringHelper(recipe_name);
    try {
        const { rows } = await db.query(
            `INSERT INTO recipes (recipe_name, recipe_preparation)
             VALUES ($1, $2) RETURNING id`,
            [recipe_name, recipe_preparation]
        );
        return rows[0].id;
    } catch (error) {
        console.error("DB addRecipe", error);
        return { error };
    }
}

async function updateRecipe({
    recipe_name,
    recipe_preparation,
    id: recipe_id,
    ingredients,
}) {
    console.log(
        "db updateRecipe",
        recipe_name,
        recipe_preparation,
        recipe_id,
        ingredients
    );
    recipe_name = stringHelper(recipe_name);
    try {
        const deleted = await deleteAllRecipeIngredients(recipe_id);
        console.log("deleted", deleted);
        const ingredient_ids = await addIngredients(ingredients);
        const recipeItems = { recipe_id, ingredient_ids };
        const inserted = await addRecipeIngredients(recipeItems);
        console.log("db updateRecipe inserted:", inserted);
    } catch (error) {
        console.error("db updateRecipe", recipe_id, ingredients, error);
    }
    try {
        const { rows } = await db.query(
            `UPDATE recipes
            SET recipe_name = $1, recipe_preparation = $2
            WHERE id = $3
            RETURNING *`,
            [recipe_name, recipe_preparation, recipe_id]
        );
        return rows;
    } catch (error) {
        console.error("DB updateRecipe", error);
    }
}

async function deleteRecipe({ id }) {
    console.log("db deleteRecipe id ", id);
    try {
        const { rows } = await db.query(
            `DELETE FROM recipes WHERE id = $1 RETURNING *`,
            [id]
        );
        return rows;
    } catch (error) {
        console.error("DB deleteRecipe", error);
    }
}

async function updateImage(id, image_url) {
    const { rows } = await db.query(
        "UPDATE recipes SET image_url = $2 WHERE id = $1 RETURNING *",
        [id, image_url]
    );
    if (rows.length > 0) {
        console.log("db updateImage", rows);
        return rows[0].image_url;
    }
    return null;
}

async function addRecipeIngredient(recipe_id, item_id) {
    console.log("db addRecipeIngredient", recipe_id, item_id);
    try {
        const { rows } = await db.query(
            `INSERT INTO recipe_items
            (recipe_id, item_id) VALUES ($1,$2) 
            RETURNING *`,
            [recipe_id, item_id]
        );
        return rows[0];
    } catch (error) {
        console.error("db addRecipeIngredient", error);
    }
}

async function addRecipeIngredients({ recipe_id, ingredient_ids }) {
    let result = [];
    for (const item_id of ingredient_ids) {
        try {
            const id = await addRecipeIngredient(recipe_id, item_id);
            result.push(id);
        } catch (error) {
            console.error("db addRecipeIngredients", item_id, error);
        }
    }
    return result;
}

async function deleteRecipeIngredient(recipe_id, item_id) {
    console.log("db deleteRecipeIngredient", recipe_id, item_id);
    try {
        const { rows } = await db.query(
            `DELETE FROM recipe_items
            WHERE recipe_id = $1 AND item_it = $2
            RETURNING *`,
            [recipe_id, item_id]
        );
        return rows[0];
    } catch (error) {
        console.error("db deleteRecipeIngredient", recipe_id, item_id, error);
    }
}

async function deleteRecipeIngredients({ recipe_id, ingredient_ids }) {
    let result = [];
    for (const item_id of ingredient_ids) {
        try {
            const id = await deleteRecipeIngredient(recipe_id, item_id);
            result.push(id);
        } catch (error) {
            console.error(
                "db deleteRecipeIngredients",
                recipe_id,
                item_id,
                error
            );
        }
    }
    return result;
}

async function deleteAllRecipeIngredients(recipe_id) {
    console.log("db deleteAllRecipeIngredients", recipe_id);
    try {
        const { rows } = await db.query(
            `
        DELETE FROM recipe_items
        WHERE recipe_id = $1
        RETURNING *`,
            [recipe_id]
        );
        return rows;
    } catch (error) {
        console.error("db deleteAllRecipeIngredients", recipe_id, error);
    }
}

async function addIngredient(name) {
    if (name == "") return;
    name = stringHelper(name);
    try {
        let result = await getIngredientIdByName(name);
        console.log(
            result,
            result.length > 0
                ? `ingredient ${name} already existed`
                : `ingredient ${name} didnt exist`
        );
        if (result.length > 0) {
            return result[0].id;
        } else {
            const { rows } = await db.query(
                `INSERT INTO items (item_name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id`,
                [name]
            );
            console.log("db addIngredient rows for", name, rows);
            if (rows.length > 0) {
                result = rows[0].id;
                return result;
            }
            return null;
        }
    } catch (error) {
        console.error("db addIngredient", name, error.detail);
    }
}

async function addIngredients(ingredients) {
    let ids = [];
    for (const item of ingredients) {
        if (item.item_name == "") continue;
        try {
            const result = await addIngredient(item.item_name);
            ids.push(result);
        } catch (error) {
            console.error("db addIngredients", item, error);
        }
    }
    // console.log("db addIngredients ids", ids);
    return ids;
}

async function getIngredients() {
    try {
        const { rows } = await db.query(`SELECT * FROM items`);
        console.log("db getingredients rows", rows);
        return rows;
    } catch (error) {
        console.error("db getIngredients error", error.message);
    }
}

async function getIngredientIdByName(name) {
    try {
        const { rows } = await db.query(
            `SELECT id FROM items WHERE UPPER(item_name) = UPPER($1)`,
            [name]
        );
        console.log("db getIngredientIdByName rows for", name, rows);
        return rows;
    } catch (error) {
        console.error("db getIngredientIdByName error", error.message);
    }
}

// Search Ingredients
async function searchIngredients(query) {
    try {
        const { rows } = await db.query(
            `SELECT * FROM items WHERE item_name ILIKE $1`,
            [query + "%"]
        );
        console.log("db searchIngredients found", rows);
        return rows;
    } catch (error) {
        console.error("db searchIngredients", error);
        throw error;
    }
}

async function getShoppingItemTags({ id }) {
    try {
        const { rows } = await db.query(
            `SELECT tag_id, tag_name FROM tags_items as ti
            JOIN tags AS t
            ON t.id = ti.tag_id
            JOIN items as i
            ON i.id = ti.shopping_item_id
            WHERE i.id = $1`,
            [id]
        );
        console.log("db getShoppingItemTags", rows, id);
        return rows;
    } catch (error) {
        console.log("getShoppingItemTags", error);
    }
}

async function addTag({ tag_name, shopping_item_id }) {
    try {
        let { rows } = await db.query(
            `SELECT id AS tag_id, tag_name FROM tags WHERE tag_name = $1`,
            [tag_name]
        );
        console.log("db addTag select result", rows);
        if (rows.length < 1) {
            ({ rows } = await db.query(
                `INSERT INTO tags (tag_name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id AS tag_id`,
                [tag_name]
            ));
        }
        console.log("db addTag first add rows", rows);
        const new_tag_id = rows[0].tag_id;
        console.log("db add Tag newtagid", new_tag_id, shopping_item_id);
        const result = await addTagToShoppingItem({
            tag_id: new_tag_id,
            shopping_item_id,
        });
        if (result.length < 1) {
            return null;
        }
        return result;
    } catch (error) {
        console.error("db addTag", error);
        throw error;
    }
}

async function addTagToShoppingItem({ tag_id, shopping_item_id }) {
    try {
        const { rows } = await db.query(
            `INSERT INTO tags_items (tag_id, shopping_item_id) VALUES ($1, $2) RETURNING *`,
            [tag_id, shopping_item_id]
        );
        console.log("db addTagToShoppingItem", rows);
        if (rows.length < 1) {
            console.log("addTagToShoppinItem rows", rows);
            return rows;
        }
        return rows;
    } catch (error) {
        console.log("db addTagToItem", error);
        throw error;
    }
}

async function removeTagFromItem({ tag_id, shopping_item_id }) {
    try {
        const { rows } = await db.query(
            `DELETE FROM tags_items WHERE tag_id = $1 AND shopping_item_id = $2`,
            [tag_id, shopping_item_id]
        );
        return rows;
    } catch (error) {
        console.error("db removeTagFromItem", error);
    }
}

module.exports = {
    getShoppingItems,
    addNewShoppingItem,
    addShoppingItem,
    addShoppingItems,
    checkShoppingItem,
    deleteShoppingItem,
    searchIngredients,
    getRecipes,
    getRecipe,
    getRecipeItems,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    updateImage,
    getIngredients,
    addIngredients,
    addIngredient,
    addRecipeIngredients,
    addRecipeIngredient,
    deleteRecipeIngredient,
    deleteRecipeIngredients,
    deleteAllRecipeIngredients,
    getIngredientIdByName,
    getShoppingItemTags,
    addTag,
    addTagToShoppingItem,
    removeTagFromItem,
};
