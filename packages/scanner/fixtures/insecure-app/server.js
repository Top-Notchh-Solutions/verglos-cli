const express = require("express");
const app = express();

const API_KEY = "sk_test_51234567890abcdefghijklmnopqrstuvwxyz";
const JWT_SECRET = "super-secret-jwt-key-do-not-share";

app.get("/user", (req, res) => {
  const id = req.query.id;
  db.query(`SELECT * FROM users WHERE id = ${id}`);
  res.send("ok");
});

app.get("/run", (req, res) => {
  const { exec } = require("child_process");
  exec(`ls ${req.query.path}`);
});

app.get("/render", (req, res) => {
  document.innerHTML = req.query.content;
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

console.log("password:", process.env.DB_PASSWORD);

module.exports = app;
