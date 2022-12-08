import { db } from "../../db.js";
import express from 'express';

const router = express.Router()

router.get("/", (req, res, next) => {
  db.all(`SELECT * FROM Blog`, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.status(200).json(row);
    });
});

router.get("/:id", (req, res, next) => {
  const id = [req.params.id]
  db.get(`SELECT * FROM Blog WHERE id = ?`, [id], (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.status(200).json(row);
    });
});

router.post("/", (req, res, next) => {
  const body = req.body;
  db.run(`INSERT INTO Blog (id, name, url) VALUES (?, ?, ?)`, [body.id, body.name, body.url], (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.status(201).json({
        "blog_id": body.id
    })
    });
});

export default router