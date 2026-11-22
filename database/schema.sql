-- Run this file in phpMyAdmin's SQL tab or MySQL Workbench.
-- It creates the database and the table used by the starter application.

CREATE DATABASE IF NOT EXISTS college_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE college_management;

CREATE TABLE IF NOT EXISTS students (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  course VARCHAR(100) NOT NULL,
  semester TINYINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

-- Optional sample records for classroom demonstrations.
INSERT IGNORE INTO students (full_name, email, course, semester)
VALUES
  ('Aarav Patel', 'aarav@example.com', 'MCA', 2),
  ('Diya Shah', 'diya@example.com', 'BCA', 4);
