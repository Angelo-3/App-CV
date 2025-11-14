const path = require("path");
const Database = require("better-sqlite3");
const fs = require("fs");

const dataDir = path.join(__dirname, "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, "contact.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS contact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    job TEXT NOT NULL,
    message TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

//List all statement
const listAllStmt = db.prepare(`
  SELECT name, job, message, created_at
  FROM contact
`);

//Insert new data
const insertStmt = db.prepare(`
     INSERT INTO contact (name, job, email, message)
     VALUES (@name, @job, @email, @message)  
     `);

function listContact() {
  const rows = listAllStmt.all();
  console.log("Data send from list contact.");
  return rows;
}

function insertInContact(payload) {
  const { name, job, email, message } = payload;
  insertStmt.run({ name, job, email, message });
}

module.exports = { db, listContact, insertInContact };
