const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();

const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/api/shopping/items", async (req, res) => {
    console.log("getting shopping items");
    res.json(await db.getShoppingItems());
});

app.put("/api/shopping/check", async (req, res) => {
    console.log("checking item", req.body);
    res.json(await db.checkShoppingItem(req.body));
});

app.post("/api/shopping/delete", async (req, res) => {
    console.log("Server deleting item", req.body);
    res.json(await db.deleteShoppingItem(req.body));
});

app.get("*", function (req, res) {
    console.log("*ing");
    res.sendFile(path.join(__dirname, "..", "client", "public", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
