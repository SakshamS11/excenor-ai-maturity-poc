const maturityPillars = [
  {
    id: "strategy",
    label: "Strategy",
    weight: 15,
    description: "Business goals, executive sponsorship, investment logic and AI roadmap clarity.",
    actions: [
      "Run an Excenor AI ambition and value-alignment workshop with leadership.",
      "Translate AI interest into business outcomes, target processes, investment themes and governance cadence.",
    ],
  },
  {
    id: "data",
    label: "Data",
    weight: 18,
    description: "Data quality, access, integration, ownership, real-time readiness and analytics usability.",
    actions: [
      "Profile critical datasets and identify quality, access, ownership and privacy gaps.",
      "Create a data-readiness plan for priority AI use cases before scaling experimentation.",
    ],
  },
  {
    id: "governance",
    label: "Governance",
    weight: 14,
    description: "Responsible AI, risk, cyber, privacy, auditability, approvals and model monitoring.",
    actions: [
      "Define responsible AI controls, approval paths, privacy expectations and human-in-the-loop rules.",
      "Create an AI governance cadence linked to cyber, digital trust, compliance and business ownership.",
    ],
  },
  {
    id: "technology",
    label: "Technology",
    weight: 14,
    description: "Cloud, workflow integration, APIs, automation stack, MLOps and deployment readiness.",
    actions: [
      "Assess integration readiness across core systems, workflow tools and data platforms.",
      "Identify where automation, process mining, dashboards or AI services can be deployed without scaling poor process design.",
    ],
  },
  {
    id: "operatingModel",
    label: "Operating Model",
    weight: 14,
    description: "Process ownership, product teams, delivery model, PMO governance and cross-functional execution.",
    actions: [
      "Clarify ownership across business, IT, risk, data and process teams for each AI opportunity.",
      "Use Excenor's 5D model to move selected opportunities from discovery to pilot and benefit demonstration.",
    ],
  },
  {
    id: "people",
    label: "People",
    weight: 13,
    description: "AI literacy, role-based capability, adoption confidence, change readiness and citizen enablement.",
    actions: [
      "Build role-based AI literacy and responsible-use capability for leaders, process owners and frontline teams.",
      "Create adoption routines so people understand where AI supports decisions and where human judgment remains accountable.",
    ],
  },
  {
    id: "value",
    label: "AI Value",
    weight: 12,
    description: "Use-case portfolio, measurable ROI, benefit tracking, scale discipline and value realization.",
    actions: [
      "Prioritize use cases by value, feasibility, data readiness, risk and speed-to-impact.",
      "Define benefit measures such as cycle time, cost-to-serve, first-pass yield, risk reduction, customer experience and leadership visibility.",
    ],
  },
];

