// Routes define the URLs and HTTP methods available for student records.
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/students - return all students, newest first.
router.get("/", async (req, res, next) => {
  try {
    const [students] = await pool.query(
      "SELECT id, full_name, email, course, semester, created_at FROM students ORDER BY id DESC"
    );
    res.json(students);
  } catch (error) {
    next(error);
  }
});

// GET /api/students/:id - return one student by ID.
router.get("/:id", async (req, res, next) => {
  try {
    const [students] = await pool.execute(
      "SELECT id, full_name, email, course, semester FROM students WHERE id = ?",
      [req.params.id]
    );

    if (students.length === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json(students[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/students - validate and create a new student.
router.post("/", async (req, res, next) => {
  try {
    const { full_name, email, course, semester } = req.body;

    // Basic server-side validation. Never rely only on browser validation.
    if (
      !full_name?.trim() ||
      !email?.trim() ||
      !course?.trim() ||
      semester === undefined ||
      semester === null ||
      semester === ""
    ) {
      return res.status(400).json({
        message: "Full name, email, course, and semester are required."
      });
    }

    const semesterNumber = Number(semester);
    if (!Number.isInteger(semesterNumber) || semesterNumber < 1 || semesterNumber > 12) {
      return res.status(400).json({ message: "Semester must be a whole number from 1 to 12." });
    }

    // The ? placeholders use parameterized queries to reduce SQL injection risk.
    const [result] = await pool.execute(
      "INSERT INTO students (full_name, email, course, semester) VALUES (?, ?, ?, ?)",
      [full_name.trim(), email.trim().toLowerCase(), course.trim(), semesterNumber]
    );

    res.status(201).json({
      message: "Student created successfully.",
      id: result.insertId
    });
  } catch (error) {
    // MySQL error 1062 means a unique value (here, email) already exists.
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "A student with this email already exists." });
    }
    next(error);
  }
});

// PUT /api/students/:id - update an existing student.
router.put("/:id", async (req, res, next) => {
  try {
    const { full_name, email, course, semester } = req.body;
    const semesterNumber = Number(semester);

    if (
      !full_name?.trim() ||
      !email?.trim() ||
      !course?.trim() ||
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 12
    ) {
      return res.status(400).json({
        message: "Provide a name, email, course, and semester from 1 to 12."
      });
    }

    const [result] = await pool.execute(
      `UPDATE students
       SET full_name = ?, email = ?, course = ?, semester = ?
       WHERE id = ?`,
      [full_name.trim(), email.trim().toLowerCase(), course.trim(), semesterNumber, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json({ message: "Student updated successfully." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Another student already uses this email." });
    }
    next(error);
  }
});

// DELETE /api/students/:id - delete a student record.
router.delete("/:id", async (req, res, next) => {
  try {
    const [result] = await pool.execute(
      "DELETE FROM students WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json({ message: "Student deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
