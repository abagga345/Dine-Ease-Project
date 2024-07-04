import express from "express"
import cors from "cors"
import {mainRouter} from "./Routes/index"
const app=express();
app.use(cors());
app.use(express.json());

app.use("/api/v1",mainRouter);


app.listen(3000,function(){
    console.log("SERVER STARTED ON PORT 3000");
})