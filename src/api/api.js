import axios from "axios";

const ip = '10.87.169.52'
const port = 8080;
const api = axios.create({
  baseURL: `http://${ip}:${port}`,
});
export default api;
