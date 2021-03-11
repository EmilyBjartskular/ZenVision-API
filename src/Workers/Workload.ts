import Work from "./Work";

const axios = require("axios");
/**
 * Workload, push events and it will run in order of priority
 */
export default class Workload {
  private jobs: Work[]
  private static instance: Workload;

  public static get Instance() {
    if (!this.instance) this.instance = new Workload();
    return this.instance;
  }

  /**
   * Get the queues as id, inteded for debuging
   */
  public get workQueue(): string[]{
    return this.jobs.map(e=>e.id)
  }

  /**
   * Add work order to the queue
   * Does not take raceonditions into consideration. 
   * @param work 
   */
  public addJob(work: Work) {
    let index = 0
    this.jobs.map((e, i) => { 
      if(e.priority > work.priority)
        index = index < i ? index : i
    })
    this.jobs.splice(index, 0, work);
    
  }
  
  /**
   * Process the queue untill it is empty. Todo add mutex
   */
  public async process() {
    while (this.jobs.length > 1) {
      const current: Work = this.jobs.pop();
      await current.work();
    }
  }

}
