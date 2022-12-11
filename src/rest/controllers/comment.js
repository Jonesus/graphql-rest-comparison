import { db } from "../../db.js";
import express from 'express';

const router = express.Router()

router.get("/", (req, res, next) => {
  db.all(`SELECT * FROM Comment`, (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(row);
  });
});

router.get("/:id", (req, res, next) => {
  const id = [req.params.id]
  db.get(`SELECT * FROM Comment WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(row);
  });
});

router.get("/user/:id", (req, res, next) => {
  const id = [req.params.id]
  db.all('SELECT * FROM Comment WHERE user = ?', [id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(200).json(row);
  });
})

router.post("/", (req, res, next) => {
  const body = req.body;
  db.run(`INSERT INTO Comment (id, body, post, parent, user) VALUES (?, ?, ?, ?, ?)`, [body.id, body.body, body.post, body.parent, body.user], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.status(201).json({
      "comment_id": body.id
    })
  });
});

export default router