export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const payload = request.body || {};

  if (process.env.LEADS_WEBHOOK_URL) {
    const webhookResponse = await fetch(process.env.LEADS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.status(200).json({
      saved: webhookResponse.ok,
      storage: "webhook",
      status: webhookResponse.status,
    });
  }

  return response.status(200).json({
    saved: false,
    storage: "browser",
    message: "No LEADS_WEBHOOK_URL configured. Lead is saved in browser storage for this POC.",
  });
}
