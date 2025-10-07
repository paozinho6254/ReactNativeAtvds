import { db } from "../db.js";

export const Pedido = {
  criar: (clienteId, valor, produto, callback) => {
    db.query(
      "INSERT INTO pedidos (cliente_id, valor, produto) VALUES (?, ?, ?)",
      [clienteId, valor, produto],
      callback
    );
  },
  listarComCliente: callback => {
    db.query(
      `SELECT p.id, c.nome AS cliente, p.produto, p.valor
       FROM pedidos p
       JOIN clientes c ON p.cliente_id = c.id`,
      callback
    );
  },
  resumoPorCliente: callback => {
    db.query(
      `SELECT c.nome AS cliente, SUM(p.valor) AS total_gasto
       FROM pedidos p
       JOIN clientes c ON p.cliente_id = c.id
       GROUP BY c.id`,
      callback
    );
  }
};