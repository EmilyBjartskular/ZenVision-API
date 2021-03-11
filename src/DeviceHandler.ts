import axios from "../node_modules/axios/index"; // just what the fuck
import Sensor from "./Sensors/Sensor";
import SensorHandler from "./Sensors/SensorHandler";
import Work from "./Workers/Work";
import {WorkEventHandler} from "./Workers/WorkEventHandler";
import Workload from "./Workers/Workload";

const dotenv = require("dotenv");
dotenv.config();

/**
 * Singleton that fetches, manages and updates devices
 */
export default class DeviceHandler {
  private static instance: DeviceHandler;
  private enpoints: Work[];//maybe make this to map
  private workHandler: WorkEventHandler;
  private selected : Work
  private workSelected: NodeJS.Timeout;


  constructor() {
    this.enpoints = [];
    this.workHandler = new WorkEventHandler();
    setInterval(this.fetchAll, 60 * 1000); //every minute fetch all items 
   
  }

  /**
   * Connect to the workhandlers event, this will update every time there is an 
   */
  public get ItemsAvailable() {
    return this.workHandler.expose();
  }



  /**
   * Destroys the selected item
   */
  public unSelect(){
      this.enpoints.map(e => e.selected = false)
      this.selected = null
      clearInterval(this.workSelected)
  }

  /**
   * Select a single device that is going to take priority and worked at a high degree
   * @param id Device ID
   */
  public selectDevice(id: string) {
    this.enpoints.map((e) => {
      if (e.id === id) {
        e.selected = true;
        e.priority = 0;
        this.selected = e
        this.workSelected = setInterval(() => {
            if(this.selected){
                Workload.Instance.addJob(this.selected)
                this.workHandler.run('update')
            }
        }, 500)
      } else {
        // make sure all other are 1. unselected 2. more than 0 priority
        e.selected = false;
        e.priority += 1;
      }
    });
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
      data.data.map((e, i) => {
        console.log(e);
        SensorHandler.Instance.pushItem(e.id, e as Sensor);
        const job: Work = {
          id: e.id,
          selected: false,
          priority: i,
          work: async () => {
            const req = await axios(
              process.env.FIB_ENDPOINT + process.env.PREFIX + "/" + e.id
            ); 
            const sensor = req.data;
            SensorHandler.Instance.updatetem(sensor.id, sensor as Sensor); //todo ensure context is keept because fuck webpackages
          },
        };
        if(!this.enpoints.includes(job)) //this is inefficent, but this will not run at a high degree
          this.enpoints.push(job);
      });
    } catch (error) {
      console.log(error);
    }
  }

  public static get Instance() {
    if (!this.instance) this.instance = new DeviceHandler();
    return this.instance;
  }
}
