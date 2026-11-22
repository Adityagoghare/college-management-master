# College Management System — Student Module Starter

A beginner-friendly classroom project using HTML, CSS, JavaScript, Node.js, Express, and MySQL (including MariaDB supplied by XAMPP).

## What this version does

- Create a student record
- List and search student records
- Edit a student record
- Delete a student record
- Validate required fields on the server
- Prevent duplicate email addresses
- Use parameterized SQL queries

## Requirements

Install Node.js (LTS). Install XAMPP if you want to run MySQL/MariaDB locally.

## Setup

1. Extract the project folder.
2. Start **MySQL** in the XAMPP Control Panel. Apache is not required for this Node.js app.
3. Open `http://localhost/phpmyadmin` and select the **SQL** tab.
4. Run the SQL in `database/schema.sql`. This creates `college_management` and the `students` table.
5. Copy `.env.example` to a new file named `.env`. Update the database username/password if your setup differs.
6. Open a terminal in this project folder and run:

   ```bash
   npm install
   npm start
   ```

7. Open `http://localhost:3000` in your browser.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/students` | List students |
| GET | `/api/students/:id` | Read one student |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |

Example POST body:

```json
{
  "full_name": "Riya Patel",
  "email": "riya@example.com",
  "course": "MCA",
  "semester": 1
}
```

## Teaching sequence

1. Explain the HTML form and CSS layout.
2. Explain `fetch()` and how the browser sends JSON to an API.
3. Explain Express routes and HTTP methods.
4. Explain SQL tables, primary keys, unique constraints, and parameterized queries.
5. Use Postman to test each API route.
6. Let students make one change, test it, and submit it through a Git branch and pull request.

## Important limitations

This is a learning starter, **not a production-ready college system**. It has no login, authorization, CSRF protection, audit log, rate limiting, or production deployment configuration. Do not put real student or sensitive data into it. Before deployment, add authentication and role-based access control, stronger validation, security headers, logging, backups, and tests.

## Suggested homework

- Add a `phone` field to the form, API, and database.
- Add a department field or department table.
- Add a course filter.
- Add a dashboard count for total students.
- Write API tests for success cases and invalid input.
- Create a feature branch, commit the work, and open a pull request.
