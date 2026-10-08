# 🎫 Support Ticket Management System

A full-stack Support Ticket Management System built with **React, FastAPI, PostgreSQL, SQLAlchemy, JWT Authentication, and TanStack React Query**.

The application allows users to register, log in, create support tickets, manage their own tickets, search and filter tickets, and track ticket status through a modern responsive dashboard.

---

## ✨ Features

- User Registration
- User Login & Logout
- JWT Authentication
- Protected Routes
- User-specific Tickets
- Create Ticket
- View Tickets
- View Single Ticket Details
- Edit Ticket
- Delete Ticket
- Search Tickets
- Filter by Status
- Filter by Priority
- Filter by Category
- Server-side Pagination
- Frontend & Backend Validation
- Loading, Error & Empty States
- Responsive UI
- Password Hashing
- PostgreSQL Database
- React Query Caching & Automatic Refresh

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- React Router DOM
- Axios
- TanStack React Query
- React Hook Form
- Zod
- CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT
- pwdlib / Argon2
- PostgreSQL
- psycopg
- python-dotenv

---

## 📂 Project Structure

```text
Ticket-generator/
│
├── backend/
│   ├── routers/
│   ├── tests/
│   ├── auth.py
│   ├── database.py
│   ├── dependencies.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── styles/
│   │
│   └── package.json
│
├── .gitignore
└── README.md
