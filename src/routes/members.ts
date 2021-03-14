import { Router, Request, Response } from "express";
// import DeviceHandler from "../DeviceHandler";
import SensorHandler from "../Sensors/SensorHandler";

const member = Router();
member.get("/", async (req: Request, res: Response) => {
  //   await DeviceHandler.Instance.fetchAll();
  res.json(SensorHandler.Instance.getAll());
});

member.get("/:id", (req: Request, res: Response) => {
  const id : number = +req.params.id;
  const entry = SensorHandler.Instance.get(+id);
  if (entry) {
    res.json(entry);
  } else res.status(404).send("not a valid entry!");
});

export default member;
