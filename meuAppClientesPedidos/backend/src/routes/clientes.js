import express from "express";
import { Cliente } from "../models/cliente.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { nome, email } = req.body;
  Cliente.criar(nome, email, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Cliente inserido com sucesso!" });
  });
});

router.get("/", (req, res) => {
  Cliente.listar((err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

export default router;
