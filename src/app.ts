import * as Express from "express";


const cors = require("cors");

const app = Express();

app.use(Express.json());
app.use(cors());
const logger = (req, res, next) => {
  console.log(
    `${req.protocol}://${req.get("host")}${req.originalUrl}: got  ${req.method}`
  );
  next();
};
app.use(logger);

const control = require('./routes/control')
const members = require('./routes/members')

app.use('/api/control', control);
app.use('/api', members)

export default app;