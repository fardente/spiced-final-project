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

async function checkShoppingItem({ id, checked }) {
    try {
        const { rows } = await db.query(
            `UPDATE shopping_items SET checked = $2 WHERE id = $1`,
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

async function updateRecipe({ name, preparation, id }) {
    try {
        const { rows } = await db.query(
            `UPDATE recipes
            SET recipe_name = $1, recipe_preparation = $2
            WHERE id = $3
            RETURNING *`,
            [name, preparation, id]
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
    checkShoppingItem,
    deleteShoppingItem,
    addRecipe,
    updateRecipe,
    deleteRecipe,
};