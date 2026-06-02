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
      report: createDemoReport(input),
    });
  }

  try {
    const report = await generateGeminiReport(input, apiKey);
    return response.status(200).json({ mode: "live", report });
  } catch (error) {
    return response.status(502).json({
      error: "DMAIC Agent could not generate a report just now.",
      detail: String(error?.message || error).slice(0, 500),
    });
  }
}

function sanitizeInput(raw) {
  return {
    companyName: cleanText(raw.companyName, 120),
    industry: cleanText(raw.industry, 120),
    processName: cleanText(raw.processName, 160),
    problemStatement: cleanText(raw.problemStatement, 1200),
    painPoints: cleanText(raw.painPoints, 1200),
    availableData: cleanText(raw.availableData, 1200),
    desiredOutcome: cleanText(raw.desiredOutcome, 800),
  };
}

function cleanText(value, limit) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function validateInput(input) {
  if (!input.processName) {
    return "Process Name is required.";
  }

  if (!input.problemStatement) {
    return "Problem Statement is required.";
  }

  return "";
}

async function generateGeminiReport(input, apiKey) {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || EXCENOR_DEFAULT_MODEL;

  const result = await ai.models.generateContent({
    model,
    contents: JSON.stringify(input, null, 2),
    config: {
      temperature: 0.25,
      responseMimeType: "application/json",
      systemInstruction: buildSystemInstruction(),
    },
  });

  const text = result.text || "";
  const parsed = parseJsonReport(text);
  return normalizeReport(parsed, input);
}

