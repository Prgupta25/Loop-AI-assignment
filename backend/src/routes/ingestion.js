import { Router } from "express";
import { ingest, getStatus } from "../controllers/ingestionController.js";

const router = Router();

router.post("/ingest", ingest);
router.get("/status/:ingestionId", getStatus);

export default router; 