import { EventHandler } from "../Events/EventHandler";
import Sensor from "./Sensor";

export default class SensorHandler {
  private static instance: SensorHandler;
  private sensors: Map<number, Sensor>;
  private eventHandler: EventHandler;
  
  constructor() {
    this.eventHandler = new EventHandler();
    this.sensors = new Map<number, Sensor>();
  }

  public static get Instance() {
    if (!this.instance) this.instance = new SensorHandler();

    return this.instance;
  }

  public get DataUpdate(){
    return this.eventHandler.expose();
  }

  public getAll() {
    return Array.from(this.sensors);
  }

  public get(id: number): Sensor {
    return this.sensors.get(id);
  }

  public setItem(id: number, item: Sensor) {
    if(this.sensors.set(id, item))
      this.eventHandler.run("update."+id);
    
  }

  public updatetem(id: number, item: Sensor) {
    if (this.sensors.has(id)) {
      this.sensors.set(id, item);
      this.eventHandler.run("update."+id);
    }
  }
}
