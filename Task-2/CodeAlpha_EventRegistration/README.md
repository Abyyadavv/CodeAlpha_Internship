# Event Registration System

A simple and responsive web-based Event Registration System developed as part of the CodeAlpha Internship Task.

## 📌 Project Overview

The Event Registration System allows users to explore upcoming events, register for an event, view their existing registrations using their email address, and cancel a registration when required.

The project uses a Node.js and Express.js backend with SQLite for storing event and registration data.

## ✨ Features

* View upcoming events
* View event date, location, capacity and available seats
* Register for an event
* Prevent duplicate registration for the same event using the same email
* View registrations using email address
* Cancel an existing registration
* Automatically update available seats after registration or cancellation
* Responsive and clean user interface
* SQLite database for persistent data storage

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript
* Node.js
* Express.js
* SQLite
* better-sqlite3

## 📁 Project Structure

```text
CodeAlpha_EventRegistration/
│
├── public/
│   ├── index.html
│   └── database.js
│
├── node_modules/
│
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

### 2. Open the project folder

```bash
cd CodeAlpha_EventRegistration
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
node server.js
```

### 5. Open the application

Open your browser and visit:

```text
http://localhost:5000
```

## 🚀 How It Works

1. Users can view the list of upcoming events.
2. The user selects an event and enters their name and email.
3. The system checks whether the user is already registered for that event.
4. If the registration is valid, the registration is saved in the SQLite database.
5. Users can enter their email in the **My Registrations** section to view their registrations.
6. Users can cancel an existing registration.
7. When a registration is cancelled, the available seat count is updated.

## 🗄️ Database

The application uses SQLite to store:

* Event information
* User registration information
* Registration timestamps

The database is handled through the Node.js backend.

## 🎯 Internship Task

**Program:** CodeAlpha Internship
**Task:** Event Registration System

This project demonstrates basic full-stack web development concepts including frontend form handling, REST API communication, server-side processing, database operations, validation, and CRUD-style functionality.

## 👨‍💻 Author

**Abhishek Yadav**

GitHub: `https://github.com/Abyyadavv`

Portfolio: `https://abyyadavv.github.io/Portfolio/`
