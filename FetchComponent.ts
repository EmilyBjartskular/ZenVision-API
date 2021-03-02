//todo 
//step 1 fetch list of devices, load sensor handler
//step 2 store in a priority queue, and cache data
//step 3 update top in queue every 5 min, pop back down in queue
//step 4 implement an selector, that updates every second for data.
const axios = require('axios');
import Sensor from './Sensors/Sensor'
import SensorHandler from './Sensors/SensorHandler'
interface Work{
    endpoint: string,
    prefix: string,//this is likley to be id
    value: string,
    selected: boolean,
    priority: number
}
export default class FetchComponent{
    private jobs: Work[]
    private handler:  (work: Work) => Promise<void>
    

    public async fetchAll(){
        try {
            const data : any = await axios.get(process.env.FIB_ALL).data
            SensorHandler.Instance.pushItem(data.id, data.data as Sensor);// not correct this is a template until i get actual data format
        } catch (error) {
            console.log(error.message)
        }
        
    }
    public addDevice(id: number, work: Work){
        let index = 0
        for (let i = 0; i < this.jobs.length; i++) {
            if(this.jobs[i].priority <= work.priority){
                break;
            }
            index++
            
        }
        this.jobs.splice(index, 0, work)
    } 
    public selectDevice(id: number){
        //search jobs and find id and set select to false, set any other to false? 
    }
    constructor(){  
        this.handler = async (work: Work) => {
            const data = await axios.get(work.endpoint + work.prefix)
            if(data){
                work.value = data //Im 99% certine this funciton will lose context, todo test
                setTimeout(this.handler, (300*1000 + 5000*Math.random())*(work.selected? 1: 0)+1000) // handle every second if selected or 5min + rand*5seconds
            }
        };
    }
}



