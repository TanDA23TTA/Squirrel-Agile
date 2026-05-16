const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// test API
app.get("/", (req, res) => {
    res.send("Squirrel Banking API is running 🐿️");
});

app.get("/api/users", (req, res) => {
    res.json([
        { id: 1, username: "admin" },
        { id: 2, username: "user1" }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});