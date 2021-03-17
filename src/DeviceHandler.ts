import axios from "../node_modules/axios/index"; // just what the fuck
import Sensor from "./Sensors/Sensor";
import SensorHandler from "./Sensors/SensorHandler";
import { EventHandler } from "./Events/EventHandler";

const dotenv = require("dotenv");
dotenv.config();

/**
 * Singleton that fetches, manages and updates devices
 */
export default class DeviceHandler {
  private static instance: DeviceHandler;
  private workHandler: EventHandler;
  private workSelected?: NodeJS.Timeout;
  private selectedID: number;

  constructor() {
    this.workHandler = new EventHandler();
    this.selectedID = 0;
    // setInterval(this.fetchAll, 60 * 1000); //every minute fetch all items
  }

  public get Selected() : Sensor{
    return SensorHandler.Instance.get(this.selectedID);
  }

  /**
   * Connect to the workhandlers event, this will update every time there is an
   */
  public get ItemsAvailable() {
    return this.workHandler.expose();
  }

  /**
   * sensorToJob converts sensor object to work object to handle the collection in sensorhandler
   */
  public sensorToJob(sensor: Sensor): (id:number) => Promise<void> {
    const job = async (id : number) => {
        const req = await axios(
          process.env.FIB_ENDPOINT + '/api/devices/' + id
        );
        const data : Sensor = req.data;
        SensorHandler.Instance.updatetem(+data.id, data);
      } 
    return job;
  }

  /**
   * Destroys the selected item
   */
  public unSelect() {
    this.selectedID = 0;
    if(this.workSelected)
      clearInterval(this.workSelected);
  } 

  /**
   * Select a single device that is going to take priority and worked at a high degree
   * @param id Device ID
   */
  public selectDevice(id: number) {
    //clear previous selected intervals
    if(this.workSelected)
      clearInterval(this.workSelected);

    //what sensor we are dealing with
    this.selectedID = id;
    let sensor = SensorHandler.Instance.get(id);
    //tell the listeners a new selected device have default data
    this.workHandler.run('update')

    const job = this.sensorToJob(sensor);
    this.workSelected = setInterval(async () => {
      await job(id);
      //if it has a new value update event
      if(sensor.properties.value !== SensorHandler.Instance.get(id).properties.value){
        this.workHandler.run('update')
        sensor = SensorHandler.Instance.get(id)
      }
    }, 500);
  }

  /**
   * Fetches from the fibaro system all devices, iterates from that and populates the Sensorhandler Instance
   * That aswell as setting up the work orders
   */
  public async fetchAll() {
    try {
      const data = await axios.get(
        process.env.FIB_ENDPOINT + '/api/devices'
      );
      data.data.map((e : Sensor)=> {
        SensorHandler.Instance.setItem(+e.id, e);
      });
      console.log("fetch order job completed");
    } catch (error) {
      console.log(error);
    }
  }

  public static get Instance() {
    if (!this.instance) this.instance = new DeviceHandler();
    return this.instance;
  }
}
