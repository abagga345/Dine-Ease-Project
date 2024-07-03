import express from "express"
import {mainRouter} from "./Routes/index"
const app=express();

app.use(express.json());

app.use("/api/v1",mainRouter);

