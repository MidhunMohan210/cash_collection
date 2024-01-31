import express from "express";
import dotenv from "dotenv";
import primaryUsers from './routes/primaryUserRoutes.js'
import secondaryUsers from './routes/secondaryUserRouters.js'
import admin from './routes/adminRoute.js'
import tally from './routes/tallyRoute.js'
import connectDB from "./config/db.js";
import cors from 'cors'
import cookieParser from "cookie-parser";
import path from 'path'


dotenv.config();
const port = process.env.PORT;
connectDB();
const corsOptions = {
    origin: true,
    credentials: true,
  };
  

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors(corsOptions));
app.use(cookieParser())

app.use("/api/pUsers",primaryUsers)
app.use("/api/sUsers",secondaryUsers)
app.use("/api/admin",admin)
app.use("/api/tally",tally)

if(process.env.NODE_ENV==="production"){
  console.log(process.env.NODE_ENV);
  console.log("hai")
  const __dirname=path.resolve()
  const parentDir = path.join(__dirname); 
  console.log(parentDir)
  app.use(express.static(path.join(parentDir,'/frontend/dist')))
  app.get('*',(req,res)=>res.sendFile(path.resolve(parentDir,'frontend','dist','index.html')))
}else{
app.get('/',(req,res)=>{
    res.send("Server is Ready")
})
}



app.listen(port, () => console.log(`Server started on port ${port}`));
