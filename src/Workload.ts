import Work from "./Work";

const axios = require("axios");

export default class Workload {
  private jobs: Work[];
  private static instance: Workload;

  public static get Instance() {
    if (!this.instance) this.instance = new Workload();
    return this.instance;
  }

  public addDevice(work: Work) {
    for (let i = 0; i < this.jobs.length; i++) {
      if (this.jobs[i].priority > work.priority) {
        this.jobs.splice(i, 0, work);
        return;
      }
    }
    this.jobs.push(work);
  }

  public selectDevice(id: string) {
    const target = this.jobs.filter((v) => v.id === id).pop();

    this.jobs.map((v) => (v.selected = false)); // unselect all
    target.selected = true; //select the current

    this.jobs = this.jobs.filter((v) => v.id !== id); //resuffle to top
    this.addDevice(target);
  }
  public async process() {
    while (this.jobs.length > 1) {
      const current: Work = this.jobs.pop();
      await current.work();
    }
  }
}
