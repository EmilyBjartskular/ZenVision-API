import axios from "../node_modules/axios/index"; // just what the fuck
import Sensor from "./Sensors/Sensor";
import SensorHandler from "./Sensors/SensorHandler";
import { EventHandler, IEvent } from "./Events/EventHandler";

const dotenv = require("dotenv");
dotenv.config();
// 1. support multiple selections
// 2. go by the assumption the Fibaro updates this api by posting 
// 3. Remove polling and simply post to custom event strings
// 4. post towards fibaro actions ...


/**
 * Singleton that fetches, manages and updates devices
 */
export default class DeviceHandler {
  private static instance: DeviceHandler;
  private workHandler: EventHandler;
  private dataObserver: IEvent;

  constructor() {
    this.workHandler = new EventHandler();
    this.dataObserver = SensorHandler.Instance.DataUpdate;
    // setInterval(this.fetchAll, 60 * 1000); //every minute fetch all items
  }

  /**
   * Connect to the workhandlers event, this will update every time there is an
   */
  public get ItemsAvailable() {
    return this.workHandler.expose();
  }

  /**
   * Remove One of the selected items by id
   * Destroys the selected item
   */
  public unSelect(id: number) {
    this.dataObserver.off("update."+id);

  } 

  /**
   * Select a single device to be observed
   * @param id Device ID
   */
  public selectDevice(id: number) {
    this.workHandler.run("update."+id); //push latest cached data
    //todo send request to fibaro or something
    this.dataObserver.on("update."+id, () => this.workHandler.run("update."+id)); //every time new data is posted on this id we will inform any observer
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
