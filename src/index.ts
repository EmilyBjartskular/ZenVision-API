import { createServer } from "http";
import * as WebSocket from "ws";
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

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("connection");
  DeviceHandler.Instance.ItemsAvailable.on("update", () =>
  ws.send(JSON.stringify(DeviceHandler.Instance.Selected))
);
  ws.on("message", (data) => {
    console.log(data);
    DeviceHandler.Instance.selectDevice(+data);
    
  });

  ws.on("close", () => {
    console.log('closed connection')
    DeviceHandler.Instance.unSelect();
    DeviceHandler.Instance.ItemsAvailable.off("update");
  });
});

server.listen(app.get("port"), () => {
  console.log(`Server Listening on port ${port}`);
});
