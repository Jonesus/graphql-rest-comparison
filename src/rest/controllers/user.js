import { db } from "../../db.js";
import express from 'express';

const router = express.Router()

router.get("/", (req, res, next) => {
  db.all(`SELECT * FROM User`, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.status(200).json(row);
    });
});

router.get("/:id", (req, res, next) => {
  const id = [req.params.id]
  db.get(`SELECT * FROM User WHERE id = ?`, [id], (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.status(200).json(row);
    });
});

export default router