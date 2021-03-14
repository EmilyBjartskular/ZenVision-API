import { createServer } from "http";
import { Socket, Server } from "socket.io";
import DeviceHandler from "./DeviceHandler";
import Workload from "./Workers/Workload";
import app from './app'

const dotenv = require("dotenv");
dotenv.config();

DeviceHandler.Instance.ItemsAvailable.on("update", Workload.Instance.process); //whenever the device handler pushes new changes update the process queue of the workload

DeviceHandler.Instance.fetchAll()
setInterval(async () => await DeviceHandler.Instance.fetchAll(), 60*1000)

const port: number = +process.env.PORT | 5000;
const http = createServer(app);
const io = require("socket.io")(http, { path: "/socket.io" });

app.set('port', port)

io.on("connection", (socket: Socket) => {
  io.emit("message", "Hello World!");
  //todo :
  //1. take a message of an id
  //2. push data towards client (without auth) to the sender untill a new message appears repeat 1
  //3. talk with singleton instances and make sure device is selected via devicemanager
});

http.listen(app.get('port'), () => {
  console.log(`Server Listening on port ${port}`);
});