const maturityQuestions = [
  {
    id: "strategy_alignment",
    pillar: "strategy",
    text: "How clearly is AI linked to business priorities, growth, efficiency, customer experience or risk reduction?",
    help: "Assess whether AI is a leadership agenda or only a scattered experimentation topic.",
    options: [
      "AI is not linked to business priorities",
      "AI is discussed, but goals are informal",
      "Some business priorities are connected to AI ideas",
      "AI priorities are documented and leadership-backed",
      "AI priorities are funded, measured and reviewed by leadership",
    ],
  },
  {
    id: "strategy_roadmap",
    pillar: "strategy",
    text: "How mature is your AI roadmap and investment logic?",
    help: "Look for sequencing, value cases, ownership, investment decisions and review cadence.",
    options: [
      "No roadmap or investment logic exists",
      "Roadmap is being explored without clear ownership",
      "A basic roadmap exists for selected use cases",
      "Roadmap links use cases, owners, investment and outcomes",
      "Roadmap is governed, funded and refreshed based on measured impact",
    ],
  },
  {
    id: "data_foundation",
    pillar: "data",
    text: "How ready is your data foundation for AI use cases?",
    help: "Consider quality, access, integration, master data, ownership and consistency.",
    options: [
      "Data is fragmented, inconsistent or difficult to access",
      "Useful data exists, but quality and ownership are weak",
      "Core datasets are available with known gaps",
      "Critical data is reliable, accessible and governed",
      "Data is connected, real-time where needed and trusted for AI decisions",
    ],
  },
  {
    id: "data_monitoring",
    pillar: "data",
    text: "How well can you measure process performance, variation and early warning signals?",
    help: "Strong AI maturity needs visibility into cycle time, defects, exceptions, drift and risk signals.",
    options: [
      "Performance data is mostly manual or missing",
      "Basic reports exist but do not show root causes",
      "Some KPIs and dashboards exist for key processes",
      "Dashboards show trends, exceptions and ownership",
      "Real-time monitoring supports prediction, anomaly detection and preventive action",
    ],
  },
  {
    id: "governance_policy",
    pillar: "governance",
    text: "How mature are your responsible AI, privacy, cyber and compliance controls?",
    help: "Consider policies, approvals, audit trails, access, privacy, model risk and human accountability.",
    options: [
      "No formal AI governance controls exist",
      "Basic privacy or cyber controls exist but not AI-specific",
      "Early AI guidelines exist for selected teams",
      "Responsible AI controls and approval paths are defined",
      "Controls are monitored, audited and embedded into AI delivery",
    ],
  },
  {
    id: "governance_monitoring",
    pillar: "governance",
    text: "How well do you monitor AI performance, risk, drift and adoption after launch?",
    help: "AI initiatives need control after deployment, not only during approval.",
    options: [
      "Post-launch monitoring is not defined",
      "Monitoring is informal and reactive",
      "Basic metrics are reviewed for some pilots",
      "Business, risk and adoption metrics are reviewed regularly",
      "Model performance, drift, controls and value are continuously governed",
    ],
  },
  {
    id: "technology_integration",
    pillar: "technology",
    text: "How ready is your technology stack for AI integration and automation?",
    help: "Assess APIs, cloud/data platforms, workflow tools, security, deployment and MLOps readiness.",
    options: [
      "Systems are disconnected or mostly manual",
      "Some tools exist but integration is limited",
      "Selected systems support reporting and automation",
      "Core systems are integrated and automation-ready",
      "Modern platforms, APIs and MLOps support scalable AI deployment",
    ],
  },
  {
    id: "technology_process_intelligence",
    pillar: "technology",
    text: "How well do you use process mining, workflow analytics or digital controls?",
    help: "Mature organizations can see actual process behavior before automating.",
    options: [
      "No process intelligence tools are used",
      "Process visibility depends mainly on manual mapping",
      "Dashboards exist but process-mining depth is limited",
      "Process intelligence informs workflow redesign and automation",
      "Closed-loop monitoring supports mine-first-automate-later improvement",
    ],
  },
  {
    id: "operating_ownership",
    pillar: "operatingModel",
    text: "How clear is business ownership for AI use cases and process outcomes?",
    help: "AI value depends on process owners, data owners, IT, risk and business sponsors working together.",
    options: [
      "Ownership is unclear or fragmented",
      "Ownership is informal and person-dependent",
      "Some use cases have named owners",
      "Business, data, technology and risk roles are defined",
      "Cross-functional ownership is embedded into delivery governance",
    ],
  },
  {
    id: "operating_delivery",
    pillar: "operatingModel",
    text: "How disciplined is your AI delivery model from discovery to scale?",
    help: "Consider prioritization, pilots, change management, PMO governance and benefit tracking.",
    options: [
      "AI delivery is ad hoc",
      "Pilots happen but without consistent method",
      "A repeatable delivery approach is emerging",
      "Use cases move through defined discovery, pilot and rollout stages",
      "Delivery is governed, measured and scaled through an enterprise operating model",
    ],
  },
  {
    id: "people_literacy",
    pillar: "people",
    text: "How prepared are employees and leaders to use AI responsibly and effectively?",
    help: "Assess literacy, confidence, ethical use, workflow adoption and role clarity.",
    options: [
      "AI awareness is very limited",
      "People are curious but unsure how to use AI safely",
      "Some teams can use AI for basic productivity",
      "Role-based AI guidance and training are in place",
      "AI capability is embedded into roles, decision routines and improvement culture",
    ],
  },
  {
    id: "people_change",
    pillar: "people",
    text: "How mature is your change management and capability-building approach for AI?",
    help: "AI maturity rises when people can adopt new workflows, not only new tools.",
    options: [
      "No structured change approach exists",
      "Change is handled through communication only",
      "Training exists but is not tied to adoption metrics",
      "Change plans, champions and capability programs support key use cases",
      "Continuous capability building supports citizen developers and human-AI collaboration",
    ],
  },
  {
    id: "value_prioritization",
    pillar: "value",
    text: "How well do you prioritize AI use cases by value, feasibility, data readiness and risk?",
    help: "Strong maturity means choosing use cases that can produce measurable business outcomes.",
    options: [
      "Use cases are not formally identified",
      "Ideas exist but are not prioritized consistently",
      "Use cases are prioritized with basic value and feasibility criteria",
      "Use cases are ranked by value, readiness, risk and process impact",
      "Portfolio decisions are continuously optimized based on measurable value",
    ],
  },
  {
    id: "value_realization",
    pillar: "value",
    text: "How consistently do AI initiatives demonstrate measurable value after deployment?",
    help: "Look for ROI, cycle time, quality, cost-to-serve, risk reduction, customer experience and leadership visibility.",
    options: [
      "Value is not measured",
      "Value is described qualitatively but rarely tracked",
      "Some pilots track basic success metrics",
      "Deployed use cases track business outcomes and adoption",
      "AI value is measured, reported and used to guide scale decisions",
    ],
  },
];

