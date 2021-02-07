import express = require("express");

const app: express.Application = express();

app.use(express.json());
let logger = (req, res, next) =>{ 
    console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}: got  ${req.method}`)
    next();
}; 
app.use(logger);

app.get("/api/", (req, res) => {

});

app.get("/api/:catg", (req, res) => {
    
});