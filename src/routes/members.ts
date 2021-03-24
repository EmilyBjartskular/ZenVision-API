import { Router, Request, Response } from "express";
import Sensor from "../Sensors/Sensor";
import SensorHandler from "../Sensors/SensorHandler";

declare interface MemberFormat{
  id? : number,
  body : Sensor
}



const member = Router();
const handler = SensorHandler.Instance;


member.get("/", async (req: Request, res: Response) => {
  res.json(handler.getAll());
});

member.get("/:id", (req: Request, res: Response) => {
  const id : number = +req.params.id;
  const entry = handler.get(id);
  if (entry) {
    res.json(entry);
  } else res.status(404).json({message: "no such member with id: " + id});
});

member.put("/:id", (req: Request, res: Response) => {
  const id : number = +req.params.id;
  const entry = handler.get(id);
  if (entry) {
    try {
      const data : MemberFormat = req.body;
      handler.updatetem(id, data.body);
      res.json({message : `Sensor ${id}, was updated!`, data: data.body});

    } catch (error) {
      res.status(400).json({message: "bad request format", reason: error.message})
    }
  } else res.status(404).json({message: "no such member with id: " + id});
});

member.post("/", (req: Request, res: Response) => {
  try {
    const data : MemberFormat = req.body;
    if(data.id){
      handler.setItem(data.id, data.body);
      res.json({message : `Sensor ${data.id}, was updated!`, data: data.body});
    }else throw "Not a valid ID"
    
  } catch (error) {
    res.status(400).json({messsage: "Bad format on post request"})  
  }


});

export default member;
