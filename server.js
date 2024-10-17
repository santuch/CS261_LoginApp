const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));

// Serve login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
