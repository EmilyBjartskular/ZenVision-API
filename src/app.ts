import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import control from './routes/control';
import member from './routes/members'
import type from './routes/type';

declare interface ResponseError extends Error {
  status?: number
}

const app : Application = express();

const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
  ],
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: process.env.API_URL || 'localhost',
  preflightContinue: false,
}

app.use(cors(options));


app.use(express.json());
app.use(express.urlencoded({
  extended: false
}))



const logger = (req : Request, res: Response, next : NextFunction) => {
  console.log(
    `${req.protocol}://${req.get("host")}${req.originalUrl}: got  ${req.method}`
  );
  next();
};
app.use(logger);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.set('Content-Type', 'application/json')
  next()
})

app.use((err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(err.status || 500);
    res.send("Error Occured!\nPlease try again later");
  })

app.use('/api', member);
app.use('/api/select', control);
app.use('/api/type', type);

export default app;