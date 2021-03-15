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

const options = {
  path: "/ws",
  cors: {
    credentials: true,
  },
};
const io = new Server(server, options);

io.on("connection", (socket: Socket) => {
  console.log("connection get!");

  socket.emit("connected", { message: "Hello World!" });
  socket.on("request device", (id: string) => {
    DeviceHandler.Instance.selectDevice(+id);
  });
  DeviceHandler.Instance.ItemsAvailable.on("update", () =>
    socket.emit("data", DeviceHandler.Instance.Selected.properties.value)
  );
});

server.listen(app.get("port"), () => {
  console.log(`Server Listening on port ${port}`);
});
