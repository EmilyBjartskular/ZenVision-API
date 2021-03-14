import Sensor from "./Sensor";

export default class SensorHandler {
  private static instance: SensorHandler;
  private sensors: Map<number, Sensor>;
  constructor() {
    this.sensors = new Map<number, Sensor>();
  }

  public static get Instance() {
    if (!this.instance) this.instance = new SensorHandler();

    return this.instance;
  }

  public getAll() {
    return Array.from(this.sensors);
  }
  public get(id: number): Sensor {
    return this.sensors.get(id);
  }

  public setItem(id: number, item: Sensor) {
    this.sensors.set(id, item);
  }

  public updatetem(id: number, item: Sensor) {
    if (this.sensors.has(id)) this.sensors.set(id, item);
  }
}
