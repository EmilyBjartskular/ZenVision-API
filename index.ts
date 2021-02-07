import express = require("express");
import SensorHandler from "./SensorHandler";

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

//todo add single instance of an catagory
