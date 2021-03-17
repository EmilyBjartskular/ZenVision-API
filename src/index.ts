import { createServer } from "http";
import * as WebSocket from "ws";
import DeviceHandler from "./DeviceHandler";
import app from "./app";

declare interface SendFormat {
  id: number;
  name: string;
  type: string;
  baseType: string;
  created: Date;
  modifier: Date;
  batteryLevel?: number;
  value: string;
}
const devices = DeviceHandler.Instance;
const dotenv = require("dotenv");
dotenv.config();

devices.fetchAll();
// setInterval(async () => await devices.fetchAll(), 60 * 1000);

const port = process.env.PORT || 5000;

app.set("port", port);

const server = createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("connection");
  devices.ItemsAvailable.on("update", () => {
    const selected = devices.Selected;
    if (selected) {
      //somehow this is run without a selected device
      const data: SendFormat = {
        id: selected.id,
        name: selected.name,
        type: selected.type,
        baseType: selected.baseType,
        created: selected.created,
        modifier: selected.modified,
        batteryLevel: selected.properties.batteryLevel,
        value: selected.properties.value,
      };

      console.log(data.value, "sent to client");
      ws.send(JSON.stringify(data));
    }
  });

  ws.on("message", (data) => {
    console.log(data);
    devices.selectDevice(+data);
  });

  ws.on("close", () => {
    console.log("closed connection");
    devices.unSelect();
    devices.ItemsAvailable.off("update");
  });
});

server.listen(app.get("port"), () => {
  console.log(`Server Listening on port ${port}`);
});
