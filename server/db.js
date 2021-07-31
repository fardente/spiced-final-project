const pg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = pg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("./secrets.json");
    db = pg(`postgres:${dbUser}:${dbPass}@localhost:5432/recipemanager`);
}

async function getShoppingItems() {
    try {
        const { rows } = await db.query(
            `SELECT s.id, s.checked, i.item_name FROM shopping_items AS s
            JOIN items as i
            ON i.id = s.item_id`,
            []
        );
        console.log("rows", rows);
        return rows;
    } catch (error) {
        console.error("Error getting shopping items", error);
    }
}

async function addShoppingItem(id) {
    try {
        const { rows } = await db.query(
            `INSERT INTO shopping_items (item_id) VALUES ($1) ON CONFLICT DO NOTHING RETURNING *`,
            [id]
        );
        return rows;
    } catch (error) {
        console.error("db add shopping items", id, error);
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
        console.log("rows check", rows);
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
        console.log("deleteShoppingItems", rows);
        return rows;
    } catch (error) {
        console.error("DB delete shopping item", error);
    }
}

// async function buyRecipe({}){

// }

async function getRecipes() {
    try {
        const { rows } = await db.query(`SELECT * FROM recipes`, []);
        console.log("rows", rows);
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
        console.log("db getRecipe", rows);
        return rows;
    } catch (error) {
        console.error("Error getting recipe", id, error);
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
        console.log("db getRecipeItems", recipe_id, rows);
        return rows;
    } catch (error) {
        console.error("Error getting RecipeItems", recipe_id, error);
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

async function addRecipe({ name, preparation }) {
    try {
        const { rows } = await db.query(
            `INSERT INTO recipes (recipe_name, recipe_preparation)
             VALUES ($1, $2) RETURNING *`,
            [name, preparation]
        );
        console.log("db addRecipe", rows);
        return rows;
    } catch (error) {
        console.error("DB addrecipe", error);
    }
}

async function updateRecipe({ recipe_name, recipe_preparation, id }) {
    try {
        const { rows } = await db.query(
            `UPDATE recipes
            SET recipe_name = $1, recipe_preparation = $2
            WHERE id = $3
            RETURNING *`,
            [recipe_name, recipe_preparation, id]
        );
        console.log("db updateRecipe", rows);
        return rows;
    } catch (error) {
        console.error("DB updateRecipe", error);
    }
}

async function deleteRecipe({ id }) {
    try {
        const { rows } = await db.query(
            `DELETE FROM recipes WHERE id = $1 RETURNING *`,
            [id]
        );
        console.log("DB deleteRecipe", rows);
        return rows;
    } catch (error) {
        console.error("DB deleteRecipe", error);
    }
}
module.exports = {
    getShoppingItems,
    addShoppingItem,
    addShoppingItems,
    checkShoppingItem,
    deleteShoppingItem,
    getRecipes,
    getRecipe,
    getRecipeItems,
    addRecipe,
    updateRecipe,
    deleteRecipe,
};
