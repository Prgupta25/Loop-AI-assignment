const backendUrl = "http://localhost:5000";

document.getElementById("ingest-form").onsubmit = async e => {
  e.preventDefault();
  const ids = document.getElementById("ids").value.split(",").map(x => parseInt(x.trim(), 10));
  const priority = document.getElementById("priority").value;
  const res = await fetch(`${backendUrl}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, priority })
  });
  const data = await res.json();
  document.getElementById("ingest-result").innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  if (data.ingestion_id) {
    document.getElementById("ingestion-id").value = data.ingestion_id;
  }
};

document.getElementById("status-form").onsubmit = async e => {
  e.preventDefault();
  const ingestionId = document.getElementById("ingestion-id").value;
  const res = await fetch(`${backendUrl}/status/${ingestionId}`);
  const data = await res.json();
  document.getElementById("status-result").innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}; 