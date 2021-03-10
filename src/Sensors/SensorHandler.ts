import Sensor from "./Sensor";

export default class SensorHandler {


    private static instance : SensorHandler;
    private sensors : Map < string,
    Sensor >;

    constructor() {
        this.sensors = new Map<string, Sensor>();
    }

    public static get Instance() {
        if (!this.instance) 
            this.instance = new SensorHandler();
        

        return this.instance;
    }

    public getAll() {
        return Array.from(this.sensors);
    }
    public get(id : string): Sensor {
        return this.sensors.get(id);
    }
    
    // public getFromId(catagory : string, deviceId : number) {
    //     const entrys = this.catagories.get(catagory);
    //     return entrys.find((sensor) => sensor.id === deviceId);
    // }

    public pushItem(id : string, item : Sensor) {
        this.sensors.set(id, item);
    }
    public updatetem(id : string, item : Sensor) {
        if(this.sensors.has(id))
            this.sensors.set(id, item);
    }
}