const maturityLevels = [
  {
    min: 0,
    max: 25,
    name: "Foundation",
    narrative:
      "AI interest exists, but readiness is fragmented. Excenor should first establish business goals, process focus, data reality and governance basics.",
  },
  {
    min: 26,
    max: 45,
    name: "Emerging",
    narrative:
      "The organization is experimenting with AI but needs sharper prioritization, ownership and data discipline to avoid disconnected pilots.",
  },
  {
    min: 46,
    max: 65,
    name: "Operational",
    narrative:
      "AI can begin moving into defined workflows. The priority is to connect use cases to process redesign, controls, adoption and measurable value.",
  },
  {
    min: 66,
    max: 82,
    name: "Scaled",
    narrative:
      "AI capability is becoming repeatable across functions. Excenor should help strengthen governance, process intelligence and value realization.",
  },
  {
    min: 83,
    max: 100,
    name: "Transformational",
    narrative:
      "AI can reshape operating capability and decision-making. The next step is disciplined Predict-to-Prevent transformation with strong human oversight.",
  },
];

const contextForm = document.querySelector("#maturityContextForm");
const assessmentShell = document.querySelector("#maturityAssessmentShell");
const questionCard = document.querySelector("#maturityQuestionCard");
const questionPillar = document.querySelector("#questionPillar");
const questionProgress = document.querySelector("#questionProgress");
const questionProgressFill = document.querySelector("#questionProgressFill");
const questionText = document.querySelector("#questionText");
const questionHelp = document.querySelector("#questionHelp");
const answerOptions = document.querySelector("#answerOptions");
const previousButton = document.querySelector("#previousQuestionButton");
const restartQuestionsButton = document.querySelector("#restartMaturityQuestionsButton");
const reportArea = document.querySelector("#maturityReportArea");
const pillarList = document.querySelector("#pillarList");
const organizationInput = document.querySelector("#modelOrganization");
const industryInput = document.querySelector("#modelIndustry");
const ambitionInput = document.querySelector("#modelAmbition");
const horizonInput = document.querySelector("#modelHorizon");
const readinessIndex = document.querySelector("#readinessIndex");
const heroScore = document.querySelector("#heroScore");
const maturityStage = document.querySelector("#maturityStage");
const maturityNarrative = document.querySelector("#maturityNarrative");
const radarChart = document.querySelector("#radarChart");
const gapChart = document.querySelector("#gapChart");
const maturityHeatmap = document.querySelector("#maturityHeatmap");
const maturityRoadmap = document.querySelector("#maturityRoadmap");
const roadmapTitle = document.querySelector("#roadmapTitle");
const copyButton = document.querySelector("#copyMaturityReportButton");
const resetButton = document.querySelector("#resetMaturityModelButton");
const copyStatus = document.querySelector("#maturityCopyStatus");
const reportTitle = document.querySelector("#reportTitle");
const reportIntro = document.querySelector("#reportIntro");
const aiInsightsStatus = document.querySelector("#aiInsightsStatus");
const aiInsightsContent = document.querySelector("#aiInsightsContent");
const refreshAiInsightsButton = document.querySelector("#refreshAiInsightsButton");

