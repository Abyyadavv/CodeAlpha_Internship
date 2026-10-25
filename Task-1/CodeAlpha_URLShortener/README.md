# CodeAlpha URL Shortener

A simple and responsive URL Shortener web application built using Node.js, Express.js, JavaScript, HTML, CSS, and SQLite.

## Features

* Convert long URLs into short URLs
* Generate unique short codes
* Store URLs in a SQLite database
* Redirect users from short URLs to the original URL
* Copy shortened URL to clipboard
* Simple and responsive user interface
* REST API for URL shortening

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Node.js
* Express.js
* SQLite
* REST API

## Project Structure

```text
CodeAlpha_URLShortener/
│
├── public/
│   └── index.html
│
├── database.js
├── server.js
├── urls.db
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
node server.js
```

The application will run at:

```text
http://localhost:5000
```

## How It Works

1. Enter a long URL in the input field.
2. Click the **Shorten** button.
3. The application generates a unique short code.
4. The URL and short code are stored in the SQLite database.
5. A shortened URL is displayed to the user.
6. Opening the shortened URL redirects the user to the original website.

## Example

Original URL:

```text
https://www.youtube.com
```

Short URL:

```text
http://localhost:5000/qiUde0
```

## API Endpoint

### Create Short URL

**POST**

```text
/shorten
```

Request body:

```json
{
  "longUrl": "https://www.youtube.com"
}
```

Response:

```json
{
  "message": "URL shortened successfully",
  "originalUrl": "https://www.youtube.com",
  "shortCode": "qiUde0",
  "shortUrl": "http://localhost:5000/qiUde0"
}
```

## Future Improvements

* User authentication
* Custom short URLs
* URL analytics and click tracking
* QR code generation
* Expiring URLs
* Cloud deployment
* Custom domain support

## Author

Abhishek Yadav

GitHub: Abyyadavv
