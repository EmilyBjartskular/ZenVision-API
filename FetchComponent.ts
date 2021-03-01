//todo 
//step 1 fetch list of devices, load sensor handler
//step 2 store in a priority queue, and cache data
//step 3 update top in queue every 5 min, pop back down in queue
//step 4 implement an selector, that updates every second for data.
import axios from 'axios'
interface Work{
    endpoint: string,
    prefix: string,
    value: string,
    selected: boolean
}
export default class FetchComponent{
    private queue: [Work]
    constructor{
        this.handler = ()=>{
            const current = this.queue.shift();
        }
    }
    public async fetchAll(){
        try {
            const data = await axios.get(process.env.FIB_ALL)
                        
        } catch (error) {
            console.log(error.message)
        }
        
    }
}



