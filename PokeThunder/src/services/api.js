import axios from "axios";

const api = axios.create({
  baseURL: "https://www.wtvehiclesapi.sgambe.serv00.net/api",
});

export default api;