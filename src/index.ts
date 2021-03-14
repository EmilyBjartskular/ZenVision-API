import { createServer } from "http";
import { Socket, Server } from "socket.io";
import DeviceHandler from "./DeviceHandler";
import app from "./app";

const dotenv = require("dotenv");
dotenv.config();

DeviceHandler.Instance.fetchAll();
setInterval(async () => await DeviceHandler.Instance.fetchAll(), 60 * 1000);

const port = process.env.PORT || 5000;

app.set("port", port);

const server = createServer(app);
const io = new Server(server);


const options = {
  path: "/ws",
  forceNew: true,
  reconnectionAttempts: 3,
  timeout: 2000,
};

io.on("connection", (socket: Socket, options) => {
  console.log("connection get!")

  socket.emit("connected", {message: "Hello World!"})
  socket.on('request device', (id : string)=> {
    DeviceHandler.Instance.selectDevice(+id)
  })
  DeviceHandler.Instance.ItemsAvailable.on('update', () => socket.emit('data', DeviceHandler.Instance.Selected))
});

server.listen(app.get("port"), () => {
  console.log(`Server Listening on port ${port}`);
});
