import Sensor from "./Sensor";

export default class SensorHandler{


    private static instance: SensorHandler;
    private catagories: Map<string, Array<Sensor>>;

    constructor(){
        this.catagories = new Map<string, Array<Sensor>>();
    }

    public static get Instance(){
        if(!this.instance)
            this.instance = new SensorHandler();
        return this.instance;
    }
    
    public getAll(){
        return Array.from(this.catagories);
    }
    public get(catagory: string) : Array<Sensor> {
        return this.catagories.get(catagory);
    }
    public getFromId(catagory: string, deviceId: string) {
        const entrys = this.catagories.get(catagory);
        return entrys.find((sensor)=>sensor.Device_id === deviceId);
    }
}