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
let selected: number = 0;
// move http outside and make a new module for ws
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  console.log(new Date().toISOString(), "connection established");
  const addObserver = (id : number) =>{
      const select = SensorHandler.Instance.get(id);
      if (select) {
        devices.ItemsAvailable.on("update." + id, () => {
          const current = SensorHandler.Instance.get(id);    
          const data: SendFormat = {
            id: current.id,
            name: current.name,
            type: current.type,
            baseType: current.baseType,
            created: current.created,
            modifier: current.modified,
            batteryLevel: current.properties.batteryLevel,
            value: current.properties.value,
          };
          console.log(data.value, "sent to client");
          ws.send(JSON.stringify(data));
      });
      devices.selectDevice(id);
    }
  }

  ws.on("message", (data) => {
    console.log(new Date().toISOString(), data);
    devices.selectDevice(+data);
    selected = +data;
    addObserver(+data);
  });

  ws.on("close", () => {
    console.log(new Date().toISOString(), "closed connection");
    devices.ItemsAvailable.off("update." + selected);
    
  });
});

server.listen(app.get("port"), () => {
  console.log(`Server Listening on port ${port}`);
});
