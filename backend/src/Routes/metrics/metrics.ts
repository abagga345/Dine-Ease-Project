import { Router } from "express";
import client from 'prom-client'
export const metricsRouter= Router();

metricsRouter.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.send(metrics);
});