import * as Express from "express";
import control from './routes/control';
import member from './routes/members'
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



app.use('/api/control', control);
app.use('/api', member)

export default app;