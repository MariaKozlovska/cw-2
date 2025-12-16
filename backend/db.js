const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Render Disk або локально
const dbPath = process.env.DB_PATH
  ? path.join(process.env.DB_PATH, "focusapp.sqlite")
  : path.join(__dirname, "focusapp.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("DB ERROR:", err);
  else console.log("SQLite DB connected:", dbPath);
});

// Helpers
db.runAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

db.getAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, function (err, row) {
      if (err) reject(err);
      else resolve(row);
    });
  });

db.allAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, function (err, rows) {
      if (err) reject(err);
      else resolve(rows);
    });
  });

module.exports = db;
