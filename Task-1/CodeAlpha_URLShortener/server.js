const express = require("express");
const path = require("path");
const { createShortUrl, getOriginalUrl } = require("./database");

const app = express();

app.use(express.json());

// Frontend
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Create short URL
app.post("/shorten", (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({
            error: "longUrl is required"
        });
    }

    try {
        const shortCode = createShortUrl(longUrl);

        res.status(201).json({
            message: "URL shortened successfully",
            originalUrl: longUrl,
            shortCode: shortCode,
            shortUrl: `http://localhost:5000/${shortCode}`
        });
    } catch (error) {
        console.error("Error:", error);

        res.status(500).json({
            error: "Failed to shorten URL"
        });
    }
});

// Redirect
app.get("/:shortCode", (req, res) => {
    const { shortCode } = req.params;

    const originalUrl = getOriginalUrl(shortCode);

    if (!originalUrl) {
        return res.status(404).json({
            error: "Short URL not found"
        });
    }

    res.redirect(originalUrl);
});

app.listen(5000, () => {
    console.log("=================================");
    console.log("URL Shortener Server Started");
    console.log("http://localhost:5000");
    console.log("=================================");
});