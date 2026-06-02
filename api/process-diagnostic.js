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

  if (!process.env.GEMINI_API_KEY) {
    return response.status(200).json({
      mode: "demo",
      report: createDemoReport(input),
    });
  }

  try {
    const report = await generateGeminiReport(input);
    return response.status(200).json({ mode: "live", report });
  } catch (error) {
    return response.status(502).json({
      error: "We could not generate the diagnostic right now. Please try again.",
    });
  }
}

function sanitizeInput(raw) {
  return {
    companyName: cleanText(raw.companyName, 140),
    industry: cleanText(raw.industry, 140),
    processName: cleanText(raw.processName, 180),
    processDescription: cleanText(raw.processDescription, 1800),
    desiredOutcome: cleanText(raw.desiredOutcome, 900),
    problemStatement: cleanText(raw.problemStatement, 1400),
    painPoints: cleanText(raw.painPoints, 1400),
    availableMetrics: cleanText(raw.availableMetrics, 1400),
    referenceInfo: cleanText(raw.referenceInfo, 1800),
    currentSystems: cleanText(raw.currentSystems, 800),
    processVolume: cleanText(raw.processVolume, 600),
    stakeholders: cleanText(raw.stakeholders, 700),
    riskSensitivity: cleanText(raw.riskSensitivity, 80) || "Not Sure",
    improvementPriority: cleanText(raw.improvementPriority, 120) || "Not Sure",
  };
}

function cleanText(value, limit) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function validateInput(input) {
  if (!input.processName) {
    return "Process Name is required.";
  }

  if (!input.processDescription) {
    return "Process Description is required.";
  }

  if (!input.problemStatement) {
    return "Problem Statement is required.";
  }

  return "";
}

async function generateGeminiReport(input) {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = process.env.GEMINI_MODEL || EXCENOR_DEFAULT_MODEL;

  const result = await ai.models.generateContent({
    model,
    contents: buildUserPrompt(input),
    config: {
      temperature: 0.28,
      maxOutputTokens: 4500,
      systemInstruction: buildSystemInstruction(),
    },
  });

  return (
    result.text ||
    "## Executive Summary\n- We could not generate a complete diagnostic. Please try again with more process context."
  );
}

function buildSystemInstruction() {
  return `
You are the Excenor Process Intelligence Agent, an AI-enabled consulting accelerator for Excenor Global.
Your role is to analyse a business process using structured process excellence, Lean Six Sigma, risk, control, governance, automation, AI readiness, change management and measurable outcome thinking.

${buildExcenorPromptSection()}

You must produce a practical consulting-style diagnostic report. You are not a generic chatbot. You think like a senior Excenor consultant. You must be clear, structured, practical and business-friendly.

Use Excenor's approach: Discover, Diagnose, Design, Deploy and Demonstrate. Focus on measurable outcomes, ownership, controls, adoption and sustained capability.
Do not provide generic AI hype. Do not say AI can solve everything. Do not invent data or claim guaranteed savings. Separate facts from assumptions. If information is missing, say what is needed.

Use popular working frameworks only as thinking lenses: Lean Six Sigma, DMAIC, SIPOC, Value Stream Mapping, Root Cause Analysis, 5 Whys, Fishbone thinking, FMEA-style risk thinking, RACI, KPI design, process control plans, ISO-style audit readiness, cyber/privacy/digital trust considerations, PMO governance, and change management. Explain recommendations in simple business language.

When automation or AI is suggested, ensure the process is standardised, governed and measurable. Always include human oversight, data privacy, cybersecurity, access control, audit trail and change adoption considerations where relevant.

Recommendations must implicitly show why Excenor is needed: independent diagnosis, stakeholder alignment, process redesign, risk/control validation, automation readiness, change management, capability transfer and measurable impact demonstration.
Avoid hard-selling language. Use confident advisory language such as "Excenor can help", "an Excenor-led workshop would", "this should be validated through Excenor's 5D approach", and "the next practical step is an Excenor discovery conversation".

Return the report in clean structured Markdown with headings, tables and bullet points. Do not include HTML.
`.trim();
}

