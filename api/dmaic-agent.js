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
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

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

Excenor context:
- Excenor Global is a consulting, advisory, and corporate capability-building firm.
- Excenor emphasizes execution, measurable outcomes, process discipline, AI-enabled Lean Six Sigma, process excellence, business process reengineering, change management, and capability transfer.
- Excenor's 5D engagement model is Discover, Diagnose, Design, Deploy, Demonstrate.

Tone:
- Premium consulting tone.
- Practical, business-focused, and specific to the user's process and industry.
- Not academic. No exaggerated claims.
- Make clear this is AI-assisted and should be reviewed by an Excenor expert before client use.

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
    executiveSummary: `${company} is experiencing a process improvement opportunity in ${process}. The current problem should be framed around measurable business impact, baseline performance, likely root causes, and a controlled improvement roadmap. This draft is intended to help structure the first Excenor discovery conversation.`,
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
        "Standardize intake requirements and acceptance criteria.",
        "Remove duplicate approvals and clarify decision rights.",
        "Introduce exception-based handling for high-risk cases.",
        "Create visual management for backlog, aging, and SLA risk.",
      ],
      pilotIdeas: [
        "Pilot a redesigned flow for one high-volume request type.",
        "Run a two-week backlog aging review with daily owner actions.",
        "Test a simplified approval matrix with clear escalation rules.",
      ],
      automationOpportunities: [
        "Automated intake validation",
        "Workflow routing and reminders",
        "Dashboarding for cycle time, SLA risk, and exceptions",
        "Rule-based approvals for low-risk transactions",
      ],
      aiOpportunities: [
        "Summarize request context for reviewers.",
        "Classify incoming requests by complexity and risk.",
        "Detect recurring rework themes from comments or case notes.",
        "Recommend next-best actions for common exception types.",
      ],
    },
    control: {
      controlPlan: [
        "Define process KPIs, owners, data sources, and review thresholds.",
        "Create a standard operating procedure for the redesigned process.",
        "Track defects, exceptions, and control breaches after launch.",
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
        "Automation may scale poor process design if root causes are not fixed first.",
      ],
    },
    actionPlan: {
      day30: [
        "Confirm project charter, scope, stakeholders, and target outcomes.",
        "Map current state and validate baseline data availability.",
        "Identify the top friction points and prioritize root-cause analysis.",
      ],
      day60: [
        "Complete root-cause validation using process data and stakeholder interviews.",
        "Design future-state process options and select a pilot scope.",
        "Define pilot KPIs, governance, and change communication.",
      ],
      day90: [
        "Run the pilot and monitor KPI movement.",
        "Document lessons, control requirements, and automation opportunities.",
        "Prepare a scale-up roadmap with ownership, benefits, and capability needs.",
      ],
    },
    excenorSupport: {
      advisory: [
        "Facilitate executive alignment on project value, scope, and measurable outcomes.",
        "Shape the DMAIC charter and governance rhythm.",
      ],
      consulting: [
        "Run process discovery, current-state diagnosis, root-cause analysis, and future-state design.",
        "Build a prioritized improvement and automation roadmap.",
      ],
      changeManagement: [
        "Prepare stakeholder messaging, role clarity, adoption plans, and review routines.",
        "Support benefit tracking and operational ownership after deployment.",
      ],
      capabilityBuilding: [
        "Build Yellow Belt, Green Belt, and process-owner capability around practical DMAIC execution.",
        "Transfer templates, tools, and review mechanisms so client teams can sustain the gain.",
      ],
    },
  };
}
