import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "loja_app"
});

db.connect(err => {
  if (err) console.error("Erro de conexão:", err);
  else console.log("✅ Conectado ao MySQL!");
});