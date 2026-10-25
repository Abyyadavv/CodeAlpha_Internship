const Database = require("better-sqlite3");

const db = new Database("urls.db");

// Create table if it doesn't exist
db.prepare(`
    CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short_code TEXT UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

// Generate random short code
function generateShortCode(length = 6) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let code = "";

    for (let i = 0; i < length; i++) {
        code += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return code;
}

// Create short URL
function createShortUrl(longUrl) {
    let shortCode;

    do {
        shortCode = generateShortCode();
    } while (
        db.prepare(
            "SELECT id FROM urls WHERE short_code = ?"
        ).get(shortCode)
    );

    db.prepare(`
        INSERT INTO urls (short_code, original_url)
        VALUES (?, ?)
    `).run(shortCode, longUrl);

    return shortCode;
}

// Find original URL
function getOriginalUrl(shortCode) {
    const row = db.prepare(
        "SELECT original_url FROM urls WHERE short_code = ?"
    ).get(shortCode);

    return row ? row.original_url : null;
}

module.exports = {
    createShortUrl,
    getOriginalUrl
};