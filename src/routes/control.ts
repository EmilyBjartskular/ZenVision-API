import { Router, Request, Response } from "express";
import DeviceHandler from "../DeviceHandler";
import SensorHandler from "../Sensors/SensorHandler";

const router = Router();
router.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  if (SensorHandler.Instance.get(id)) {
    DeviceHandler.Instance.selectDevice(id);
    res.json({
      message: `device: ${id}, ${
        SensorHandler.Instance.get(id).name
      } set as selected device`,
      id: id,
    });
  } else res.status(404).json({ message: "no such id", id: id });
});
export default router;
