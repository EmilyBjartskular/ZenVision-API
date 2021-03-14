import axios from "../node_modules/axios/index"; // just what the fuck
import Sensor from "./Sensors/Sensor";
import SensorHandler from "./Sensors/SensorHandler";
import Work from "./Workers/Work";
import { WorkEventHandler } from "./Workers/WorkEventHandler";
import Workload from "./Workers/Workload";

const dotenv = require("dotenv");
dotenv.config();

/**
 * Singleton that fetches, manages and updates devices
 */
export default class DeviceHandler {
  private static instance: DeviceHandler;
  private workHandler: WorkEventHandler;
  private selected: Work;
  private workSelected: NodeJS.Timeout;

  constructor() {
    this.workHandler = new WorkEventHandler();
    // setInterval(this.fetchAll, 60 * 1000); //every minute fetch all items
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
  public sensorToJob(sensor: Sensor): Work {
    const job: Work = {
      id: "" + sensor.id,
      priority: 5,
      selected: false,
      work: async () => {
        const req = await axios(
          process.env.FIB_ENDPOINT + process.env.PREFIX + "/" + sensor.id
        );
        const data = req.data;
        SensorHandler.Instance.updatetem(+data.id, data as Sensor);
      },
    };
    return job;
  }

  /**
   * Destroys the selected item
   */
  public unSelect() {
    this.selected = null;
    clearInterval(this.workSelected);
  }

  /**
   * Select a single device that is going to take priority and worked at a high degree
   * @param id Device ID
   */
  public selectDevice(id: number) {
    this.unSelect();
    this.selected = this.sensorToJob(SensorHandler.Instance.get(id));
    this.workSelected = setInterval(() => {
      Workload.Instance.addJob(this.sensorToJob(SensorHandler.Instance.get(id))); 
    }, 500);
  }

  /**
   * Fetches from the fibaro system all devices, iterates from that and populates the Sensorhandler Instance
   * That aswell as setting up the work orders
   */
  public async fetchAll() {
    try {
      const data = await axios.get(
        process.env.FIB_ENDPOINT + process.env.PREFIX
      );
      data.data.map(e => {
        SensorHandler.Instance.setItem(+e.id, e as Sensor);
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