const state = {
  currentQuestion: 0,
  answers: {},
  currentModel: null,
  aiInsights: null,
  context: {
    organization: "",
    industry: "",
    ambition: "",
    horizon: "",
  },
};

function getPillar(id) {
  return maturityPillars.find((pillar) => pillar.id === id);
}

function getLevel(score) {
  return maturityLevels.find((level) => score >= level.min && score <= level.max) || maturityLevels[0];
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[character];
  });
}

function getTargetForPillar(current, pillarId) {
  const ambition = state.context.ambition || ambitionInput.value;
  const horizon = state.context.horizon || horizonInput.value;
  const ambitionLift = ambition.includes("business excellence")
    ? 2
    : ambition.includes("predictive")
      ? 2
      : ambition.includes("Scale")
        ? 1.5
        : 1;
  const horizonLift = horizon === "12 months" ? 0.5 : horizon === "6 months" ? 0.25 : 0;
  const criticalLift = ["strategy", "data", "governance", "value"].includes(pillarId) ? 0.25 : 0;
  return Math.min(5, Math.max(current, Math.ceil(current + ambitionLift + horizonLift + criticalLift)));
}

function calculateModel() {
  const pillarResults = maturityPillars.map((pillar) => {
    const questionSet = maturityQuestions.filter((question) => question.pillar === pillar.id);
    const total = questionSet.reduce((sum, question) => sum + (state.answers[question.id] || 0), 0);
    const current = questionSet.length ? Math.round((total / questionSet.length) * 10) / 10 : 0;
    const target = getTargetForPillar(current, pillar.id);
    const currentScore = (current / 5) * pillar.weight;
    const targetScore = (target / 5) * pillar.weight;
    const gap = Math.max(target - current, 0);
    return {
      ...pillar,
      current,
      target,
      currentScore,
      targetScore,
      gap,
      gapScore: targetScore - currentScore,
    };
  });

  const total = pillarResults.reduce((sum, pillar) => sum + pillar.currentScore, 0);
  const target = pillarResults.reduce((sum, pillar) => sum + pillar.targetScore, 0);
  const readiness = Math.round(total);
  const targetIndex = Math.round(target);
  const prioritized = [...pillarResults].sort((a, b) => b.gapScore - a.gapScore || a.current - b.current);

  return {
    readiness,
    targetIndex,
    level: getLevel(readiness),
    pillarResults,
    prioritized,
  };
}

function renderQuestion() {
  const question = maturityQuestions[state.currentQuestion];
  const pillar = getPillar(question.pillar);
  const progress = (state.currentQuestion / maturityQuestions.length) * 100;

  questionPillar.textContent = pillar.label;
  questionProgress.textContent = `${state.currentQuestion + 1} of ${maturityQuestions.length}`;
  questionProgressFill.style.width = `${progress}%`;
  questionText.textContent = question.text;
  questionHelp.textContent = question.help;
  previousButton.disabled = state.currentQuestion === 0;
  answerOptions.replaceChildren();

  question.options.forEach((option, index) => {
    const value = index + 1;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "maturity-answer-card";
    const isSelected = state.answers[question.id] === value;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
    button.innerHTML = `
      <strong>${value}</strong>
      <span>${escapeHtml(option)}</span>
    `;
    button.addEventListener("click", () => answerQuestion(question.id, value));
    answerOptions.append(button);
  });
}

function answerQuestion(questionId, value) {
  state.answers[questionId] = value;

  if (state.currentQuestion < maturityQuestions.length - 1) {
    state.currentQuestion += 1;
    renderQuestion();
    return;
  }

  showReport();
}

function showPreviousQuestion() {
  if (state.currentQuestion === 0) {
    return;
  }

  state.currentQuestion -= 1;
  renderQuestion();
}

