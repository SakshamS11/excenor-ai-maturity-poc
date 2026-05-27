const dimensions = {
  strategy: {
    label: "Strategy & Leadership",
    shortLabel: "Strategy",
    weight: 15,
    help: "AI strategy roadmap, leadership alignment, and measurable transformation goals.",
  },
  data: {
    label: "Data Readiness",
    shortLabel: "Data",
    weight: 20,
    help: "Data quality, access, governance, privacy, and analytics usability.",
  },
  useCases: {
    label: "Process & Use Case Maturity",
    shortLabel: "Use Cases",
    weight: 20,
    help: "Process discovery, value prioritization, pilots, and deployed AI initiatives.",
  },
  technology: {
    label: "Technology & Integration",
    shortLabel: "Technology",
    weight: 15,
    help: "Platforms, workflow tools, automation readiness, APIs, and system integration.",
  },
  people: {
    label: "People & Capability",
    shortLabel: "Capability",
    weight: 20,
    help: "AI literacy, role-based training, adoption confidence, and change readiness.",
  },
  governance: {
    label: "Governance, Risk & Compliance",
    shortLabel: "Governance",
    weight: 10,
    help: "Responsible AI policies, cybersecurity, approvals, monitoring, and risk controls.",
  },
};

const questions = [
  {
    id: "strategy_goals",
    dimension: "strategy",
    text: "Has your leadership team defined clear business goals for AI adoption?",
    options: [
      "AI goals have not been discussed by leadership",
      "AI is being discussed informally without clear goals",
      "Some AI goals are identified but not documented",
      "AI goals are documented and linked to business priorities",
      "AI goals are measurable, funded, and reviewed by leadership",
    ],
  },
  {
    id: "strategy_roadmap",
    dimension: "strategy",
    text: "Is there an AI roadmap linked to revenue, efficiency, customer experience, or risk reduction?",
    options: [
      "There is no AI roadmap",
      "A roadmap is being explored but not defined",
      "A basic roadmap exists for a few initiatives",
      "The roadmap is structured and linked to business outcomes",
      "The roadmap is funded, measured, and actively governed",
    ],
  },
  {
    id: "data_access",
    dimension: "data",
    text: "How accessible and reliable is your business data for analytics or AI?",
    options: [
      "Data is fragmented, unreliable, or difficult to access",
      "Some useful data exists but access is inconsistent",
      "Key datasets are available with quality issues",
      "Most critical data is reliable and accessible to teams",
      "Data is trusted, connected, and ready for advanced AI use",
    ],
  },
  {
    id: "data_governance",
    dimension: "data",
    text: "Do you have data governance practices such as ownership, quality checks, privacy, and security?",
    options: [
      "No formal data governance practices exist",
      "Governance is handled case by case",
      "Some ownership and quality checks are in place",
      "Governance roles, privacy, and quality controls are defined",
      "Governance is mature, monitored, and embedded across teams",
    ],
  },
  {
    id: "usecase_identification",
    dimension: "useCases",
    text: "Have you identified business processes where AI can create measurable value?",
    options: [
      "No AI use cases have been identified",
      "Teams have informal ideas but no evaluation method",
      "A few potential use cases have been listed",
      "Use cases are prioritized by value, feasibility, and risk",
      "Use-case discovery is continuous and tied to measurable value",
    ],
  },
  {
    id: "usecase_deployment",
    dimension: "useCases",
    text: "Are any AI use cases already piloted or deployed in your organization?",
    options: [
      "No pilots or deployments have started",
      "Experiments are being discussed or planned",
      "One or two pilots are running in limited areas",
      "Several use cases are deployed with business ownership",
      "AI use cases are scaled, monitored, and delivering measurable impact",
    ],
  },
  {
    id: "tech_readiness",
    dimension: "technology",
    text: "Do your current systems support automation, analytics, or AI integration?",
    options: [
      "Systems are mostly manual or disconnected",
      "Some systems support reporting but limited automation",
      "Basic tools and integrations exist for selected teams",
      "Core systems support automation, analytics, and integration",
      "Technology stack is modern, API-ready, and scalable for AI",
    ],
  },
  {
    id: "tech_adoption",
    dimension: "technology",
    text: "Are teams using AI-enabled tools in daily workflows?",
    options: [
      "Teams are not using AI-enabled tools",
      "A few individuals are experimenting independently",
      "Some teams use AI tools for basic productivity",
      "AI tools are used in defined workflows across teams",
      "AI tools are embedded, governed, and measured in daily operations",
    ],
  },
  {
    id: "people_confidence",
    dimension: "people",
    text: "How confident are your employees in using AI tools responsibly and effectively?",
    options: [
      "Employees have very limited AI awareness",
      "Employees are curious but unsure how to use AI safely",
      "Some employees can use AI for simple tasks",
      "Many employees use AI confidently within clear guidelines",
      "Employees are skilled, responsible, and proactive AI users",
    ],
  },
  {
    id: "people_training",
    dimension: "people",
    text: "Do you provide structured training on AI, data analytics, automation, or digital transformation?",
    options: [
      "No structured training is provided",
      "Training is informal or occasional",
      "Some general training is available to selected groups",
      "Role-based training is planned and delivered regularly",
      "Training is continuous, measured, and tied to adoption outcomes",
    ],
  },
  {
    id: "governance_policy",
    dimension: "governance",
    text: "Do you have policies for responsible AI usage, data privacy, and cybersecurity?",
    options: [
      "No AI usage or risk policies exist",
      "Basic privacy or cybersecurity policies exist but do not cover AI",
      "Early AI guidelines exist for selected users or teams",
      "Responsible AI, privacy, and cybersecurity policies are defined",
      "Policies are mature, enforced, monitored, and regularly updated",
    ],
  },
  {
    id: "governance_measurement",
    dimension: "governance",
    text: "Do you measure risks, outcomes, and adoption after AI initiatives are launched?",
    options: [
      "AI outcomes or risks are not measured",
      "Measurement is informal and inconsistent",
      "Basic success metrics are tracked for some initiatives",
      "Business outcomes, adoption, and risks are regularly reviewed",
      "Measurement is automated, transparent, and used for continuous improvement",
    ],
  },
];

