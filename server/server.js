const express = require("express");
const path = require("path");

const app = express();

const PORT = 3001;

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("*", function (req, res) {
    console.log("*ing");
    res.sendFile(path.join(__dirname, "..", "client", "public", "index.html"));
});
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
