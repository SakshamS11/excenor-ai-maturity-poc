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
const copyButton = document.querySelector("#copyMaturityReportButton");
const resetButton = document.querySelector("#resetMaturityModelButton");
const copyStatus = document.querySelector("#maturityCopyStatus");

const state = {
  pillars: Object.fromEntries(
    maturityPillars.map((pillar) => [
      pillar.id,
      {
        current: 2,
        target: 4,
      },
    ])
  ),
};

function getLevel(score) {
  return maturityLevels.find((level) => score >= level.min && score <= level.max) || maturityLevels[0];
}

function calculateModel() {
  const pillarResults = maturityPillars.map((pillar) => {
    const values = state.pillars[pillar.id];
    const currentScore = (values.current / 5) * pillar.weight;
    const targetScore = (values.target / 5) * pillar.weight;
    const gap = Math.max(values.target - values.current, 0);
    return {
      ...pillar,
      current: values.current,
      target: values.target,
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

function renderPillars() {
  pillarList.replaceChildren();

  maturityPillars.forEach((pillar) => {
    const values = state.pillars[pillar.id];
    const card = document.createElement("article");
    card.className = "maturity-pillar-card";
    card.innerHTML = `
      <div class="maturity-pillar-heading">
        <div>
          <strong>${pillar.label}</strong>
          <p>${pillar.description}</p>
        </div>
        <span>${pillar.weight}%</span>
      </div>
      <div class="maturity-slider-row">
        <label>
          <span>Current</span>
          <input type="range" min="1" max="5" value="${values.current}" data-pillar="${pillar.id}" data-kind="current" />
          <small>${values.current}/5</small>
        </label>
        <label>
          <span>Target</span>
          <input type="range" min="1" max="5" value="${values.target}" data-pillar="${pillar.id}" data-kind="target" />
          <small>${values.target}/5</small>
        </label>
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
        <small>${pillar.gap} level gap</small>
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

function renderRoadmap(model) {
  const top = model.prioritized.slice(0, 3);
  const organization = organizationInput.value.trim() || "the organization";
  const industry = industryInput.value.trim() || "the selected industry";
  const horizon = horizonInput.value;
  const ambition = ambitionInput.value;

  const phases = [
    {
      title: "0-30 Days",
      body: `Run an Excenor Discover and Diagnose sprint for ${organization}, focused on ${top
        .map((pillar) => pillar.label)
        .join(", ")} in the ${industry} context.`,
      points: [
        "Confirm business outcomes, target workflows, data availability and stakeholder ownership.",
        "Baseline current capability and identify assumption-based risks before technology selection.",
      ],
    },
    {
      title: "31-60 Days",
      body: `Design the operating model and use-case portfolio needed to ${ambition.toLowerCase()}.`,
      points: top.flatMap((pillar) => pillar.actions.slice(0, 1)),
    },
    {
      title: "61-90 Days",
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
      <p>${phase.body}</p>
      <ul>${phase.points.map((point) => `<li>${point}</li>`).join("")}</ul>
    `;
    maturityRoadmap.append(article);
  });
}

function updateModel() {
  const model = calculateModel();
  readinessIndex.textContent = model.readiness;
  heroScore.textContent = model.readiness;
  maturityStage.textContent = model.level.name;
  maturityNarrative.textContent = `${model.level.narrative} Target index is ${model.targetIndex}/100, leaving a ${Math.max(
    model.targetIndex - model.readiness,
    0
  )}-point maturity gap.`;

  renderRadar(model.pillarResults);
  renderGapChart(model.pillarResults);
  renderHeatmap(model.pillarResults);
  renderRoadmap(model);
}

function resetModel() {
  maturityPillars.forEach((pillar) => {
    state.pillars[pillar.id] = { current: 2, target: 4 };
  });
  organizationInput.value = "";
  industryInput.value = "";
  ambitionInput.value = "Improve productivity and service visibility";
  horizonInput.value = "90 days";
  renderPillars();
  updateModel();
}

function buildReportText() {
  const model = calculateModel();
  const context = [
    `Organization: ${organizationInput.value.trim() || "Not provided"}`,
    `Industry: ${industryInput.value.trim() || "Not provided"}`,
    `AI Ambition: ${ambitionInput.value}`,
    `Roadmap Horizon: ${horizonInput.value}`,
    `Readiness Index: ${model.readiness}/100`,
    `Target Index: ${model.targetIndex}/100`,
    `Maturity Stage: ${model.level.name}`,
    `Narrative: ${model.level.narrative}`,
  ];

  const pillars = model.pillarResults.map((pillar) => {
    return `${pillar.label}: current ${pillar.current}/5, target ${pillar.target}/5, gap ${pillar.gap}. ${pillar.description}`;
  });

  const priorities = model.prioritized.slice(0, 3).flatMap((pillar) => [
    `${pillar.label} priority actions:`,
    ...pillar.actions.map((action) => `- ${action}`),
  ]);

  return [
    "Excenor AI Maturity Model Report",
    context.join("\n"),
    "Capability Scores",
    pillars.join("\n"),
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

pillarList.addEventListener("input", (event) => {
  if (!event.target.matches("input[type='range']")) {
    return;
  }

  const pillar = event.target.dataset.pillar;
  const kind = event.target.dataset.kind;
  state.pillars[pillar][kind] = Number(event.target.value);
  renderPillars();
  updateModel();
});

[organizationInput, industryInput, ambitionInput, horizonInput].forEach((field) => {
  field.addEventListener("input", updateModel);
  field.addEventListener("change", updateModel);
});

copyButton.addEventListener("click", copyReport);
resetButton.addEventListener("click", resetModel);

renderPillars();
updateModel();