function buildUserPrompt(input) {
  return `
Analyse the following business process and generate an Excenor-style Process Intelligence Diagnostic Report.

Business / Company Name:
${input.companyName || "Not provided"}

Industry:
${input.industry || "Not provided"}

Process Name:
${input.processName}

Process Description:
${input.processDescription}

Desired Outcome:
${input.desiredOutcome || "Not provided"}

Problem Statement:
${input.problemStatement}

Current Pain Points:
${input.painPoints || "Not provided"}

Available Data / Metrics:
${input.availableMetrics || "Not provided"}

Uploaded / Reference Information:
${input.referenceInfo || "Not provided"}

Current Systems / Tools Used:
${input.currentSystems || "Not provided"}

Process Frequency / Volume:
${input.processVolume || "Not provided"}

Main Stakeholders:
${input.stakeholders || "Not provided"}

Risk / Compliance Sensitivity:
${input.riskSensitivity}

Improvement Priority:
${input.improvementPriority}

Required report structure:
1. Executive Summary
2. Process Diagnosis
3. Key Friction Points
4. Automation Opportunities
5. Risk and Control Gaps
6. Root Cause View
7. Future-State Workflow Suggestions
8. Recommended KPIs
9. Implementation Priorities
10. Excenor 5D Roadmap
11. Recommended Excenor Support Pathway
12. Assumptions and Information Needed
13. Final Recommendation

Important instructions:
- Be specific to the process described.
- Use simple, professional consulting language.
- Do not invent facts.
- Clearly separate assumptions from confirmed inputs.
- Recommend automation only where the process is ready or after standardisation.
- Include governance, controls, privacy, cybersecurity, auditability and change management where relevant.
- Make the output easy for a business leader to understand.
- Align recommendations with measurable outcomes.
`.trim();
}

