import { EXCENOR_DEFAULT_MODEL, buildExcenorPromptSection } from "./excenor-knowledge.js";

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

  const prompt = buildAdvisorPrompt();

  const model = process.env.GEMINI_MODEL || EXCENOR_DEFAULT_MODEL;
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
                lead: compactLeadContext(lead),
                recentTranscript: compactTranscript(transcript),
              },
              null,
              2
            ),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 1200,
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
  const finishReason = data.candidates?.[0]?.finishReason;
  const reply =
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n") ||
    "I could not generate a response just now. Please try again.";

  const completedReply =
    finishReason === "MAX_TOKENS"
      ? `${reply}\n\nThe response was shortened by the model limit. Ask \"continue\" and I will expand the next steps.`
      : reply;

  return response.status(200).json({ mode: "live", reply: completedReply, finishReason });
}

function compactLeadContext(lead) {
  if (!lead) {
    return null;
  }

  return {
    name: lead.lead?.name,
    organization: lead.lead?.organization,
    industry: lead.lead?.industry,
    score: lead.score,
    level: lead.level,
    strengths: lead.strengths,
    gaps: lead.gaps,
    summary: lead.summary,
  };
}

function compactTranscript(transcript) {
  if (!Array.isArray(transcript)) {
    return [];
  }

  return transcript.slice(-8).map((entry) => ({
    sender: entry.sender,
    text: typeof entry.text === "string" ? entry.text.slice(0, 600) : "",
  }));
}

function buildAdvisorPrompt() {
  return `
You are Excenor Global's AI maturity advisor for a website POC.

${buildExcenorPromptSection()}

Response rules:
- Adapt every answer to the user's free-text industry. Any industry is allowed. Infer likely processes, risks, stakeholders, and AI use cases from that industry without overclaiming.
- Use the provided score, maturity level, strengths, gaps, lead details, and recent transcript.
- Be concise, consultative, and practical. Give a complete answer in 120-220 words unless the user explicitly asks for more detail.
- If the user says "continue", continue from your previous answer without restarting.
- Write for a polished website UI. Do not use Markdown bold markers like **text** or __text__.
- Do not claim Excenor has completed work for this exact user. Use language like "Excenor can help" or "a suitable next step would be".
- When useful, recommend a discovery workshop, AI readiness workshop, use-case prioritization, governance review, or role-based capability programme.
`.trim();
}

function createDemoReply(message, lead) {
  const level = lead?.level || "your current maturity stage";
  const gaps = lead?.gaps?.slice(0, 2).join(" and ") || "your readiness gaps";
  const industry = lead?.lead?.industry || "your industry";
  const question = message.toLowerCase();

  if (question.includes("90") || question.includes("priorit")) {
    return `For a ${industry} organization at ${level}, the first 90 days should focus on narrowing ${gaps}, selecting two high-value AI use cases tied to real workflows, and aligning leadership on measurable outcomes. Excenor can turn this into a 5D workshop-led roadmap and capability plan.`;
  }

  if (question.includes("proposal") || question.includes("help")) {
    return `A useful proposal for a ${industry} organization should include an AI readiness workshop, use-case prioritization, data and governance review, and role-based training. Based on ${level}, Excenor should position the engagement around practical adoption, measurable outcomes, and internal ownership.`;
  }

  return `Based on ${level} in the ${industry} context, I would recommend focusing on ${gaps}, then converting the assessment into a practical AI roadmap using Excenor's Discover, Diagnose, Design, Deploy, Demonstrate approach. For a POC response, this is running in demo mode until GEMINI_API_KEY is configured in Vercel.`;
}
