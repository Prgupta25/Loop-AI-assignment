import express from "express";
import cors from "cors";
import ingestionRouter from "./routes/ingestion.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", ingestionRouter);

export default app; 