import { createServer } from "http";
import * as WebSocket from "ws";
import DeviceHandler from "./DeviceHandler";
import app from "./app";
import SensorHandler from "./Sensors/SensorHandler";

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

// move http outside and make a new module for ws
const wss = new WebSocket.Server({ server });
let selected: number[] = [];
wss.on("connection", (ws) => {
  console.log((new Date()).toISOString(),"connection established");

  const observers = () =>
    selected.map((id) => {
      devices.ItemsAvailable.on("update." + id, () => {
        const selected = SensorHandler.Instance.get(id);
        if (selected) {
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
    });

  ws.on("message", (data) => {
    console.log((new Date()).toISOString(),data);
    devices.selectDevice(+data);
    if (!selected.includes(+data)) {
      selected.push(+data);
      observers();
    }
  });

  ws.on("close", () => {
    console.log((new Date()).toISOString(), "closed connection");
    selected.map((id) => devices.ItemsAvailable.off("update." + id));
  });
});

server.listen(app.get("port"), () => {
  console.log(`Server Listening on port ${port}`);
});
