import SensorHandler from "./Sensors/SensorHandler";
import * as Express from "express";
import { createServer } from "http";
import { Socket, Server } from "socket.io";
import DeviceHandler from "./DeviceHandler";
import Workload from "./Workers/Workload";

const cors = require("cors");
const dotenv = require("dotenv");

const app = Express();

app.use(Express.json());
app.use(cors());
const logger = (req, res, next) => {
  console.log(
    `${req.protocol}://${req.get("host")}${req.originalUrl}: got  ${req.method}`
  );
  next();
};
app.use(logger);

const control = require('./routes/control')
const members = require('./routes/members')

app.use('/api/control', control);
app.use('/api', members)

export default app;