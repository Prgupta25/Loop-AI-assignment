import { v4 as uuidv4 } from "uuid";
import { store } from "../store/memoryStore.js";

const priorities = { HIGH: 3, MEDIUM: 2, LOW: 1 };
const batchSize = parseInt(process.env.BATCH_SIZE || '3', 10);
const rateLimitMs = parseInt(process.env.RATE_LIMIT_MS || '5000', 10);
let processing = false;

function handleIngestion(ids, priority) {
  const ingestionId = uuidv4();
  const createdAt = Date.now();
  const batches = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    batches.push({
      batch_id: uuidv4(),
      ids: ids.slice(i, i + batchSize),
      status: "yet_to_start"
    });
  }
  store.ingestions[ingestionId] = {
    ingestion_id: ingestionId,
    status: "yet_to_start",
    priority,
    createdAt,
    batches
  };
  store.queue.push({
    ingestion_id: ingestionId,
    priority: priorities[priority],
    createdAt
  });
  processQueue();
  return ingestionId;
}

function getIngestionStatus(ingestionId) {
  const ingestion = store.ingestions[ingestionId];
  if (!ingestion) return null;
  const batchStatuses = ingestion.batches.map(b => b.status);
  let status = "yet_to_start";
  if (batchStatuses.every(s => s === "completed")) status = "completed";
  else if (batchStatuses.some(s => s === "triggered")) status = "triggered";
  ingestion.status = status;
  return {
    ingestion_id: ingestion.ingestion_id,
    status,
    batches: ingestion.batches.map(b => ({
      batch_id: b.batch_id,
      ids: b.ids,
      status: b.status
    }))
  };
}

async function processQueue() {
  if (processing) return;
  processing = true;
  while (store.queue.length > 0) {
    store.queue.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.createdAt - b.createdAt;
    });
    const next = store.queue.shift();
    const ingestion = store.ingestions[next.ingestion_id];
    const batch = ingestion.batches.find(b => b.status === "yet_to_start");
    if (!batch) continue;
    batch.status = "triggered";
    getIngestionStatus(next.ingestion_id);
    await new Promise(resolve => setTimeout(resolve, rateLimitMs));
    await processBatch(batch);
    getIngestionStatus(next.ingestion_id);
    if (ingestion.batches.some(b => b.status === "yet_to_start")) {
      store.queue.push(next);
    }
  }
  processing = false;
}

async function processBatch(batch) {
  await Promise.all(
    batch.ids.map(id =>
      new Promise(resolve =>
        setTimeout(() => resolve({ id, data: "processed" }), 1000)
      )
    )
  );
  batch.status = "completed";
}

export { handleIngestion, getIngestionStatus }; 