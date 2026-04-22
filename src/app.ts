import express, { Express } from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error-handler";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get('/api/health',(req,res)=>{

    res.status(200).json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } })
})


app.use(errorHandler); 
export default app;