const scale = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
];

const maturityLevels = [
  {
    min: 0,
    max: 25,
    name: "AI Aware",
    narrative:
      "Your organization is interested in AI, but readiness is still forming. The strongest next move is to clarify business priorities, build awareness, and identify high-value opportunities before investing heavily.",
  },
  {
    min: 26,
    max: 45,
    name: "AI Explorer",
    narrative:
      "Your organization has started exploring AI, but efforts may be fragmented. A structured roadmap, cleaner data foundations, and targeted capability building can help convert experimentation into measurable outcomes.",
  },
  {
    min: 46,
    max: 65,
    name: "AI Adopter",
    narrative:
      "Your organization has meaningful AI activity underway. The priority now is to scale the right use cases, strengthen governance, and help teams adopt AI consistently across business workflows.",
  },
  {
    min: 66,
    max: 80,
    name: "AI Scaler",
    narrative:
      "Your organization is moving from isolated AI wins to structured enterprise adoption. Continued focus on measurement, operating model, responsible AI, and workforce enablement will help scale impact.",
  },
  {
    min: 81,
    max: 100,
    name: "AI Leader",
    narrative:
      "Your organization is well positioned to embed AI into strategy, operations, workforce capability, and governance. The next opportunity is to institutionalize continuous innovation and measurable value creation.",
  },
];

function createLeadId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const state = {
  leadId: createLeadId(),
  user: null,
  currentQuestion: 0,
  answers: {},
  transcript: [],
  result: null,
};