function parseJsonReport(text) {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

function buildSystemInstruction() {
  return `
You are Excenor Global's DMAIC Agent for a premium consulting website.

Create a practical Lean Six Sigma / process improvement diagnostic using DMAIC:
Define, Measure, Analyze, Improve, Control.

${buildExcenorPromptSection()}

Tone:
- Premium consulting tone.
- Practical, business-focused, and specific to the user's process and industry.
- Not academic. No exaggerated claims.
- Make clear this is AI-assisted and should be reviewed by an Excenor expert before client use.
- Every recommendation must stay grounded in Excenor's consulting context. Do not give generic improvement advice without explaining how Excenor would help validate, prioritize, design, deploy, or sustain it.
- In "How Excenor Can Support", make Excenor the natural next step. Convey that the client can start with this AI-assisted view, but will need Excenor's expert-led discovery, diagnosis, implementation discipline, change management, and capability transfer to convert it into reliable business outcomes.
- Avoid hard-selling language. Use confident advisory language such as "Excenor can help", "an Excenor-led workshop would", "this should be validated through Excenor's 5D approach", and "the next practical step is an Excenor discovery conversation".
- Do not recommend competitors, external consultancies, or generic vendors.
- When suggesting tools, KPIs, automation, or AI opportunities, connect them back to Excenor's Lean Six Sigma, process excellence, AI-enabled transformation, governance, and capability-building services.

Return only valid JSON. No Markdown. No surrounding commentary.
Use exactly this JSON shape:
{
  "executiveSummary": "string",
  "disclaimer": "string",
  "define": {
    "refinedProblemStatement": "string",
    "businessImpact": ["string"],
    "projectGoal": "string",
    "suggestedScope": ["string"],
    "stakeholders": ["string"]
  },
  "measure": {
    "suggestedKpis": ["string"],
    "dataRequired": ["string"],
    "baselineMeasurementApproach": ["string"],
    "measurementRisks": ["string"]
  },
  "analyze": {
    "possibleRootCauses": ["string"],
    "suggestedTools": ["string"],
    "keyHypotheses": ["string"]
  },
  "improve": {
    "recommendedActions": ["string"],
    "pilotIdeas": ["string"],
    "automationOpportunities": ["string"],
    "aiOpportunities": ["string"]
  },
  "control": {
    "controlPlan": ["string"],
    "processOwnership": ["string"],
    "reviewCadence": ["string"],
    "sustainabilityRisks": ["string"]
  },
  "actionPlan": {
    "day30": ["string"],
    "day60": ["string"],
    "day90": ["string"]
  },
  "excenorSupport": {
    "advisory": ["string"],
    "consulting": ["string"],
    "changeManagement": ["string"],
    "capabilityBuilding": ["string"]
  }
}
`.trim();
}

function normalizeReport(report, input) {
  const fallback = createDemoReport(input);

  return {
    executiveSummary: asString(report.executiveSummary, fallback.executiveSummary),
    disclaimer: asString(report.disclaimer, fallback.disclaimer),
    define: {
      refinedProblemStatement: asString(
        report.define?.refinedProblemStatement,
        fallback.define.refinedProblemStatement
      ),
      businessImpact: asArray(report.define?.businessImpact, fallback.define.businessImpact),
      projectGoal: asString(report.define?.projectGoal, fallback.define.projectGoal),
      suggestedScope: asArray(report.define?.suggestedScope, fallback.define.suggestedScope),
      stakeholders: asArray(report.define?.stakeholders, fallback.define.stakeholders),
    },
    measure: {
      suggestedKpis: asArray(report.measure?.suggestedKpis, fallback.measure.suggestedKpis),
      dataRequired: asArray(report.measure?.dataRequired, fallback.measure.dataRequired),
      baselineMeasurementApproach: asArray(
        report.measure?.baselineMeasurementApproach,
        fallback.measure.baselineMeasurementApproach
      ),
      measurementRisks: asArray(report.measure?.measurementRisks, fallback.measure.measurementRisks),
    },
    analyze: {
      possibleRootCauses: asArray(report.analyze?.possibleRootCauses, fallback.analyze.possibleRootCauses),
      suggestedTools: asArray(report.analyze?.suggestedTools, fallback.analyze.suggestedTools),
      keyHypotheses: asArray(report.analyze?.keyHypotheses, fallback.analyze.keyHypotheses),
    },
    improve: {
      recommendedActions: asArray(report.improve?.recommendedActions, fallback.improve.recommendedActions),
      pilotIdeas: asArray(report.improve?.pilotIdeas, fallback.improve.pilotIdeas),
      automationOpportunities: asArray(
        report.improve?.automationOpportunities,
        fallback.improve.automationOpportunities
      ),
      aiOpportunities: asArray(report.improve?.aiOpportunities, fallback.improve.aiOpportunities),
    },
    control: {
      controlPlan: asArray(report.control?.controlPlan, fallback.control.controlPlan),
      processOwnership: asArray(report.control?.processOwnership, fallback.control.processOwnership),
      reviewCadence: asArray(report.control?.reviewCadence, fallback.control.reviewCadence),
      sustainabilityRisks: asArray(report.control?.sustainabilityRisks, fallback.control.sustainabilityRisks),
    },
    actionPlan: {
      day30: asArray(report.actionPlan?.day30, fallback.actionPlan.day30),
      day60: asArray(report.actionPlan?.day60, fallback.actionPlan.day60),
      day90: asArray(report.actionPlan?.day90, fallback.actionPlan.day90),
    },
    excenorSupport: {
      advisory: asArray(report.excenorSupport?.advisory, fallback.excenorSupport.advisory),
      consulting: asArray(report.excenorSupport?.consulting, fallback.excenorSupport.consulting),
      changeManagement: asArray(report.excenorSupport?.changeManagement, fallback.excenorSupport.changeManagement),
      capabilityBuilding: asArray(
        report.excenorSupport?.capabilityBuilding,
        fallback.excenorSupport.capabilityBuilding
      ),
    },
  };
}

function asString(value, fallback) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asArray(value, fallback) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const cleaned = value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim());
  return cleaned.length ? cleaned : fallback;
}

