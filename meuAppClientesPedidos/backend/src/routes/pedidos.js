import express from "express";
import { Pedido } from "../models/pedido.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { clienteId, valor, produto } = req.body;
  Pedido.criar(clienteId, valor, produto, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Pedido inserido com sucesso!" });
  });
});

router.get("/", (req, res) => {
  Pedido.listarComCliente((err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

router.get("/resumo", (req, res) => {
  Pedido.resumoPorCliente((err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

export default router;
