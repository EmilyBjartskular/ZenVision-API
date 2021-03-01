import express from "express";
import SensorHandler from "./Sensors/SensorHandler";

const app: express.Application = express();

app.use(express.json());
let logger = (req, res, next) =>{ 
    console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}: got  ${req.method}`)
    next();
}; 
app.use(logger);

app.get("/api/", (req, res) => {
    res.json(SensorHandler.Instance.getAll())
});

app.get("/api/:catg", (req, res) => {
    const catagory = req.params.catg;
    const entry = SensorHandler.Instance.get(catagory);
    if(entry){
        res.json(entry); 
    }else
        res.status(404).send("not a valid entry!")
});

app.get("/api/:catg/:did", (req, res) => { 
    const catagory = req.params.catg;
    const deviceId = req.params.did;

    const entry = SensorHandler.Instance.getFromId(catagory, deviceId);
    if(entry){
        res.json(entry); 
    }else
        res.status(404).send("not a valid entry!")
});

//data monitor
//todo error messages.