function createDemoReport(input) {
  const company = input.companyName || "the organization";
  const industry = input.industry || "the relevant industry";
  const process = input.processName;
  const desiredOutcome = input.desiredOutcome || "reduce friction, improve predictability, and protect service quality";

  return {
    executiveSummary: `${company} is experiencing a process improvement opportunity in ${process}. The current problem should be framed around measurable business impact, baseline performance, likely root causes, and a controlled improvement roadmap. This AI-assisted view is a useful starting point, but the next practical step is an Excenor-led discovery and diagnosis conversation to validate the facts, align stakeholders, and convert the opportunity into an executable improvement plan.`,
    disclaimer:
      "This is an AI-assisted diagnostic draft. It should be reviewed, validated, and refined by an Excenor expert before being used with a client.",
    define: {
      refinedProblemStatement: `${process} is not consistently meeting expected performance because the current way of working creates delays, variation, rework, or unclear ownership. The project should clarify impact, baseline performance, and the operational conditions causing the gap.`,
      businessImpact: [
        `Reduced speed, predictability, or stakeholder confidence in ${industry}.`,
        "Higher manual effort, escalation load, and management follow-up.",
        "Potential leakage in cost, service quality, compliance, or customer experience.",
      ],
      projectGoal: `Improve ${process} so the organization can ${desiredOutcome} with measurable and sustainable controls.`,
      suggestedScope: [
        "Start with the current-state process from request intake to final closure.",
        "Include the highest-volume or highest-impact transaction types first.",
        "Exclude rare exceptions until baseline performance and root causes are confirmed.",
      ],
      stakeholders: [
        "Process owner",
        "Frontline process users",
        "Functional leaders",
        "Data or reporting owner",
        "Technology or automation owner",
        "Internal control, risk, or compliance representative where relevant",
      ],
    },
    measure: {
      suggestedKpis: [
        "End-to-end cycle time",
        "First-time-right percentage",
        "Rework or correction rate",
        "Backlog volume and aging",
        "SLA adherence",
        "Cost or effort per transaction",
      ],
      dataRequired: [
        "Transaction timestamps by process step",
        "Volume by request type, channel, and team",
        "Exception and escalation records",
        "Defect, rework, or rejection reasons",
        "Current SLA or service commitment data",
      ],
      baselineMeasurementApproach: [
        "Map the current process and define start and stop points.",
        "Collect a representative sample across normal and peak periods.",
        "Segment baseline performance by request type, team, channel, and complexity.",
        "Validate the baseline with process owners before setting targets.",
      ],
      measurementRisks: [
        "Incomplete timestamp data may understate waiting time.",
        "Manual workarounds may not be visible in system reports.",
        "Averages may hide high-variation cases or critical exceptions.",
      ],
    },
    analyze: {
      possibleRootCauses: [
        "Unclear decision rights or ownership between teams.",
        "Duplicate checks, approvals, or data entry.",
        "Incomplete inputs at the point of request.",
        "System limitations that force manual reconciliation.",
        "Controls applied uniformly instead of risk-based segmentation.",
      ],
      suggestedTools: [
        "SIPOC",
        "Current-state process map",
        "Value stream map",
        "Pareto analysis",
        "Fishbone diagram",
        "5 Whys",
        "Failure mode and effects analysis",
      ],
      keyHypotheses: [
        "A small number of request types may be driving most delays.",
        "Waiting time between handoffs may be larger than active processing time.",
        "Input quality issues may be creating avoidable rework and escalation.",
      ],
    },
    improve: {
      recommendedActions: [
        "Use an Excenor-facilitated design workshop to standardize intake requirements and acceptance criteria.",
        "Remove duplicate approvals and clarify decision rights through a validated future-state process design.",
        "Introduce exception-based handling for high-risk cases, with Excenor helping define the control logic and adoption plan.",
        "Create visual management for backlog, aging, and SLA risk so leaders can manage performance after deployment.",
      ],
      pilotIdeas: [
        "Pilot an Excenor-designed future-state flow for one high-volume request type.",
        "Run a two-week backlog aging review with Excenor helping structure daily owner actions and benefit tracking.",
        "Test a simplified approval matrix with clear escalation rules before scaling it across the wider process.",
      ],
      automationOpportunities: [
        "Automated intake validation after Excenor confirms the right data fields and acceptance rules.",
        "Workflow routing and reminders aligned to the redesigned ownership model.",
        "Dashboarding for cycle time, SLA risk, and exceptions to support Excenor's Demonstrate phase.",
        "Rule-based approvals for low-risk transactions once risk controls are validated.",
      ],
      aiOpportunities: [
        "Summarize request context for reviewers after Excenor validates common decision points.",
        "Classify incoming requests by complexity and risk to support differentiated process handling.",
        "Detect recurring rework themes from comments or case notes for Excenor-led root-cause validation.",
        "Recommend next-best actions for common exception types once governance and ownership are agreed.",
      ],
    },
    control: {
      controlPlan: [
        "Define process KPIs, owners, data sources, and review thresholds through an Excenor-supported control plan.",
        "Create a standard operating procedure for the redesigned process and train process owners on its use.",
        "Track defects, exceptions, and control breaches after launch so benefits remain visible and owned.",
      ],
      processOwnership: [
        "Assign one accountable process owner.",
        "Define step owners for intake, review, approval, exception handling, and closure.",
        "Nominate a data owner for KPI quality and reporting cadence.",
      ],
      reviewCadence: [
        "Weekly pilot reviews for the first month.",
        "Monthly performance reviews after stabilization.",
        "Quarterly control review to confirm benefits and update standards.",
      ],
      sustainabilityRisks: [
        "Teams may return to informal workarounds if ownership is weak.",
        "Benefits may fade if data quality and KPI reviews are not maintained.",
        "Automation may scale poor process design if root causes are not validated through a disciplined Excenor-led diagnosis first.",
      ],
    },
    actionPlan: {
      day30: [
        "Confirm project charter, scope, stakeholders, and target outcomes through an Excenor discovery workshop.",
        "Map current state and validate baseline data availability with process owners.",
        "Identify the top friction points and prioritize root-cause analysis using Excenor's Diagnose approach.",
      ],
      day60: [
        "Complete root-cause validation using process data, stakeholder interviews, and Excenor's Lean Six Sigma toolset.",
        "Design future-state process options and select a pilot scope with clear value, feasibility, and risk logic.",
        "Define pilot KPIs, governance, and change communication so the improvement can move from design to deployment.",
      ],
      day90: [
        "Run the pilot and monitor KPI movement with Excenor supporting issue resolution and benefit tracking.",
        "Document lessons, control requirements, and automation opportunities before wider rollout.",
        "Prepare an Excenor-supported scale-up roadmap with ownership, benefits, and capability needs.",
      ],
    },
    excenorSupport: {
      advisory: [
        "Facilitate executive alignment on project value, scope, risks, and measurable outcomes so the effort starts with leadership clarity.",
        "Shape the DMAIC charter and governance rhythm through Excenor's Discover and Diagnose phases.",
      ],
      consulting: [
        "Run process discovery, current-state diagnosis, root-cause analysis, and future-state design using Excenor's process excellence and AI-enabled Lean Six Sigma capability.",
        "Build a prioritized improvement and automation roadmap that converts the diagnostic into a deployable consulting engagement.",
      ],
      changeManagement: [
        "Prepare stakeholder messaging, role clarity, adoption plans, and review routines so the redesigned process is accepted by the teams who must run it.",
        "Support benefit tracking and operational ownership after deployment, reducing the risk that improvements remain only on paper.",
      ],
      capabilityBuilding: [
        "Build Yellow Belt, Green Belt, and process-owner capability around practical DMAIC execution, not just awareness.",
        "Transfer Excenor templates, tools, and review mechanisms so client teams can sustain the gain after the engagement.",
      ],
    },
  };
}