function renderPillars(pillarResults) {
  pillarList.replaceChildren();

  pillarResults.forEach((pillar) => {
    const card = document.createElement("article");
    card.className = "maturity-pillar-card maturity-pillar-summary-card";
    card.innerHTML = `
      <div class="maturity-pillar-heading">
        <div>
          <strong>${pillar.label}</strong>
          <p>${pillar.description}</p>
        </div>
        <span>${pillar.weight}%</span>
      </div>
      <div class="pillar-score-pair">
        <span>Current <strong>${pillar.current}/5</strong></span>
        <span>Target <strong>${pillar.target}/5</strong></span>
        <span>Gap <strong>${pillar.gap.toFixed(1)}</strong></span>
      </div>
    `;
    pillarList.append(card);
  });
}

function pointOnCircle(center, radius, index, total, value) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / total;
  const scaledRadius = radius * (value / 5);
  return {
    x: center + Math.cos(angle) * scaledRadius,
    y: center + Math.sin(angle) * scaledRadius,
  };
}

function polygonPoints(values, center, radius) {
  return values
    .map((value, index) => {
      const point = pointOnCircle(center, radius, index, values.length, value);
      return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    })
    .join(" ");
}

function renderRadar(pillarResults) {
  const center = 160;
  const radius = 104;
  const rings = [1, 2, 3, 4, 5]
    .map((level) => {
      const points = polygonPoints(new Array(pillarResults.length).fill(level), center, radius);
      return `<polygon points="${points}" class="radar-ring"></polygon>`;
    })
    .join("");

  const axes = pillarResults
    .map((pillar, index) => {
      const edge = pointOnCircle(center, radius, index, pillarResults.length, 5);
      const label = pointOnCircle(center, radius + 28, index, pillarResults.length, 5);
      return `
        <line x1="${center}" y1="${center}" x2="${edge.x.toFixed(1)}" y2="${edge.y.toFixed(1)}" class="radar-axis"></line>
        <text x="${label.x.toFixed(1)}" y="${label.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" class="radar-label">${pillar.label}</text>
      `;
    })
    .join("");

  const currentPoints = polygonPoints(
    pillarResults.map((pillar) => pillar.current),
    center,
    radius
  );
  const targetPoints = polygonPoints(
    pillarResults.map((pillar) => pillar.target),
    center,
    radius
  );

  radarChart.innerHTML = `
    ${rings}
    ${axes}
    <polygon points="${targetPoints}" class="radar-target"></polygon>
    <polygon points="${currentPoints}" class="radar-current"></polygon>
    <circle cx="${center}" cy="${center}" r="3" class="radar-center"></circle>
  `;
}

function getHeatClass(value) {
  if (value >= 4) return "is-strong";
  if (value >= 3) return "is-moderate";
  return "is-weak";
}

function renderGapChart(pillarResults) {
  gapChart.replaceChildren();

  pillarResults
    .slice()
    .sort((a, b) => b.gap - a.gap)
    .forEach((pillar) => {
      const row = document.createElement("div");
      row.className = "gap-row";
      row.innerHTML = `
        <strong>${pillar.label}</strong>
        <div class="gap-track"><span style="width: ${(pillar.gap / 4) * 100}%"></span></div>
        <small>${pillar.gap.toFixed(1)} gap</small>
      `;
      gapChart.append(row);
    });
}

function renderHeatmap(pillarResults) {
  maturityHeatmap.replaceChildren();

  pillarResults.forEach((pillar) => {
    const item = document.createElement("div");
    item.className = `heatmap-cell ${getHeatClass(pillar.current)}`;
    item.innerHTML = `
      <strong>${pillar.label}</strong>
      <span>Current ${pillar.current}/5</span>
      <small>Target ${pillar.target}/5</small>
    `;
    maturityHeatmap.append(item);
  });
}

function getRoadmapPhases(horizon) {
  if (horizon === "6 months") {
    return ["0-2 Months", "3-4 Months", "5-6 Months"];
  }

  if (horizon === "12 months") {
    return ["0-3 Months", "4-6 Months", "7-12 Months"];
  }

  return ["0-30 Days", "31-60 Days", "61-90 Days"];
}

