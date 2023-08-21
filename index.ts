
import express,{Express,NextFunction,Request,Response} from 'express';
import dotenv from 'dotenv';
import routes from './routes/routes';
import bodyParser from 'body-parser';
import { Auth } from './controllers/AuthControllers';

import cors from 'cors';
dotenv.config();

const app:Express  = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());
app.use('/authentication',Auth,(req,res,next)=>{
  res.send('This is the secret content. Only logged in users can see this!');
})
app.use('/api/auth',routes);


app.listen(PORT,()=>{
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})

