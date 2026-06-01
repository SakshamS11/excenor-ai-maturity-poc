const form = document.querySelector("#dmaicForm");
const generateButton = document.querySelector("#generateButton");
const resetButton = document.querySelector("#resetButton");
const copyButton = document.querySelector("#copyButton");
const reportShell = document.querySelector("#reportShell");
const reportContent = document.querySelector("#reportContent");
const loadingState = document.querySelector("#loadingState");
const errorState = document.querySelector("#errorState");
const copyStatus = document.querySelector("#copyStatus");

let latestReport = null;

function getFormPayload() {
  const formData = new FormData(form);
  return {
    companyName: formData.get("companyName").trim(),
    industry: formData.get("industry").trim(),
    processName: formData.get("processName").trim(),
    problemStatement: formData.get("problemStatement").trim(),
    painPoints: formData.get("painPoints").trim(),
    availableData: formData.get("availableData").trim(),
    desiredOutcome: formData.get("desiredOutcome").trim(),
  };
}

function setLoading(isLoading) {
  generateButton.disabled = isLoading;
  generateButton.textContent = isLoading ? "Generating..." : "Generate DMAIC Report";
  loadingState.hidden = !isLoading;
}

function showError(message) {
  errorState.textContent = message;
  errorState.hidden = false;
}

function clearReportState() {
  latestReport = null;
  reportContent.replaceChildren();
  errorState.hidden = true;
  copyStatus.hidden = true;
}

function createList(items) {
  const list = document.createElement("ul");
  (Array.isArray(items) ? items : []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.append(li);
  });
  return list;
}

function createDetailGroup(title, content) {
  const group = document.createElement("div");
  group.className = "report-detail";
  const heading = document.createElement("h4");
  heading.textContent = title;
  group.append(heading);

  if (Array.isArray(content)) {
    group.append(createList(content));
  } else {
    const paragraph = document.createElement("p");
    paragraph.textContent = content || "Not specified.";
    group.append(paragraph);
  }

  return group;
}

function createSection(title, children) {
  const section = document.createElement("article");
  section.className = "report-section";
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.append(heading, ...children);
  return section;
}

function renderReport(report) {
  reportContent.replaceChildren();

  const executive = createSection("1. Executive Summary", [
    createDetailGroup("Summary", report.executiveSummary),
    createDetailGroup("Important note", report.disclaimer),
  ]);

  const define = createSection("2. Define", [
    createDetailGroup("Refined problem statement", report.define?.refinedProblemStatement),
    createDetailGroup("Business impact", report.define?.businessImpact),
    createDetailGroup("Project goal", report.define?.projectGoal),
    createDetailGroup("Suggested scope", report.define?.suggestedScope),
    createDetailGroup("Stakeholders", report.define?.stakeholders),
  ]);

  const measure = createSection("3. Measure", [
    createDetailGroup("Suggested KPIs", report.measure?.suggestedKpis),
    createDetailGroup("Data required", report.measure?.dataRequired),
    createDetailGroup("Baseline measurement approach", report.measure?.baselineMeasurementApproach),
    createDetailGroup("Measurement risks", report.measure?.measurementRisks),
  ]);

  const analyze = createSection("4. Analyze", [
    createDetailGroup("Possible root causes", report.analyze?.possibleRootCauses),
    createDetailGroup("Suggested Lean Six Sigma tools", report.analyze?.suggestedTools),
    createDetailGroup("Key hypotheses to validate", report.analyze?.keyHypotheses),
  ]);

  const improve = createSection("5. Improve", [
    createDetailGroup("Recommended improvement actions", report.improve?.recommendedActions),
    createDetailGroup("Pilot ideas", report.improve?.pilotIdeas),
    createDetailGroup("Automation opportunities", report.improve?.automationOpportunities),
    createDetailGroup("AI opportunities", report.improve?.aiOpportunities),
  ]);

  const control = createSection("6. Control", [
    createDetailGroup("Control plan", report.control?.controlPlan),
    createDetailGroup("Process ownership", report.control?.processOwnership),
    createDetailGroup("Review cadence", report.control?.reviewCadence),
    createDetailGroup("Sustainability risks", report.control?.sustainabilityRisks),
  ]);

  const actionPlan = createSection("7. 30 / 60 / 90 Day Action Plan", [
    createDetailGroup("First 30 days", report.actionPlan?.day30),
    createDetailGroup("Days 31-60", report.actionPlan?.day60),
    createDetailGroup("Days 61-90", report.actionPlan?.day90),
  ]);

  const excenor = createSection("8. How Excenor Can Support", [
    createDetailGroup("Advisory", report.excenorSupport?.advisory),
    createDetailGroup("Consulting", report.excenorSupport?.consulting),
    createDetailGroup("Change Management", report.excenorSupport?.changeManagement),
    createDetailGroup("Capability Building", report.excenorSupport?.capabilityBuilding),
  ]);

  reportContent.append(executive, define, measure, analyze, improve, control, actionPlan, excenor);
}

function flattenReport(report) {
  const parts = [];
  reportContent.querySelectorAll(".report-section").forEach((section) => {
    parts.push(section.querySelector("h3")?.textContent || "");
    section.querySelectorAll(".report-detail").forEach((detail) => {
      const title = detail.querySelector("h4")?.textContent || "";
      const items = Array.from(detail.querySelectorAll("li")).map((item) => `- ${item.textContent}`);
      const paragraph = detail.querySelector("p")?.textContent;
      parts.push(title);
      parts.push(items.length ? items.join("\n") : paragraph || "");
    });
  });
  return parts.filter(Boolean).join("\n\n");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearReportState();
  reportShell.hidden = false;
  reportShell.scrollIntoView({ behavior: "smooth", block: "start" });

  const payload = getFormPayload();
  setLoading(true);

  try {
    const response = await fetch("/api/dmaic-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to generate the DMAIC report.");
    }

    latestReport = data.report;
    renderReport(latestReport);
  } catch (error) {
    showError(error.message || "Unable to generate the DMAIC report.");
  } finally {
    setLoading(false);
  }
});

copyButton.addEventListener("click", async () => {
  if (!latestReport) {
    return;
  }

  const reportText = flattenReport(latestReport);
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(reportText);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = reportText;
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
});

resetButton.addEventListener("click", () => {
  form.reset();
  clearReportState();
  reportShell.hidden = true;
});
