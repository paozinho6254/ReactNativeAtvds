import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import clientesRoute from "./routes/clientes.js";
import pedidosRoute from "./routes/pedidos.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/clientes", clientesRoute);
app.use("/api/pedidos", pedidosRoute);

export default app;