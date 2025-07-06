import express from "express"
import cors from "cors"
import {mainRouter} from "./Routes/index"
import { activeRequestCount, requestCount, requestDuration } from "./Monitoring/prom";
const app=express();
app.use(cors());
app.use(express.json());
app.use(requestCount);
app.use(activeRequestCount)
app.use(requestDuration)
app.use("/api/v1",mainRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});