function renderRoadmap(model) {
  const top = model.prioritized.slice(0, 3);
  const organization = state.context.organization || "the organization";
  const industry = state.context.industry || "the selected industry";
  const horizon = state.context.horizon;
  const ambition = state.context.ambition;
  const phaseTitles = getRoadmapPhases(horizon);

  roadmapTitle.textContent = `Priority actions for the ${horizon} AI maturity roadmap`;

  const phases = [
    {
      title: phaseTitles[0],
      body: `Run an Excenor Discover and Diagnose sprint for ${organization}, focused on ${top
        .map((pillar) => pillar.label)
        .join(", ")} in the ${industry} context.`,
      points: [
        "Confirm business outcomes, target workflows, data availability and stakeholder ownership.",
        "Baseline current capability and identify assumption-based risks before technology selection.",
      ],
    },
    {
      title: phaseTitles[1],
      body: `Design the operating model and use-case portfolio needed to ${ambition.toLowerCase()}.`,
      points: top.flatMap((pillar) => pillar.actions.slice(0, 1)),
    },
    {
      title: phaseTitles[2],
      body: `Deploy a controlled pilot and demonstrate KPI movement within the ${horizon} roadmap horizon.`,
      points: [
        "Track benefits through leadership dashboards and governance cadence.",
        "Convert lessons into a scale roadmap covering data, controls, people, automation and AI adoption.",
      ],
    },
  ];

  maturityRoadmap.replaceChildren();

  phases.forEach((phase) => {
    const article = document.createElement("article");
    article.className = "roadmap-phase-card";
    article.innerHTML = `
      <span>${phase.title}</span>
      <p>${escapeHtml(phase.body)}</p>
      <ul>${phase.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
    `;
    maturityRoadmap.append(article);
  });
}

function buildInsightsPayload(model) {
  return {
    organization: state.context.organization,
    industry: state.context.industry,
    ambition: state.context.ambition,
    horizon: state.context.horizon,
    readiness: model.readiness,
    targetIndex: model.targetIndex,
    maturityStage: model.level.name,
    maturityNarrative: model.level.narrative,
    topPriorities: model.prioritized.slice(0, 3).map((pillar) => ({
      label: pillar.label,
      current: pillar.current,
      target: pillar.target,
      gap: pillar.gap,
      description: pillar.description,
    })),
    pillarResults: model.pillarResults.map((pillar) => ({
      label: pillar.label,
      current: pillar.current,
      target: pillar.target,
      gap: pillar.gap,
      description: pillar.description,
    })),
    answers: maturityQuestions.map((question) => {
      const answer = state.answers[question.id];
      return {
        question: question.text,
        score: answer,
        answer: question.options[answer - 1],
      };
    }),
  };
}

function createClientFallbackInsights(model) {
  const organization = state.context.organization || "the organization";
  const industry = state.context.industry || "the selected industry";
  const priorities = model.prioritized.slice(0, 3).map((pillar) => pillar.label);
  const priorityText = priorities.join(", ");
  const gap = Math.max(model.targetIndex - model.readiness, 0);

  return {
    executiveInsight: `${organization} is currently at the ${model.level.name} stage with a readiness index of ${model.readiness}/100. The result shows a practical AI opportunity, but the strongest value will come from strengthening ${priorityText} before scaling too many pilots.`,
    maturityInterpretation: `The ${gap}-point gap to the target state should be read as an operating-model and execution-readiness gap. Excenor would validate where process standardization, data quality, governance, adoption, and benefit tracking are limiting AI scale in the ${industry} context.`,
    priorityMoves: [
      "Align leadership on the highest-value AI use cases, decision criteria, governance expectations and business outcomes.",
      `Validate the top gaps in ${priorityText} through Excenor's Discover and Diagnose approach before technology selection.`,
      "Select one controlled pilot with clear KPIs, accountable owners, human oversight and benefit tracking.",
    ],
    industryLens: [
      `In ${industry}, AI should be tied to measurable outcomes such as speed, quality, risk control, customer experience, productivity, or leadership visibility.`,
      "The best early opportunities are likely where repeated decisions, manual monitoring, fragmented data, exceptions, or rework are already visible.",
      "AI should be introduced only with the right data, cyber/privacy controls, process ownership and change adoption routines.",
    ],
    risksToValidate: [
      "Whether the data needed for priority use cases is complete, trusted, accessible and governed.",
      "Whether process ownership and approval rights are clear enough to sustain AI-enabled workflows.",
      "Whether teams have the capability, confidence and management cadence to adopt AI safely.",
    ],
    excenorNextStep:
      "The next practical step is an Excenor Discover and Diagnose sprint to convert this assessment into a validated AI maturity roadmap, use-case portfolio, governance model, pilot plan and capability-building pathway.",
    disclaimer:
      "These insights are AI-assisted and based on the questionnaire response. They should be validated by an Excenor expert before being used for client recommendations or implementation decisions.",
  };
}

