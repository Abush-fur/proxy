export default async function handler(req, res) {
  // CORS (important for browser)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1. Send data to n8n
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    // 2. Read response from n8n
    const data = await n8nResponse.json();

    // 3. IMPORTANT: pass checkoutlink back to frontend
    return res.status(200).json({
      checkoutlink: data.checkoutlink || null,
      raw: data
    });

  } catch (error) {
    return res.status(500).json({
      error: "Failed to process booking",
      details: error.message
    });
  }
}
