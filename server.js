const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
//Adding db functions
const { listContact, insertInContact } = require("./database.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "Client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Client", "index.html"));
});

app.get("/api/get/contacts", (req, res) => {
  res.sendFile(path.join(__dirname, "Client", "contacts.html"));
});

//Loading JSON profile to script.js
app.get("/api/profile_json", (req, res) => {
  console.log("Loading data from JSON...");
  res.sendFile(path.join(__dirname, "data", "profile.json"));
});

app.get("/api/profile", (req, res) => {
  console.log("user requested pdf profile.");
  res.sendFile(path.join(__dirname, "Client", "CV_10_05_2025.pdf"));
});

app.get("/api/admin/contact", (req, res) => {
  res.json(listContact());
});

app.post("/api/contact", (req, res) => {
  const { name, job, email, message } = req.body;
  console.log("Contact:", { name, job, email, message });
  const errors = [];
  if (!name?.trim()) errors.push("Name is required.");

  if (!job?.trim()) errors.push("Job is required.");

  //Applying a regex on email
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.trim()) errors.push("Email is required.");
  else if (!email_regex.test(email)) {
    console.log("Invalid email");
    errors.push("Invalid email format.");
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }
  res.json({ ok: true, msg: "Thanks for your message!" });
  const payload = {
    name: name.trim(),
    job: job,
    email: email.trim(),
    message: message,
  };
  insertInContact(payload);
  console.log("New data was inserted.");
});

app.use((req, res) => {
  res.status(404).json(`
          <h1>Page not found</h1>
          <p><a href="/">Homepage</a></p>
          `);
});

app.listen(PORT, () =>
  console.log(`CV Server running on http://localhost:${PORT}`)
);
