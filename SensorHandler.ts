import Sensor from "./Sensor";

export default class SensorHandler{
    private static instance: SensorHandler;
    private catagories: Map<string, Sensor>;

    constructor(){
        this.catagories = new Map<string, Sensor>();
    }

    public static get Instance(){
        if(!this.instance)
            this.instance = new SensorHandler();
        return this.instance;
    }
    
    
}