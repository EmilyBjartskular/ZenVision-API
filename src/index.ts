import SensorHandler from "./Sensors/SensorHandler";
import * as Express from "express";
import { createServer, Server } from "http";
import * as SocketIO from "socket.io";
import Connection from "./Connection";

const app = Express();

app.use(Express.json());
let logger = (req, res, next) => {
  console.log(
    `${req.protocol}://${req.get("host")}${req.originalUrl}: got  ${req.method}`
  );
  next();
};
app.use(logger);

app.get("/api/", (req, res) => {
  res.json(SensorHandler.Instance.getAll());
});

app.get("/api/:id", (req, res) => {
  const id = req.params.id;
  const entry = SensorHandler.Instance.get(id);
  if (entry) {
    res.json(entry);
  } else res.status(404).send("not a valid entry!");
});

const port = +process.env.PORT | 5000;
const http : Server = createServer(app)

const connection = new Connection(port, http, { connectTimeout: 5000, path: '/socket.io'});

http.listen(port);
