import { Router, Request, Response } from "express";
import DeviceHandler from "../DeviceHandler";
import SensorHandler from "../Sensors/SensorHandler";

enum SensorType {
  DoorSensor,
  LightSensor,
  DefaultSensor,
  EffectSensor,
  TemperatureSensor,
  HumiditySensor,
  MultiLevelSensor,
  ZWaveSensor,
  MotionSensor,
}
const type = Router();
type.get("/:id", (req: Request, res: Response) => {
  const id: number = +req.params.id;
  const sensor = SensorHandler.Instance.get(+id);
  if (sensor) {
    let stype: SensorType = SensorType.DefaultSensor;
    const query = sensor.type.split(".")[2];
    console.log(query);
    switch (query) {
      case "motionSensor":
        stype = SensorType.MotionSensor;
        break;
      case "doorSensor" || "binarySwitch":
        stype = SensorType.DoorSensor;
        break;
      case "lightSensor":
        stype = SensorType.LightSensor;
        break;
      case "energyMeter":
        stype = SensorType.EffectSensor;
        break;
      case "temperatureSensor":
        stype = SensorType.LightSensor;
        break;
      case "humiditySensor":
        stype = SensorType.HumiditySensor;
        break;
      case "multilevelSensor":
        stype = SensorType.MultiLevelSensor;
        break;
      case "zwaveDevice":
        stype = SensorType.ZWaveSensor;
        break;
      default:
        break;
    }
    res.status(200).json({ type: SensorType[stype]});
  } else res.status(404).json({ message: "no such id", id: id });
});
export default type;
