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
  },
  {
    id: "strategy_roadmap",
    dimension: "strategy",
    text: "Is there an AI roadmap linked to revenue, efficiency, customer experience, or risk reduction?",
  },
  {
    id: "data_access",
    dimension: "data",
    text: "How accessible and reliable is your business data for analytics or AI?",
  },
  {
    id: "data_governance",
    dimension: "data",
    text: "Do you have data governance practices such as ownership, quality checks, privacy, and security?",
  },
  {
    id: "usecase_identification",
    dimension: "useCases",
    text: "Have you identified business processes where AI can create measurable value?",
  },
  {
    id: "usecase_deployment",
    dimension: "useCases",
    text: "Are any AI use cases already piloted or deployed in your organization?",
  },
  {
    id: "tech_readiness",
    dimension: "technology",
    text: "Do your current systems support automation, analytics, or AI integration?",
  },
  {
    id: "tech_adoption",
    dimension: "technology",
    text: "Are teams using AI-enabled tools in daily workflows?",
  },
  {
    id: "people_confidence",
    dimension: "people",
    text: "How confident are your employees in using AI tools responsibly and effectively?",
  },
  {
    id: "people_training",
    dimension: "people",
    text: "Do you provide structured training on AI, data analytics, automation, or digital transformation?",
  },
  {
    id: "governance_policy",
    dimension: "governance",
    text: "Do you have policies for responsible AI usage, data privacy, and cybersecurity?",
  },
  {
    id: "governance_measurement",
    dimension: "governance",
    text: "Do you measure risks, outcomes, and adoption after AI initiatives are launched?",
  },
];

const scale = [
  { value: 1, label: "Not started" },
  { value: 2, label: "Exploring" },
  { value: 3, label: "Basic initiatives" },
  { value: 4, label: "Structured and active" },
  { value: 5, label: "Advanced and measurable" },
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

const state = {
  user: null,
  currentQuestion: 0,
  answers: {},
};

const chatWindow = document.querySelector("#chatWindow");
const detailsForm = document.querySelector("#detailsForm");
const answerPanel = document.querySelector("#answerPanel");
const scaleOptions = document.querySelector("#scaleOptions");
const resultPanel = document.querySelector("#resultPanel");
const progressFill = document.querySelector("#progressFill");
const restartButton = document.querySelector("#restartButton");

function addMessage(text, sender = "assistant") {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;
  chatWindow.append(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
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
    };
  });

  const totalScore = Object.values(dimensionScores).reduce((total, dimension) => {
    return total + dimension.weightedScore;
  }, 0);

  return { totalScore, dimensionScores };
}

function updateProgress() {
  const { totalScore, dimensionScores } = calculateScores();
  const completed = Object.keys(state.answers).length;
  const progress = Math.round((completed / questions.length) * 100);
  const level = getMaturityLevel(totalScore);

  document.querySelector("#liveScore").textContent = totalScore;
  document.querySelector("#liveLevel").textContent =
    completed === questions.length ? level.name : `${completed} of ${questions.length} questions complete`;
  progressFill.style.width = `${progress}%`;

  Object.entries(dimensionScores).forEach(([key, dimension]) => {
    document.querySelector(`#meter-${key}`).value = dimension.weightedScore;
  });
}

function renderScaleOptions() {
  scaleOptions.replaceChildren();

  scale.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<strong>${option.value}</strong><span>${option.label}</span>`;
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
  addMessage(`${option.value} - ${option.label}`, "user");

  state.currentQuestion += 1;
  updateProgress();

  if (state.currentQuestion < questions.length) {
    setTimeout(askCurrentQuestion, 220);
    return;
  }

  setTimeout(showResult, 260);
}

function listItems(target, items) {
  target.replaceChildren();
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.append(li);
  });
}

function showResult() {
  const { totalScore, dimensionScores } = calculateScores();
  const level = getMaturityLevel(totalScore);
  const ranked = Object.values(dimensionScores).sort((a, b) => b.rawAverage - a.rawAverage);
  const strongest = ranked.slice(0, 2);
  const weakest = ranked.slice(-2).reverse();

  addMessage(
    `${state.user.name}, your AI Maturity Score is ${totalScore}/100. You are currently at the ${level.name} stage.`
  );

  document.querySelector("#resultLevel").textContent = level.name;
  document.querySelector("#resultScore").textContent = `${totalScore}/100`;
  document.querySelector("#resultNarrative").textContent = `${state.user.organization} appears to be at the ${level.name} stage. ${level.narrative}`;

  listItems(
    document.querySelector("#strengthList"),
    strongest.map((dimension) => `${dimension.shortLabel}: ${dimension.help}`)
  );

  listItems(
    document.querySelector("#gapList"),
    weakest.map((dimension) => `${dimension.shortLabel}: focus here to improve the next maturity stage. ${dimension.help}`)
  );

  listItems(document.querySelector("#excenorList"), [
    "Run an AI readiness and opportunity discovery workshop with leadership and process owners.",
    "Prioritize AI use cases by business value, feasibility, risk, and measurable outcomes.",
    "Build role-based training for AI literacy, data analytics, automation, governance, and adoption.",
    "Design a practical roadmap covering data, process, technology, people capability, and responsible AI controls.",
  ]);

  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetAssessment() {
  state.user = null;
  state.currentQuestion = 0;
  state.answers = {};
  chatWindow.replaceChildren();
  detailsForm.reset();
  detailsForm.hidden = false;
  answerPanel.hidden = true;
  resultPanel.hidden = true;
  updateProgress();
  addMessage(
    "Welcome. I will assess your organization across strategy, data, use cases, technology, people capability, and governance. Share your details to begin."
  );
}

detailsForm.addEventListener("submit", (event) => {
  event.preventDefault();
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
    `Thanks, ${state.user.name}. I will now score ${state.user.organization} in the ${state.user.industry} industry.`
  );
  askCurrentQuestion();
});

document.querySelector("#proposalButton").addEventListener("click", () => {
  addMessage(
    "Proposal request noted. In the next POC version, this action can send the assessment summary to Excenor Global and trigger a consultant follow-up."
  );
});

restartButton.addEventListener("click", resetAssessment);

resetAssessment();
