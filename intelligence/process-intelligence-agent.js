const processForm = document.querySelector("#processDiagnosticForm");
const generateProcessButton = document.querySelector("#generateProcessButton");
const processResetButton = document.querySelector("#processResetButton");
const generateAgainButton = document.querySelector("#generateAgainButton");
const copyProcessReportButton = document.querySelector("#copyProcessReportButton");
const processReportShell = document.querySelector("#processReportShell");
const processReportContent = document.querySelector("#processReportContent");
const processLoadingState = document.querySelector("#processLoadingState");
const processErrorState = document.querySelector("#processErrorState");
const processCopyStatus = document.querySelector("#processCopyStatus");
const processEmptyState = document.querySelector("#processEmptyState");

let latestProcessReport = "";

function getValue(name) {
  return new FormData(processForm).get(name)?.trim() || "";
}

function getProcessPayload() {
  return {
    companyName: getValue("companyName"),
    industry: getValue("industry"),
    processName: getValue("processName"),
    processDescription: getValue("processDescription"),
    desiredOutcome: getValue("desiredOutcome"),
    problemStatement: getValue("problemStatement"),
    painPoints: getValue("painPoints"),
    availableMetrics: getValue("availableMetrics"),
    referenceInfo: getValue("referenceInfo"),
    currentSystems: getValue("currentSystems"),
    processVolume: getValue("processVolume"),
    stakeholders: getValue("stakeholders"),
    riskSensitivity: getValue("riskSensitivity"),
    improvementPriority: getValue("improvementPriority"),
  };
}

function setFieldError(id, message) {
  const field = document.querySelector(`#${id}`);
  const error = document.querySelector(`#${id}Error`);
  if (!field || !error) {
    return;
  }

  field.toggleAttribute("aria-invalid", Boolean(message));
  error.textContent = message;
}

function validateProcessForm(payload) {
  const errors = {
    processName: payload.processName ? "" : "Process Name is required.",
    processDescription: payload.processDescription ? "" : "Process Description is required.",
    problemStatement: payload.problemStatement ? "" : "Problem Statement is required.",
  };

  Object.entries(errors).forEach(([id, message]) => setFieldError(id, message));
  return !Object.values(errors).some(Boolean);
}

function setProcessLoading(isLoading) {
  generateProcessButton.disabled = isLoading;
  generateProcessButton.textContent = isLoading ? "Generating..." : "Generate Process Diagnostic";
  processLoadingState.hidden = !isLoading;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function parseMarkdownTable(lines, startIndex) {
  const rows = [];
  let index = startIndex;

  while (index < lines.length && /^\s*\|.+\|\s*$/.test(lines[index])) {
    if (!/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index])) {
      rows.push(lines[index]);
    }
    index += 1;
  }

  if (rows.length < 2) {
    return null;
  }

  const table = document.createElement("table");
  const [headerRow, ...bodyRows] = rows.map((row) =>
    row
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim())
  );

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  headerRow.forEach((cell) => {
    const th = document.createElement("th");
    th.innerHTML = renderInlineMarkdown(cell);
    tr.append(th);
  });
  thead.append(tr);
  table.append(thead);

  const tbody = document.createElement("tbody");
  bodyRows.forEach((row) => {
    const bodyTr = document.createElement("tr");
    row.forEach((cell) => {
      const td = document.createElement("td");
      td.innerHTML = renderInlineMarkdown(cell);
      bodyTr.append(td);
    });
    tbody.append(bodyTr);
  });
  table.append(tbody);

  return { table, nextIndex: index };
}

function renderMarkdown(markdown) {
  processReportContent.replaceChildren();
  const lines = markdown.split(/\r?\n/);
  let section = null;
  let list = null;

  function ensureSection() {
    if (!section) {
      section = document.createElement("article");
      section.className = "report-section";
      processReportContent.append(section);
    }
    return section;
  }

  function closeList() {
    list = null;
  }

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const line = rawLine.trim();

    if (!line) {
      closeList();
      continue;
    }

    const table = parseMarkdownTable(lines, index);
    if (table) {
      closeList();
      const tableWrap = document.createElement("div");
      tableWrap.className = "table-wrap";
      tableWrap.append(table.table);
      ensureSection().append(tableWrap);
      index = table.nextIndex - 1;
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      const title = heading[2].replace(/^\d+\.\s*/, "");
      if (level <= 2) {
        section = document.createElement("article");
        section.className = "report-section";
        const h3 = document.createElement("h3");
        h3.innerHTML = renderInlineMarkdown(title);
        section.append(h3);
        processReportContent.append(section);
      } else {
        const h4 = document.createElement("h4");
        h4.innerHTML = renderInlineMarkdown(title);
        ensureSection().append(h4);
      }
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      if (!list) {
        list = document.createElement("ul");
        ensureSection().append(list);
      }
      const li = document.createElement("li");
      li.innerHTML = renderInlineMarkdown(bullet[1]);
      list.append(li);
      continue;
    }

    closeList();
    const paragraph = document.createElement("p");
    paragraph.innerHTML = renderInlineMarkdown(line);
    ensureSection().append(paragraph);
  }
}

async function copyReportText(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

async function generateProcessDiagnostic(payload) {
  setProcessLoading(true);
  processErrorState.hidden = true;
  processEmptyState.hidden = true;
  processReportShell.hidden = false;
  processReportShell.scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const response = await fetch("/api/process-diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "We could not generate the diagnostic right now. Please try again.");
    }

    latestProcessReport = data.report || "";
    renderMarkdown(latestProcessReport);
  } catch (error) {
    processErrorState.textContent = "We could not generate the diagnostic right now. Please try again.";
    processErrorState.hidden = false;
  } finally {
    setProcessLoading(false);
  }
}

processForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = getProcessPayload();

  if (!validateProcessForm(payload)) {
    return;
  }

  generateProcessDiagnostic(payload);
});

copyProcessReportButton.addEventListener("click", async () => {
  if (!latestProcessReport) {
    return;
  }

  await copyReportText(latestProcessReport);
  processCopyStatus.hidden = false;
  setTimeout(() => {
    processCopyStatus.hidden = true;
  }, 1800);
});

generateAgainButton.addEventListener("click", () => {
  const payload = getProcessPayload();
  if (validateProcessForm(payload)) {
    generateProcessDiagnostic(payload);
  }
});

processResetButton.addEventListener("click", () => {
  processForm.reset();
  latestProcessReport = "";
  processReportContent.replaceChildren();
  processReportShell.hidden = true;
  processErrorState.hidden = true;
  processEmptyState.hidden = false;
  ["processName", "processDescription", "problemStatement"].forEach((id) => setFieldError(id, ""));
});
