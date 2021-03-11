import { Router, Request, Response } from "express";
import SensorHandler from "../Sensors/SensorHandler";

const router = Router();
router.get("/api/", async (req: Request, res: Response) => {
  res.json(SensorHandler.Instance.getAll());
});

router.get("/api/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const entry = SensorHandler.Instance.get(id);
  if (entry) {
    res.json(entry);
  } else res.status(404).send("not a valid entry!");
});

export default router;