const chatWindow = document.querySelector("#chatWindow");
const detailsForm = document.querySelector("#detailsForm");
const answerPanel = document.querySelector("#answerPanel");
const scaleOptions = document.querySelector("#scaleOptions");
const resultPanel = document.querySelector("#resultPanel");
const advisorPanel = document.querySelector("#advisorPanel");
const advisorForm = document.querySelector("#advisorForm");
const advisorInput = document.querySelector("#advisorInput");
const advisorThread = document.querySelector("#advisorThread");
const progressFill = document.querySelector("#progressFill");
const restartButton = document.querySelector("#restartButton");
const saveStatus = document.querySelector("#saveStatus");
const workspace = document.querySelector(".workspace");

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAssistantText(text) {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

function appendAdvisorThreadMessage(text, sender, options = {}) {
  advisorThread.hidden = false;
  const message = document.createElement("div");
  message.className = `advisor-thread-message ${sender}${options.thinking ? " thinking" : ""}`;

  if (sender === "assistant") {
    message.innerHTML = formatAssistantText(text);
  } else {
    message.textContent = text;
  }

  advisorThread.append(message);
  advisorThread.scrollTop = advisorThread.scrollHeight;
  return message;
}

function addMessage(text, sender = "assistant", options = {}) {
  const message = document.createElement("div");
  message.className = `message ${sender}${options.thinking ? " thinking" : ""}`;

  if (sender === "assistant") {
    message.innerHTML = formatAssistantText(text);
  } else {
    message.textContent = text;
  }

  chatWindow.append(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  if (!options.transient) {
    state.transcript.push({
      sender,
      text,
      timestamp: new Date().toISOString(),
    });
  }

  return message;
}

function getMaturityLevel(score) {
  return maturityLevels.find((level) => score >= level.min && score <= level.max) || maturityLevels[0];
}

function calculateScores() {
  const dimensionScores = {};

  Object.entries(dimensions).forEach(([key, dimension]) => {
    const matchingQuestions = questions.filter((question) => question.dimension === key);
    const answerTotal = matchingQuestions.reduce((total, question) => {
      return total + (state.answers[question.id] || 0);
    }, 0);
    const average = matchingQuestions.length ? answerTotal / matchingQuestions.length : 0;
    dimensionScores[key] = {
      ...dimension,
      rawAverage: average,
      weightedScore: Math.round((average / 5) * dimension.weight),
      answered: matchingQuestions.filter((question) => state.answers[question.id]).length,
      totalQuestions: matchingQuestions.length,
    };
  });

  const totalScore = Object.values(dimensionScores).reduce((total, dimension) => {
    return total + dimension.weightedScore;
  }, 0);

  return { totalScore, dimensionScores };
}

function updateProgress() {
  const { dimensionScores } = calculateScores();
  const completed = Object.keys(state.answers).length;
  const progress = Math.round((completed / questions.length) * 100);

  document.querySelector("#answeredCount").textContent = completed;
  document.querySelector("#liveLevel").textContent =
    completed === questions.length
      ? "Assessment complete. Revealing your maturity score now."
      : "Building a readiness view across six AI maturity dimensions.";
  progressFill.style.width = `${progress}%`;

  Object.entries(dimensionScores).forEach(([key, dimension]) => {
    const status = document.querySelector(`#status-${key}`);
    if (!status) {
      return;
    }
    status.textContent =
      dimension.answered === 0
        ? "Pending"
        : dimension.answered === dimension.totalQuestions
          ? "Complete"
          : `${dimension.answered}/${dimension.totalQuestions}`;

    const row = status.closest(".dimension-row");
    row?.classList.toggle("is-active", dimension.answered > 0 && dimension.answered < dimension.totalQuestions);
    row?.classList.toggle("is-complete", dimension.answered === dimension.totalQuestions);
  });
}

function renderScaleOptions() {
  scaleOptions.replaceChildren();
  const question = questions[state.currentQuestion];

  scale.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.style.setProperty("--option-delay", `${option.value * 42}ms`);
    button.innerHTML = `<strong>${option.value}</strong><span>${question.options[option.value - 1]}</span>`;
    button.addEventListener("click", () => answerQuestion(option));
    scaleOptions.append(button);
  });
}

function askCurrentQuestion() {
  const question = questions[state.currentQuestion];
  if (!question) {
    return;
  }

  const dimension = dimensions[question.dimension];

  addMessage(`${dimension.label}: ${question.text}`);
  answerPanel.hidden = false;
  renderScaleOptions();
}

function answerQuestion(option) {
  const question = questions[state.currentQuestion];
  if (!question || answerPanel.hidden) {
    return;
  }

  answerPanel.hidden = true;
  state.answers[question.id] = option.value;
  addMessage(`${option.value} - ${question.options[option.value - 1]}`, "user");

  state.currentQuestion += 1;
  updateProgress();

  if (state.currentQuestion < questions.length) {
    setTimeout(askCurrentQuestion, 240);
    return;
  }

  setTimeout(showResult, 420);
}