function renderInsightList(title, items) {
  return `
    <article class="ai-insight-card">
      <span>${escapeHtml(title)}</span>
      <ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `;
}

function renderAiInsights(insights) {
  state.aiInsights = insights;
  aiInsightsContent.innerHTML = `
    <article class="ai-insight-card ai-insight-card-wide">
      <span>Executive Insight</span>
      <p>${escapeHtml(insights.executiveInsight)}</p>
    </article>
    <article class="ai-insight-card ai-insight-card-wide">
      <span>Maturity Interpretation</span>
      <p>${escapeHtml(insights.maturityInterpretation)}</p>
    </article>
    ${renderInsightList("Priority Moves", insights.priorityMoves || [])}
    ${renderInsightList("Industry Lens", insights.industryLens || [])}
    ${renderInsightList("Risks To Validate", insights.risksToValidate || [])}
    <article class="ai-insight-card ai-insight-card-wide ai-insight-next-step">
      <span>Recommended Excenor Next Step</span>
      <p>${escapeHtml(insights.excenorNextStep)}</p>
      <small>${escapeHtml(insights.disclaimer)}</small>
    </article>
  `;
}

async function loadAiInsights(model) {
  if (!aiInsightsStatus || !aiInsightsContent) {
    return;
  }

  aiInsightsStatus.hidden = false;
  aiInsightsStatus.textContent = "Generating AI insights...";
  aiInsightsContent.replaceChildren();
  refreshAiInsightsButton.disabled = true;

  try {
    const response = await fetch("/api/ai-maturity-insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildInsightsPayload(model)),
    });

    if (!response.ok) {
      throw new Error("Insights API request failed.");
    }

    const data = await response.json();
    renderAiInsights(data.insights || createClientFallbackInsights(model));
    aiInsightsStatus.textContent =
      data.mode === "live" ? "Live AI insights generated." : "Demo insights shown. Add GEMINI_API_KEY for live AI.";
  } catch (error) {
    renderAiInsights(createClientFallbackInsights(model));
    aiInsightsStatus.textContent = "AI service is not available in this preview. Showing built-in Excenor insights.";
  } finally {
    refreshAiInsightsButton.disabled = false;
  }
}

function renderReport() {
  const model = calculateModel();
  const organization = state.context.organization || "your organization";
  state.currentModel = model;
  state.aiInsights = null;
  readinessIndex.textContent = model.readiness;
  heroScore.textContent = model.readiness;
  maturityStage.textContent = model.level.name;
  reportTitle.textContent = `${organization} AI maturity report`;
  reportIntro.textContent = `Generated from ${maturityQuestions.length} guided questions across seven Excenor maturity pillars.`;
  maturityNarrative.textContent = `${model.level.narrative} Target index is ${model.targetIndex}/100, leaving a ${Math.max(
    model.targetIndex - model.readiness,
    0
  )}-point maturity gap.`;

  renderPillars(model.pillarResults);
  renderRadar(model.pillarResults);
  renderGapChart(model.pillarResults);
  renderHeatmap(model.pillarResults);
  renderRoadmap(model);
  loadAiInsights(model);
}

function showReport() {
  const firstUnanswered = maturityQuestions.findIndex((question) => !state.answers[question.id]);
  if (firstUnanswered >= 0) {
    state.currentQuestion = firstUnanswered;
    renderQuestion();
    return;
  }

  questionProgressFill.style.width = "100%";
  assessmentShell.hidden = true;
  reportArea.hidden = false;
  renderReport();
  reportArea.scrollIntoView({ behavior: "smooth", block: "start" });
}