function createDemoReport(input) {
  const company = input.companyName || "the organization";
  const industry = input.industry || "the relevant industry";
  const outcome = input.desiredOutcome || "reduce friction, improve visibility and strengthen control";
  const stakeholders = input.stakeholders || "process owner, operations, technology, risk/control and business leadership";
  const systems = input.currentSystems || "current workflow tools, spreadsheets, email approvals or core business systems";

  return `
## 1. Executive Summary
- ${company} has described a process challenge in **${input.processName}** where the main issue appears to be workflow friction, ownership clarity and control visibility.
- The stated problem suggests delays, manual follow-ups, rework or inconsistent decision rules may be affecting performance.
- The main improvement theme is to standardise the process before scaling automation or AI-enabled decision support.
- The diagnostic should be validated through an Excenor discovery conversation so assumptions, data, controls and stakeholder expectations can be confirmed.
- The likely outcome focus is to ${outcome}.

## 2. Process Diagnosis
The current process appears to depend on a mix of human follow-up, fragmented information and unclear control points. This does not mean teams are underperforming; it means the workflow design may not be giving people enough clarity, visibility or decision support.

Likely root causes include unclear ownership, inconsistent intake quality, manual tracking, weak SLA visibility and limited performance measurement. Excenor can help validate these causes through current-state mapping, stakeholder interviews and data review.

## 3. Key Friction Points
| Issue | Business Impact | Evidence From Input |
| --- | --- | --- |
| Manual handoffs | Slower cycle time and higher follow-up effort | Process description and pain points indicate manual coordination |
| Unclear ownership | Delayed decisions and repeated escalation | Stakeholders listed: ${stakeholders} |
| Limited status visibility | Leaders cannot easily see backlog, ageing or SLA risk | Available metrics: ${input.availableMetrics || "not provided"} |
| Rework and exceptions | Extra effort and inconsistent customer or stakeholder experience | Problem statement references process delay or repeated follow-up |
| Automation readiness gap | Automating too early may scale poor process design | Current systems: ${systems} |

## 4. Automation Opportunities
### Quick automation opportunities
- Automated reminders for pending actions after ownership and SLA rules are confirmed.
- Standard intake checklist to reduce missing information.
- Simple dashboard for backlog, ageing and exception visibility.

### Workflow automation opportunities
- Workflow routing based on request type, approval level and risk category.
- Approval matrix with clear escalation rules.
- Exception workflow for non-standard cases.

### AI-enabled opportunities
- Summarise case notes or request context for reviewers.
- Classify requests by complexity, risk or missing information.
- Identify recurring rework themes from free-text comments.

**Important:** Excenor should first validate whether the process is standardised enough for automation. If not, the first step is process redesign, governance and measurement discipline.

## 5. Risk and Control Gaps
| Risk / Control Gap | Why It Matters | Suggested Control |
| --- | --- | --- |
| Weak audit trail | Decisions may be difficult to evidence later | Workflow log, approval history and document trail |
| Unclear access or approval rights | Sensitive or financial actions may be approved inconsistently | Role-based approval matrix and access review |
| Incomplete data capture | Root causes and performance cannot be measured reliably | Mandatory fields and data quality checks |
| Manual exception handling | Exceptions may bypass standard controls | Defined exception workflow and review cadence |
| Privacy or cyber exposure where sensitive data is involved | Customer, employee, vendor or financial data may need stronger protection | Excenor Digital Trust review for privacy, access and auditability |

## 6. Root Cause View
### Process
- Handoffs, approvals or exception paths may not be clearly defined.
- SOPs may not reflect the real working process.

### People / Roles
- Decision rights and accountability may be unclear across ${stakeholders}.

### Systems / Data
- ${systems} may not provide sufficient workflow visibility or reporting.

### Controls / Governance
- Control points may exist, but may not be embedded into the daily workflow.

### Measurement
- Baseline KPIs may be incomplete, making benefits difficult to demonstrate.

## 7. Future-State Workflow Suggestions
- From email-based follow-ups -> To workflow-based approval tracking with SLA alerts.
- From unclear ownership -> To named process owner, step owners and escalation path.
- From duplicate checks -> To risk-based approval and exception handling.
- From manual status reporting -> To dashboard visibility for backlog, ageing and cycle time.
- From inconsistent intake -> To standard request form and validation checklist.
- From informal exception handling -> To controlled exception workflow with audit trail.
- From isolated improvement ideas -> To Excenor-led redesign, pilot and controlled rollout.

## 8. Recommended KPIs
### Speed
- Average cycle time
- SLA adherence
- Approval ageing

### Quality
- First-time-right rate
- Rework count
- Exception rate

### Cost / Productivity
- Cost per transaction
- Manual touchpoints per request

### Control / Compliance
- Control breach count
- Audit finding closure rate
- Approval policy exceptions

### Customer / Stakeholder Experience
- Complaint count
- Internal stakeholder satisfaction
- Follow-up volume

## 9. Implementation Priorities
| Horizon | Action | Owner | Expected Benefit | Dependency |
| --- | --- | --- | --- | --- |
| Immediate Actions: 0-30 days | Run Excenor discovery workshop and current-state mapping | Business sponsor + process owner | Shared understanding of problem and scope | Stakeholder availability |
| Immediate Actions: 0-30 days | Confirm baseline KPIs and available data | Process owner + data owner | Measurable starting point | Data access |
| Short-Term Actions: 31-90 days | Design future-state workflow and pilot scope | Excenor + process team | Reduced friction and clearer ownership | Validated root causes |
| Short-Term Actions: 31-90 days | Define controls, approval matrix and dashboard | Risk/control + process owner | Stronger governance and visibility | Agreed decision rules |
| Medium-Term Actions: 3-6 months | Deploy workflow automation or AI-enabled support where ready | IT + process owner | Scalable improvement | Standardised process and control plan |

## 10. Excenor 5D Roadmap
| Phase | Objective | Activities | Outputs | Success Measures |
| --- | --- | --- | --- | --- |
| Discover | Align leaders on the process problem and business value | Stakeholder interviews, process walk-through, VOC/CTQ capture | Project charter and discovery summary | Clear scope and agreed outcomes |
| Diagnose | Validate root causes and baseline performance | SIPOC, value stream map, data review, 5 Whys, risk/control review | Root-cause view and friction heatmap | Evidence-based priorities |
| Design | Build future-state workflow and control model | RACI, approval matrix, KPI design, automation readiness assessment | Future-state design and pilot plan | Feasible design accepted by owners |
| Deploy | Implement, pilot and enable adoption | Pilot rollout, documentation, change management, governance activation, team enablement | Live pilot and adoption plan | Process used by teams with visible KPI movement |
| Demonstrate | Prove benefits and sustain control | KPI review, control checks, lessons learned, scale-up roadmap | Benefits dashboard and sustainment plan | Measurable impact and internal ownership |

## 11. Recommended Excenor Support Pathway
- **Advisory:** Useful if leadership needs alignment on scope, value, governance and transformation priorities.
- **Consulting:** Relevant for process mapping, redesign, root-cause validation, automation readiness and implementation support.
- **Cybersecurity & Digital Trust:** Relevant if the process includes customer data, employee data, vendor data, financial approvals, access rights, audit logs or compliance exposure.
- **Skill Development / Capability Academy:** Useful if teams need practical Lean Six Sigma, process ownership, problem-solving or change adoption capability.

## 12. Assumptions and Information Needed
### Assumptions
- The process has measurable friction, but exact baseline data needs validation.
- Some issues may be caused by workflow design rather than individual performance.
- Automation may be valuable, but only after standardisation and control design.

### Information needed
- Current SOP or process map.
- Actual cycle time, backlog, volume and exception data.
- Approval matrix and control requirements.
- System reports, audit findings or complaint themes.
- Stakeholder roles and decision rights.

## 13. Final Recommendation
The highest-impact next step is an Excenor-led discovery and diagnosis workshop. This will convert the AI-assisted view into a validated process improvement roadmap covering friction reduction, automation readiness, control design, KPIs, change adoption and measurable business outcomes.
`.trim();
}