function listItems(target, items) {
  target.replaceChildren();
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.append(li);
  });
}

function getRankedDimensions(dimensionScores) {
  return Object.values(dimensionScores).sort((a, b) => b.rawAverage - a.rawAverage);
}

function renderDimensionBreakdown(dimensionScores) {
  const target = document.querySelector("#finalDimensionList");
  target.replaceChildren();

  Object.values(dimensionScores).forEach((dimension) => {
    const row = document.createElement("div");
    row.className = "final-dimension";
    const percentage = Math.round((dimension.weightedScore / dimension.weight) * 100);
    row.innerHTML = `
      <strong>${dimension.shortLabel}</strong>
      <div class="score-bar" aria-hidden="true"><span style="--score-width: ${percentage}%"></span></div>
      <span>${dimension.weightedScore}/${dimension.weight}</span>
    `;
    target.append(row);
  });
}

function animateScore(score) {
  const target = document.querySelector("#resultScore");
  const duration = 1000;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    target.textContent = `${Math.round(score * eased)}/100`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function buildResultPayload(totalScore, dimensionScores) {
  const level = getMaturityLevel(totalScore);
  const ranked = getRankedDimensions(dimensionScores);
  const strongest = ranked.slice(0, 2);
  const weakest = ranked.slice(-2).reverse();

  return {
    totalScore,
    dimensionScores,
    level,
    strongest,
    weakest,
    strengths: strongest.map((dimension) => `${dimension.shortLabel}: ${dimension.help}`),
    gaps: weakest.map((dimension) => `${dimension.shortLabel}: ${dimension.help}`),
    summary: `${state.user.organization} scored ${totalScore}/100 and is at the ${level.name} stage. Strengths: ${strongest
      .map((dimension) => dimension.shortLabel)
      .join(", ")}. Priority gaps: ${weakest.map((dimension) => dimension.shortLabel).join(", ")}.`,
  };
}

function showResult() {
  const { totalScore, dimensionScores } = calculateScores();
  const result = buildResultPayload(totalScore, dimensionScores);
  state.result = result;

  addMessage(
    `${state.user.name}, your assessment is complete. I am revealing your AI Maturity Score and recommended next steps.`
  );

  document.querySelector("#resultLevel").textContent = result.level.name;
  document.querySelector("#resultScore").textContent = "0/100";
  document.querySelector("#resultNarrative").textContent = `${state.user.organization} appears to be at the ${result.level.name} stage. ${result.level.narrative}`;

  renderDimensionBreakdown(dimensionScores);
  listItems(document.querySelector("#strengthList"), result.strengths);
  listItems(
    document.querySelector("#gapList"),
    result.weakest.map((dimension) => `${dimension.shortLabel}: focus here to improve the next maturity stage. ${dimension.help}`)
  );
  listItems(document.querySelector("#excenorList"), [
    "Run an AI readiness and opportunity discovery workshop with leadership and process owners.",
    "Prioritize AI use cases by business value, feasibility, risk, and measurable outcomes.",
    "Build role-based training for AI literacy, data analytics, automation, governance, and adoption.",
    "Design a practical roadmap covering data, process, technology, people capability, and responsible AI controls.",
  ]);

  resultPanel.hidden = false;
  advisorPanel.hidden = false;
  advisorPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  animateScore(totalScore);
  persistLeadSnapshot("assessment-complete");
}

function buildLeadSnapshot(trigger) {
  if (!state.user || !state.result) {
    return null;
  }

  return {
    id: state.leadId,
    trigger,
    capturedAt: new Date().toISOString(),
    lead: state.user,
    score: state.result.totalScore,
    level: state.result.level.name,
    strengths: state.result.strongest.map((dimension) => dimension.shortLabel),
    gaps: state.result.weakest.map((dimension) => dimension.shortLabel),
    summary: state.result.summary,
    answers: state.answers,
    transcript: state.transcript,
  };
}

async function persistLeadSnapshot(trigger) {
  const snapshot = buildLeadSnapshot(trigger);
  if (!snapshot) {
    return;
  }

  const storedLeads = JSON.parse(localStorage.getItem("excenorLeadSnapshots") || "[]");
  const updatedLeads = storedLeads.filter((lead) => lead.id !== snapshot.id);
  updatedLeads.push(snapshot);
  localStorage.setItem("excenorLeadSnapshots", JSON.stringify(updatedLeads));
  saveStatus.textContent = "Lead, transcript, score, and internal summary saved in browser storage.";

  if (!location.protocol.startsWith("http")) {
    return;
  }

  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snapshot),
    });
    const data = await response.json();
    saveStatus.textContent = data.saved
      ? "Lead, transcript, score, and summary saved."
      : "Lead saved in browser storage. Configure LEADS_WEBHOOK_URL for server-side capture.";
  } catch (error) {
    saveStatus.textContent = "Lead saved in browser storage. Server-side lead capture is not available yet.";
  }
}

