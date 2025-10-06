import { db } from "../db.js";

export const Cliente = {
  criar: (nome, email, callback) => {
    db.query("INSERT INTO clientes (nome, email) VALUES (?, ?)", [nome, email], callback);
  },
  listar: callback => {
    db.query("SELECT * FROM clientes", callback);
  }
};