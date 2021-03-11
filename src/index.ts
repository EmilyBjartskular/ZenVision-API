import SensorHandler from "./Sensors/SensorHandler";
import * as Express from "express";
import { createServer } from "http";
import { Socket, Server } from "socket.io";
import DeviceHandler from "./DeviceHandler";
import Workload from "./Workers/Workload";

//todo format

const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = Express();

DeviceHandler.Instance.ItemsAvailable.on("update", Workload.Instance.process); //whenever the device handler pushes new changes update the process queue of the workload
DeviceHandler.Instance.fetchAll();

app.use(Express.json());
app.use(cors());
const logger = (req, res, next) => {
  console.log(
    `${req.protocol}://${req.get("host")}${req.originalUrl}: got  ${req.method}`
  );
  next();
};
app.use(logger);

app.get("/api/select/:id", (req, res) => {
  const id = req.params.id;
  if (SensorHandler.Instance.get(id)) {
    DeviceHandler.Instance.selectDevice(id);
    res.json({
      message: `device: ${id}, ${
        SensorHandler.Instance.get(id).name
      } set as selected device`,
      id: id,
    });
  } else res.status(404).json({ message: "no such id", id: id });
});

app.get("/api/", async (req, res) => {
  res.json(SensorHandler.Instance.getAll());
});

app.get("/api/:id", (req, res) => {
  const id = req.params.id;
  const entry = SensorHandler.Instance.get(id);
  if (entry) {
    res.json(entry);
  } else res.status(404).send("not a valid entry!");
});

const port: number = +process.env.PORT | 5000;
const http = createServer(app);
const io = require("socket.io")(http, { path: "/socket.io" });

io.on("connection", (socket: Socket) => {
  io.emit("message", "Hello World!");
});

http.listen(port, () => {
  console.log(`Server Listening on port ${port}`);
});