function createClientDemoReply(message) {
  const lead = buildLeadSnapshot("client-demo");
  const level = lead?.level || "your current maturity stage";
  const gapText = lead?.gaps?.slice(0, 2).join(" and ") || "your readiness gaps";
  const industry = lead?.lead?.industry || "your industry";

  if (message.toLowerCase().includes("proposal")) {
    return `For a ${industry} organization at ${level}, the proposal should focus on an AI readiness workshop, use-case prioritization, governance, and capability building. Excenor can use your assessment summary to shape a practical consulting roadmap tied to your operating reality.`;
  }

  return `For a ${industry} organization at ${level}, the most useful next step is to address ${gapText}, then choose a few high-value use cases for a structured roadmap. This is demo guidance until GEMINI_API_KEY is configured in Vercel.`;
}

async function askAdvisor(message) {
  appendAdvisorThreadMessage(message, "user");
  const advisorThinkingMessage = appendAdvisorThreadMessage("Thinking through your maturity result...", "assistant", {
    thinking: true,
  });

  let reply = createClientDemoReply(message);

  if (location.protocol.startsWith("http")) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          lead: buildLeadSnapshot("ai-question"),
          transcript: state.transcript,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        reply = data.reply || reply;
      }
    } catch (error) {
      reply = createClientDemoReply(message);
    }
  }

  advisorThinkingMessage.remove();
  appendAdvisorThreadMessage(reply, "assistant");
  persistLeadSnapshot("ai-response");
}

function resetAssessment() {
  workspace.classList.add("is-opening");
  state.leadId = createLeadId();
  state.user = null;
  state.currentQuestion = 0;
  state.answers = {};
  state.transcript = [];
  state.result = null;
  chatWindow.replaceChildren();
  detailsForm.reset();
  advisorForm.reset();
  detailsForm.hidden = false;
  answerPanel.hidden = true;
  resultPanel.hidden = true;
  advisorPanel.hidden = true;
  advisorThread.hidden = true;
  advisorThread.replaceChildren();
  saveStatus.textContent = "Lead record will be saved after the assessment result.";
  updateProgress();
  addMessage(
    "Welcome to the Excenor AI Maturity Assessment. This guided diagnostic will map your organization across strategy, data readiness, use-case maturity, technology, people capability, and governance to identify where AI can create measurable business value."
  );
}

detailsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  workspace.classList.remove("is-opening");
  const formData = new FormData(detailsForm);

  state.user = {
    name: formData.get("name").trim(),
    organization: formData.get("organization").trim(),
    industry: formData.get("industry").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim(),
  };

  detailsForm.hidden = true;
  addMessage(
    `Thanks, ${state.user.name}. I will now assess ${state.user.organization} in the ${state.user.industry} industry and build a practical AI maturity profile based on your responses.`
  );
  askCurrentQuestion();
});

advisorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = advisorInput.value.trim();
  if (!message) {
    return;
  }

  advisorInput.value = "";
  askAdvisor(message);
});

document.querySelector("#proposalButton").addEventListener("click", () => {
  addMessage(
    "Proposal request noted. Excenor Global can use this assessment transcript, score, and summary to prepare a more focused discovery conversation."
  );
  persistLeadSnapshot("proposal-request");
});

restartButton.addEventListener("click", resetAssessment);

resetAssessment();
