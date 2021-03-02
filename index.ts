import SensorHandler from "./Sensors/SensorHandler";
const express = require("express");

const app = express();

app.use(express.json());
let logger = (req, res, next) =>{ 
    console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}: got  ${req.method}`)
    next();
}; 
app.use(logger);

app.get("/api/", (req, res) => {
    res.json(SensorHandler.Instance.getAll())
});

app.get("/api/:id", (req, res) => {
    const id = req.params.id;
    const entry = SensorHandler.Instance.get(id);
    if(entry){
        res.json(entry); 
    }else
        res.status(404).send("not a valid entry!")
});



//data monitor
//todo error messages.