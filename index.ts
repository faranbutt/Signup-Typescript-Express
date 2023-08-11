
import express,{Express,NextFunction,Request,Response} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app:Express  = express();
const PORT = process.env.PORT;

app.get('/',(req:Request,res:Response,next:NextFunction)=>{
    res.send("Faran is Good");
})


app.listen(PORT,()=>{
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})

