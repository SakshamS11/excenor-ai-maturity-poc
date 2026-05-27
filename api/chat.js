export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { message, lead, transcript } = request.body || {};
  if (!message || typeof message !== "string") {
    return response.status(400).json({ error: "Message is required" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return response.status(200).json({
      mode: "demo",
      reply: createDemoReply(message, lead),
    });
  }

  const prompt = [
    "You are Excenor Global's AI maturity advisor for a website POC.",
    "Be concise, consultative, practical, and business-focused.",
    "Do not invent commitments. Recommend a discovery workshop or proposal discussion when useful.",
    "Use the provided score, maturity level, gaps, strengths, and transcript context.",
  ].join(" ");

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const payload = {
    system_instruction: {
      parts: [{ text: prompt }],
    },
    contents: [
      {
        parts: [
          {
            text: JSON.stringify(
              {
                question: message,
                lead,
                recentTranscript: Array.isArray(transcript) ? transcript.slice(-18) : [],
              },
              null,
              2
            ),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 500,
    },
  };

  const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "x-goog-api-key": process.env.GEMINI_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    return response.status(502).json({
      error: "AI response failed",
      detail: errorText.slice(0, 500),
    });
  }

  const data = await aiResponse.json();
  const reply =
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n") ||
    "I could not generate a response just now. Please try again.";

  return response.status(200).json({ mode: "live", reply });
}

function createDemoReply(message, lead) {
  const level = lead?.level || "your current maturity stage";
  const gaps = lead?.gaps?.slice(0, 2).join(" and ") || "your readiness gaps";
  const question = message.toLowerCase();

  if (question.includes("90") || question.includes("priorit")) {
    return `For ${level}, the first 90 days should focus on narrowing ${gaps}, selecting two high-value AI use cases, and aligning leadership on measurable outcomes. Excenor can turn this into a workshop-led roadmap and capability plan.`;
  }

  if (question.includes("proposal") || question.includes("help")) {
    return `A useful proposal should include an AI readiness workshop, use-case prioritization, data and governance review, and role-based training. Based on ${level}, Excenor should position the engagement around practical adoption and measurable business outcomes.`;
  }

  return `Based on ${level}, I would recommend focusing on ${gaps}, then converting the assessment into a practical AI roadmap. For a POC response, this is running in demo mode until GEMINI_API_KEY is configured in Vercel.`;
}
