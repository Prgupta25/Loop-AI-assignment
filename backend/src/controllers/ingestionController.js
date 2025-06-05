import { handleIngestion, getIngestionStatus } from "../services/ingestionService.js";

export async function ingest(req, res) {
  const { ids, priority } = req.body;

  
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "'ids' must be a non-empty array of integers." });
  }
  if (!ids.every(id => Number.isInteger(id) && id >= 1 && id <= Math.pow(10, 9) + 7)) {
      return res.status(400).json({ error: "Each ID must be an integer between 1 and 10^9 + 7." });
  }
  const allowedPriorities = ['HIGH', 'MEDIUM', 'LOW'];
  if (!priority || !allowedPriorities.includes(priority)) {
    return res.status(400).json({ error: "'priority' must be one of HIGH, MEDIUM, or LOW." });
  }

  try {
    const ingestionId = handleIngestion(ids, priority);
    res.json({ ingestion_id: ingestionId });
  } catch (error) {
    console.error("Error handling ingestion request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getStatus(req, res) {
  const { ingestionId } = req.params;

  try {
    const status = getIngestionStatus(ingestionId);
    if (!status) {
      return res.status(404).json({ error: "Ingestion ID not found" });
    }
    res.json(status);
  } catch (error) {
      console.error(`Error getting status for ingestion ID ${ingestionId}:`, error);
      res.status(500).json({ error: "Internal server error" });
  }
} 