function startQuestions() {
  state.context = {
    organization: organizationInput.value.trim(),
    industry: industryInput.value.trim(),
    ambition: ambitionInput.value,
    horizon: horizonInput.value,
  };
  state.currentQuestion = 0;
  state.answers = {};
  contextForm.hidden = true;
  questionCard.hidden = false;
  reportArea.hidden = true;
  heroScore.textContent = "--";
  renderQuestion();
}

function resetModel() {
  state.currentQuestion = 0;
  state.answers = {};
  state.currentModel = null;
  state.aiInsights = null;
  state.context = {
    organization: "",
    industry: "",
    ambition: "",
    horizon: "",
  };
  contextForm.reset();
  contextForm.hidden = false;
  assessmentShell.hidden = false;
  questionCard.hidden = true;
  reportArea.hidden = true;
  copyStatus.hidden = true;
  aiInsightsStatus.textContent = "Generating AI insights...";
  aiInsightsContent.replaceChildren();
  heroScore.textContent = "--";
  organizationInput.focus();
}

function buildReportText() {
  const model = calculateModel();
  const context = [
    `Organization: ${state.context.organization || "Not provided"}`,
    `Industry: ${state.context.industry || "Not provided"}`,
    `AI Ambition: ${state.context.ambition}`,
    `Roadmap Horizon: ${state.context.horizon}`,
    `Readiness Index: ${model.readiness}/100`,
    `Target Index: ${model.targetIndex}/100`,
    `Maturity Stage: ${model.level.name}`,
    `Narrative: ${model.level.narrative}`,
  ];

  const pillars = model.pillarResults.map((pillar) => {
    return `${pillar.label}: current ${pillar.current}/5, target ${pillar.target}/5, gap ${pillar.gap.toFixed(
      1
    )}. ${pillar.description}`;
  });

  const priorities = model.prioritized.slice(0, 3).flatMap((pillar) => [
    `${pillar.label} priority actions:`,
    ...pillar.actions.map((action) => `- ${action}`),
  ]);

  const answers = maturityQuestions.map((question) => {
    const answer = state.answers[question.id];
    return `${question.text}\nAnswer: ${answer}/5 - ${question.options[answer - 1]}`;
  });

  const insights = state.aiInsights
    ? [
        `Executive Insight: ${state.aiInsights.executiveInsight}`,
        `Maturity Interpretation: ${state.aiInsights.maturityInterpretation}`,
        "Priority Moves:",
        ...(state.aiInsights.priorityMoves || []).map((item) => `- ${item}`),
        "Industry Lens:",
        ...(state.aiInsights.industryLens || []).map((item) => `- ${item}`),
        "Risks To Validate:",
        ...(state.aiInsights.risksToValidate || []).map((item) => `- ${item}`),
        `Recommended Excenor Next Step: ${state.aiInsights.excenorNextStep}`,
      ]
    : ["AI Insights: Not generated yet."];

  return [
    "Excenor AI Maturity Model Report",
    context.join("\n"),
    "Questionnaire Responses",
    answers.join("\n\n"),
    "Capability Scores",
    pillars.join("\n"),
    "AI Insights",
    insights.join("\n"),
    "Priority Roadmap",
    priorities.join("\n"),
    "This is an AI-assisted POC diagnostic and should be validated through an Excenor discovery conversation.",
  ].join("\n\n");
}

async function copyReport() {
  const text = buildReportText();
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  }

  copyStatus.hidden = false;
  setTimeout(() => {
    copyStatus.hidden = true;
  }, 1800);
}

contextForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startQuestions();
});

previousButton.addEventListener("click", showPreviousQuestion);
restartQuestionsButton.addEventListener("click", resetModel);
refreshAiInsightsButton.addEventListener("click", () => {
  if (state.currentModel) {
    loadAiInsights(state.currentModel);
  }
});
copyButton.addEventListener("click", copyReport);
resetButton.addEventListener("click", resetModel);
