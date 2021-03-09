import Sensor from "./Sensors/Sensor";
import SensorHandler from "./Sensors/SensorHandler";
import Work from "./Work";

const axios = require('axios')

export default class FetchComponent{
    private static instance: FetchComponent
    private enpoints: Work[]

    public async fetchAll(){
        const data = await axios.get(process.env.FIB_ENDPOINT + process.env.DEVICES_PREFIX)
        data.whatever.forEach((e,i) => { //todo fix this to match the endpoint
            //populate Sensor Instance
            SensorHandler.Instance.pushItem(e.id , e.data as Sensor); //todo fix

            const job: Work = {//todo fix
                id: e.id,
                selected: false,
                priority: i,
                work: async () => {
                    const data : Sensor = await axios(process.env.FIB_ENDPOINT+process.env.DEVICES_PREFIX+ '/'+ e.id) //this should be correct
                    SensorHandler.Instance.updatetem(e.id , e.data as Sensor); //todo ensure context is keept because fuck webpackages
                }
            }
            this.enpoints.push()
        });
    }
    public static get Instance(){
        if(!this.instance)
            this.instance = new FetchComponent();
        return this.instance;        
    }
}