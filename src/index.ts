import { createServer } from "http";
import { Socket, Server } from "socket.io";
import DeviceHandler from "./DeviceHandler";
import Workload from "./Workers/Workload";

const dotenv = require("dotenv");
dotenv.config();

DeviceHandler.Instance.ItemsAvailable.on("update", Workload.Instance.process); //whenever the device handler pushes new changes update the process queue of the workload
DeviceHandler.Instance.fetchAll();

const app = require('app')
const port: number = +process.env.PORT | 5000;
const http = createServer(app);
const io = require("socket.io")(http, { path: "/socket.io" });

io.on("connection", (socket: Socket) => {
  io.emit("message", "Hello World!");
});

http.listen(port, () => {
  console.log(`Server Listening on port ${port}`);
});
