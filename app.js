// SkriptForge — App
(function () {
  "use strict";

  let workspace = null;

  // ── Boot ───────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    showTab("editor");
    initBlockly();
    initDividers();
    loadPublished();
  });

  // ── Tab switching ──────────────────────────────────────────────────────────
  window.showTab = function (tab) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
    document.querySelectorAll(".tab-view").forEach(v => v.style.display = v.id === "view-" + tab ? "flex" : "none");
    if (tab === "publish") loadPublished();
  };

  // ── Blockly init ───────────────────────────────────────────────────────────
  function initBlockly() {
    workspace = Blockly.inject("blocklyDiv", {
      toolbox: document.getElementById("toolbox"),
      theme: Blockly.Theme.defineTheme("sf", {
        base: Blockly.Themes.Classic,
        componentStyles: {
          workspaceBackgroundColour: "#15120a",
          toolboxBackgroundColour:   "#1a1608",
          toolboxForegroundColour:   "#d4c484",
          flyoutBackgroundColour:    "#201a0c",
          flyoutForegroundColour:    "#e0d090",
          flyoutOpacity: 1,
          scrollbarColour: "#5a4a20",
          insertionMarkerColour: "#7dba5c",
          insertionMarkerOpacity: 0.4,
        },
        fontStyle: { family: "system-ui, sans-serif", size: 12 },
      }),
      grid: { spacing: 20, length: 3, colour: "#1e1a0e", snap: true },
      move: { scrollbars: true, drag: true, wheel: true },
      zoom: { controls: true, wheel: true, startScale: 0.85, maxScale: 2.5, minScale: 0.3, scaleSpeed: 1.1 },
      trashcan: true,
      sounds: false,
    });
    workspace.addChangeListener(onWorkspaceChange);
  }

  // ── Workspace change ───────────────────────────────────────────────────────
  function onWorkspaceChange(e) {
    if (e.type === Blockly.Events.VIEWPORT_CHANGE || e.type === Blockly.Events.CLICK) return;
    renderAll();
  }

  function renderAll() {
    const code = SF_Compiler.generate(workspace);
    const { errors, warnings } = SF_Validator.validate(workspace);
    renderCode(code, errors);
    renderDiagnostics(errors, warnings);
    updateStats(errors, warnings);
    workspace.getAllBlocks(false).forEach(b => b.setHighlighted(false));
    errors.forEach(({ id }) => workspace.getBlockById(id)?.setHighlighted(true));
  }

  // ── Code output ────────────────────────────────────────────────────────────
  function renderCode(code, errors) {
    const el = document.getElementById("codeArea");
    if (!code) {
      el.innerHTML = `<div class="empty-state">
        <div class="es-icon">⛏</div>
        <p>DRAG AN EVENT BLOCK<br>OR PASTE CODE ON THE LEFT</p>
      </div>`;
      document.getElementById("btnCopy").classList.remove("btn-err");
      return;
    }
    const html = SF_Compiler.highlight(code);
    el.innerHTML = `<code class="sk-code">${html}</code>`;
    document.getElementById("btnCopy").classList.toggle("btn-err", errors.length > 0);
  }

  // ── Diagnostics panel ─────────────────────────────────────────────────────
  function renderDiagnostics(errors, warnings) {
    let panel = document.getElementById("diagPanel");
    if (!errors.length && !warnings.length) { panel?.remove(); return; }
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "diagPanel";
      document.getElementById("codePanel").appendChild(panel);
    }
    const items = [
      ...errors.map(e => ({ ...e, kind:"error" })),
      ...warnings.map(w => ({ ...w, kind:"warn" })),
    ];
    panel.innerHTML = items.map(item => `
      <div class="diag-item diag-${item.kind}" onclick="SkriptForgeApp.focusBlock('${item.id}')">
        <div class="diag-head">${item.kind === "error" ? "🔴 ERROR" : "🟡 WARNING"}
          <span class="diag-hint">click to highlight</span>
        </div>
        <div class="diag-msg">${item.msg}</div>
        <div class="diag-fix">FIX: ${item.fix}</div>
      </div>`).join("");
  }

  window.SkriptForgeApp = {
    focusBlock(id) {
      const b = workspace?.getBlockById(id);
      if (b) { b.select(); workspace.centerOnBlock(id); }
    },
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  function updateStats(errors, warnings) {
    const all   = workspace.getAllBlocks(false);
    const tops  = workspace.getTopBlocks(false);
    const code  = SF_Compiler.generate(workspace);
    const lines = code ? code.split("\n").filter(l => l.trim()).length : 0;
    const evts  = tops.filter(b => b.type.startsWith("sk_on_") || b.type.startsWith("sk_every") || b.type === "sk_function_def" || b.type === "sk_command_block").length;
    set("statBlocks", all.length);
    set("statLines", lines);
    set("statEvents", evts);
    const errEl = document.getElementById("statErrors");
    errEl.textContent = errors.length;
    errEl.style.color = errors.length ? "#ff6666" : "#55cc33";
  }
  function set(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }

  // ── Import (paste → blocks) ────────────────────────────────────────────────
  window.parseAndLoad = function () {
    const text = document.getElementById("pasteInput").value.trim();
    const statusEl = document.getElementById("parseStatus");
    if (!text) { statusEl.textContent = ""; return; }

    const { xml, unknown } = SF_Compiler.reverseCompile(text);

    if (!xml) {
      statusEl.className = "status-err";
      statusEl.textContent = "✗ No recognisable Skript blocks found. Check syntax.";
      return;
    }

    workspace.clear();
    try {
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
    } catch (err) {
      statusEl.className = "status-err";
      statusEl.textContent = "✗ XML error: " + err.message;
      return;
    }

    workspace.scrollCenter();

    if (unknown.length) {
      const skipped = unknown.slice(0, 5).map(u => `Line ${u.lineNum}: ${u.raw}`).join("\n");
      statusEl.className = "status-warn";
      statusEl.textContent = `⚠ Imported with ${unknown.length} skipped line(s)`;
      // Show details in a small collapsible below
      document.getElementById("unknownDetails").textContent = skipped + (unknown.length > 5 ? `\n...+${unknown.length - 5} more` : "");
      document.getElementById("unknownDetails").style.display = "block";
    } else {
      statusEl.className = "status-ok";
      statusEl.textContent = `✓ Imported ${workspace.getAllBlocks(false).length} blocks`;
      document.getElementById("unknownDetails").style.display = "none";
    }
    // Switch to editor tab
    showTab("editor");
    toast("✓ Code imported!");
  };

  window.clearPaste = function () {
    document.getElementById("pasteInput").value = "";
    document.getElementById("parseStatus").textContent = "";
    document.getElementById("unknownDetails").style.display = "none";
  };

  // ── Copy ───────────────────────────────────────────────────────────────────
  window.copyCode = function () {
    const code = document.querySelector(".sk-code");
    if (!code) return;
    // Get plain text: strip line-number spans
    const lines = [];
    code.querySelectorAll("span[class^='sk-'], span.sk-blank, span.sk-comment, span.sk-event, span.sk-cond, span.sk-loop, span.sk-func, span.sk-var, span.sk-msg, span.sk-eff, span.sk-act, span.sk-plain").forEach(s => {
      lines.push(s.textContent);
    });
    // Fallback: innerText without line numbers
    const text = code.innerText.split("\n").map(l => l.replace(/^\s{0,3}\d+\s*/, "")).join("\n");
    navigator.clipboard.writeText(text.trim()).then(() => toast("✓ Copied!"));
  };

  window.clearWorkspace = function () {
    if (!workspace || !workspace.getAllBlocks(false).length) return;
    if (!confirm("Clear the workspace?")) return;
    workspace.clear();
  };

  // ── Publish ────────────────────────────────────────────────────────────────
  function getScripts() {
    try { return JSON.parse(localStorage.getItem("sf_published") || "[]"); } catch { return []; }
  }
  function saveScripts(arr) { localStorage.setItem("sf_published", JSON.stringify(arr)); }

  window.publishScript = function () {
    const username = document.getElementById("pubUsername").value.trim();
    const title    = document.getElementById("pubTitle").value.trim();
    const code     = document.getElementById("pubCode").value.trim();
    const errEl    = document.getElementById("pubError");

    errEl.textContent = "";

    // Validate
    if (!username) { errEl.textContent = "Username is required."; return; }
    if (username.length < 2 || username.length > 24) { errEl.textContent = "Username must be 2–24 characters."; return; }
    if (!/^[a-zA-Z0-9_\-]+$/.test(username)) { errEl.textContent = "Username: letters, numbers, _ and - only."; return; }
    if (!title)    { errEl.textContent = "Title is required."; return; }
    if (title.length < 3 || title.length > 60) { errEl.textContent = "Title must be 3–60 characters."; return; }
    if (!code)     { errEl.textContent = "Script code is required."; return; }
    if (code.length > 20000) { errEl.textContent = "Script too long (max 20,000 chars)."; return; }

    // Profanity check
    for (const [field, val] of [["Username", username], ["Title", title], ["Code", code]]) {
      const r = SF_Filter.check(val);
      if (!r.ok) { errEl.textContent = `${field} contains a disallowed word.`; return; }
    }

    const scripts = getScripts();
    scripts.unshift({ username, title, code, date: new Date().toLocaleDateString() });
    saveScripts(scripts);
    loadPublished();

    // Clear form
    document.getElementById("pubUsername").value = "";
    document.getElementById("pubTitle").value = "";
    document.getElementById("pubCode").value = "";
    toast("✓ Published!");
  };

  window.loadPublished = function () {
    const list = document.getElementById("publishedList");
    if (!list) return;
    const scripts = getScripts();
    if (!scripts.length) {
      list.innerHTML = `<div class="pub-empty">NO SCRIPTS PUBLISHED YET.<br>BE THE FIRST!</div>`;
      return;
    }
    list.innerHTML = scripts.map((s, i) => `
      <div class="pub-card">
        <div class="pub-header">
          <span class="pub-title">${esc(s.title)}</span>
          <span class="pub-meta">by ${esc(s.username)} · ${esc(s.date)}</span>
        </div>
        <pre class="pub-code">${esc(s.code)}</pre>
        <div class="pub-actions">
          <button class="mc-btn btn-teal" onclick="loadPublishedScript(${i})">LOAD INTO EDITOR</button>
          <button class="mc-btn btn-stone" onclick="copyPublished(${i})">COPY .SK</button>
          <button class="mc-btn btn-red-sm" onclick="deletePublished(${i})">DELETE</button>
        </div>
      </div>`).join("");
  };

  function esc(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  window.copyPublished = function (i) {
    const s = getScripts()[i];
    if (!s) return;
    navigator.clipboard.writeText(s.code).then(() => toast("✓ Copied!"));
  };

  window.loadPublishedScript = function (i) {
    const s = getScripts()[i];
    if (!s) return;
    document.getElementById("pasteInput").value = s.code;
    showTab("editor");
    parseAndLoad();
  };

  window.deletePublished = function (i) {
    if (!confirm("Delete this script?")) return;
    const scripts = getScripts();
    scripts.splice(i, 1);
    saveScripts(scripts);
    loadPublished();
  };

  // ── Divider resizing ───────────────────────────────────────────────────────
  function initDividers() {
    makeDivider("dividerLeft", "pastePanel", "left");
    makeDivider("dividerRight", "codePanel", "right");
  }

  function makeDivider(divId, panelId, side) {
    const div = document.getElementById(divId);
    const panel = document.getElementById(panelId);
    if (!div || !panel) return;
    let dragging = false, startX = 0, startW = 0;
    div.addEventListener("mousedown", e => {
      dragging = true; startX = e.clientX; startW = panel.offsetWidth;
      div.classList.add("dragging");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    });
    document.addEventListener("mousemove", e => {
      if (!dragging) return;
      const delta = side === "left" ? e.clientX - startX : startX - e.clientX;
      const w = Math.max(160, Math.min(window.innerWidth * 0.4, startW + delta));
      panel.style.width = w + "px";
    });
    document.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false; div.classList.remove("dragging");
      document.body.style.cursor = ""; document.body.style.userSelect = "";
      if (workspace) Blockly.svgResize(workspace);
    });
  }

  // ── Toast ──────────────────────────────────────────────────────────────────
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2400);
  }

  // Export for publish page
  window.SF_toast = toast;

})();