import { EXCENOR_DEFAULT_MODEL, buildExcenorPromptSection } from "./excenor-knowledge.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const input = sanitizeInput(request.body || {});
  const validationError = validateInput(input);
  if (validationError) {
    return response.status(400).json({ error: validationError });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return response.status(200).json({
      mode: "demo",
      insights: createDemoInsights(input),
    });
  }

  try {
    const insights = await generateGeminiInsights(input, apiKey);
    return response.status(200).json({ mode: "live", insights });
  } catch (error) {
    return response.status(200).json({
      mode: "demo",
      insights: createDemoInsights(input),
      note: String(error?.message || error).slice(0, 300),
    });
  }
}

function sanitizeInput(raw) {
  return {
    organization: cleanText(raw.organization, 140),
    industry: cleanText(raw.industry, 140),
    ambition: cleanText(raw.ambition, 180),
    horizon: cleanText(raw.horizon, 80),
    readiness: cleanNumber(raw.readiness, 0, 100),
    targetIndex: cleanNumber(raw.targetIndex, 0, 100),
    maturityStage: cleanText(raw.maturityStage, 80),
    maturityNarrative: cleanText(raw.maturityNarrative, 700),
    topPriorities: cleanPillarArray(raw.topPriorities),
    pillarResults: cleanPillarArray(raw.pillarResults),
    answers: cleanAnswerArray(raw.answers),
  };
}

function cleanText(value, limit) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function cleanNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return min;
  }

  return Math.min(max, Math.max(min, Math.round(number)));
}

function cleanPillarArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice(0, 10).map((item) => ({
    label: cleanText(item?.label, 80),
    current: Number(item?.current) || 0,
    target: Number(item?.target) || 0,
    gap: Number(item?.gap) || 0,
    description: cleanText(item?.description, 300),
  }));
}

function cleanAnswerArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice(0, 20).map((item) => ({
    question: cleanText(item?.question, 280),
    answer: cleanText(item?.answer, 220),
    score: Number(item?.score) || 0,
  }));
}

function validateInput(input) {
  if (!input.organization) {
    return "Organization is required.";
  }

  if (!input.industry) {
    return "Industry is required.";
  }

  if (!input.readiness || !input.maturityStage) {
    return "Maturity result is required.";
  }

  return "";
}

async function generateGeminiInsights(input, apiKey) {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || EXCENOR_DEFAULT_MODEL;

  const result = await ai.models.generateContent({
    model,
    contents: JSON.stringify(input, null, 2),
    config: {
      temperature: 0.24,
      maxOutputTokens: 2200,
      responseMimeType: "application/json",
      systemInstruction: buildSystemInstruction(),
    },
  });

  const text = result.text || "";
  return normalizeInsights(parseJson(text), input);
}

function parseJson(text) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

function buildSystemInstruction() {
  return `
You are Excenor Global's AI Maturity Insight Advisor.

Your job is to interpret a completed AI maturity questionnaire and produce a concise, practical advisory layer that sits alongside the scored report.

${buildExcenorPromptSection()}

Rules:
- Stay specific to the user's industry, maturity stage, ambition, score gaps, and questionnaire answers.
- Do not repeat the whole report. Add interpretation, likely implications, and practical next moves.
- If the input is limited, infer likely issues and label them as working assumptions to validate.
- Make Excenor the natural expert next step without sounding like a hard sell.
- Use premium consulting language. Practical, business-focused, calm, and concise.
- Do not mention Gartner or copy any external maturity model language.
- Do not invent guaranteed savings, case studies, client facts, or certifications.
- Keep the output suitable for a website POC.

Return only valid JSON. No Markdown. No surrounding commentary.
Use exactly this JSON shape:
{
  "executiveInsight": "string",
  "maturityInterpretation": "string",
  "priorityMoves": ["string", "string", "string"],
  "industryLens": ["string", "string", "string"],
  "risksToValidate": ["string", "string", "string"],
  "excenorNextStep": "string",
  "disclaimer": "string"
}
`.trim();
}

function normalizeInsights(insights, input) {
  const fallback = createDemoInsights(input);

  return {
    executiveInsight: asString(insights.executiveInsight, fallback.executiveInsight),
    maturityInterpretation: asString(insights.maturityInterpretation, fallback.maturityInterpretation),
    priorityMoves: asArray(insights.priorityMoves, fallback.priorityMoves, 3),
    industryLens: asArray(insights.industryLens, fallback.industryLens, 3),
    risksToValidate: asArray(insights.risksToValidate, fallback.risksToValidate, 3),
    excenorNextStep: asString(insights.excenorNextStep, fallback.excenorNextStep),
    disclaimer: asString(insights.disclaimer, fallback.disclaimer),
  };
}

function asString(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asArray(value, fallback, limit) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const cleaned = value
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim())
    .slice(0, limit);

  return cleaned.length ? cleaned : fallback;
}

function createDemoInsights(input) {
  const company = input.organization || "the organization";
  const industry = input.industry || "the selected industry";
  const stage = input.maturityStage || "current";
  const priorities = input.topPriorities?.length
    ? input.topPriorities.map((pillar) => pillar.label).filter(Boolean).slice(0, 3)
    : ["Strategy", "Data", "Governance"];
  const priorityText = priorities.join(", ");
  const gap = Math.max((input.targetIndex || 0) - (input.readiness || 0), 0);

  return {
    executiveInsight: `${company} is currently at the ${stage} stage with a readiness index of ${input.readiness}/100. The score suggests AI potential is visible, but reliable scale will depend on strengthening ${priorityText} before moving too quickly into tools or pilots.`,
    maturityInterpretation: `The ${gap}-point gap to the target state should be treated as an execution and operating-model challenge, not only a technology gap. Excenor would validate where process standardization, data quality, governance, ownership, and adoption readiness are constraining value in the ${industry} context.`,
    priorityMoves: [
      `Run an Excenor-led AI maturity discovery workshop to align leadership on the highest-value ${industry} use cases and decision criteria.`,
      `Validate the top gaps in ${priorityText} through process mapping, data-readiness review, governance checks, and stakeholder interviews.`,
      "Select one controlled pilot where AI can improve visibility, prediction, cycle time, quality, or risk control with clear benefit tracking.",
    ],
    industryLens: [
      `For ${industry}, AI opportunities should be tied to measurable operational outcomes such as speed, quality, service consistency, risk reduction, and leadership visibility.`,
      "The most useful use cases will likely sit where process friction, fragmented data, repeated decisions, exceptions, or manual monitoring are already visible.",
      "AI should be introduced with human oversight, privacy and cyber review, and a control plan so the organization avoids scaling weak process design.",
    ],
    risksToValidate: [
      "Whether the available data is complete, trusted, accessible, and sufficiently governed for AI-enabled decisions.",
      "Whether process ownership and approval rights are clear enough to sustain an AI-enabled workflow after launch.",
      "Whether teams have the practical capability, change support, and review cadence needed to adopt AI safely.",
    ],
    excenorNextStep: `The next practical step is an Excenor Discover and Diagnose sprint. Excenor can convert this questionnaire result into a validated AI maturity roadmap, prioritized use-case portfolio, governance model, pilot plan, and capability-building path.`,
    disclaimer:
      "These insights are AI-assisted and based on the questionnaire response. They should be validated by an Excenor expert before being used for client recommendations or implementation decisions.",
  };
}
