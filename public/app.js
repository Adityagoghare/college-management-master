// Frontend logic: sends API requests and renders the returned student records.
const API_URL = "/api/students";

// Keep references to frequently used HTML elements.
const form = document.getElementById("student-form");
const formTitle = document.getElementById("form-title");
const studentIdInput = document.getElementById("student-id");
const fullNameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const semesterInput = document.getElementById("semester");
const saveButton = document.getElementById("save-button");
const cancelEditButton = document.getElementById("cancel-edit");
const message = document.getElementById("message");
const searchInput = document.getElementById("search");
const tableBody = document.getElementById("students-table-body");
const studentCount = document.getElementById("student-count");

let allStudents = []; // Store the latest list so search can filter without another API call.

// Show a success or error message below the form.
function showMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`;
}

// Make an API request and convert non-success HTTP responses into readable errors.
async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  // Some successful responses may have no body; this app's API normally returns JSON.
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

// Load student records from GET /api/students.
async function loadStudents() {
  studentCount.textContent = "Loading students...";

  try {
    allStudents = await apiRequest(API_URL);
    renderStudents();
  } catch (error) {
    studentCount.textContent = "Could not load student records.";
    showMessage(`${error.message}. Check that the server and MySQL are running.`, "error");
  }
}

// Safely create a table cell using textContent rather than inserting user input as HTML.
function addTextCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = value ?? "";
  row.appendChild(cell);
  return cell;
}

// Render all students, applying the current search filter.
function renderStudents() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredStudents = allStudents.filter((student) => {
    const searchableText =
      `${student.full_name} ${student.email} ${student.course}`.toLowerCase();
    return searchableText.includes(searchTerm);
  });

  tableBody.replaceChildren();
  studentCount.textContent =
    `${filteredStudents.length} student(s) shown · ${allStudents.length} total`;

  if (filteredStudents.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty-row";
    cell.textContent = "No matching students. Add a student or change your search.";
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  filteredStudents.forEach((student) => {
    const row = document.createElement("tr");
    addTextCell(row, student.full_name);
    addTextCell(row, student.email);
    addTextCell(row, student.course);
    addTextCell(row, student.semester);

    const actionCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "action-buttons";

    // The ID is stored in the button's dataset so the correct record can be edited.
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.className = "secondary";
    editButton.dataset.action = "edit";
    editButton.dataset.id = student.id;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "danger";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = student.id;

    actions.append(editButton, deleteButton);
    actionCell.appendChild(actions);
    row.appendChild(actionCell);
    tableBody.appendChild(row);
  });
}

// Create or update a student when the form is submitted.
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Stop the browser from reloading the page.

  const id = studentIdInput.value;
  const studentData = {
    full_name: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    course: courseInput.value,
    semester: Number(semesterInput.value)
  };

  try {
    if (id) {
      // Existing ID means update: PUT /api/students/:id.
      await apiRequest(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(studentData)
      });
      showMessage("Student updated successfully.", "success");
    } else {
      // No ID means create: POST /api/students.
      await apiRequest(API_URL, {
        method: "POST",
        body: JSON.stringify(studentData)
      });
      showMessage("Student added successfully.", "success");
    }

    resetForm();
    await loadStudents();
  } catch (error) {
    showMessage(error.message, "error");
  }
});

// Use event delegation: one listener handles Edit/Delete clicks in the student table.
tableBody.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;
  const student = allStudents.find((item) => String(item.id) === String(id));

  if (action === "edit" && student) {
    // Fill the form with the selected student's current values.
    studentIdInput.value = student.id;
    fullNameInput.value = student.full_name;
    emailInput.value = student.email;
    courseInput.value = student.course;
    semesterInput.value = student.semester;
    formTitle.textContent = "Edit student";
    saveButton.textContent = "Update student";
    cancelEditButton.classList.remove("hidden");
    fullNameInput.focus();
    return;
  }

  if (action === "delete") {
    // Ask for confirmation to reduce accidental deletion during classroom practice.
    if (!window.confirm("Delete this student record? This cannot be undone.")) return;

    try {
      await apiRequest(`${API_URL}/${id}`, { method: "DELETE" });
      showMessage("Student deleted successfully.", "success");
      await loadStudents();
    } catch (error) {
      showMessage(error.message, "error");
    }
  }
});

// Reset the form to its create-new-student state.
function resetForm() {
  form.reset();
  studentIdInput.value = "";
  formTitle.textContent = "Add a student";
  saveButton.textContent = "Save student";
  cancelEditButton.classList.add("hidden");
}

cancelEditButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderStudents);
document.getElementById("refresh-button").addEventListener("click", loadStudents);

// Load data when the page first opens.
loadStudents();
