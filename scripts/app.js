// SkriptForge — App
(function () {
  "use strict";

  let workspace = null;
  let wrapLines = false;

  // ── Boot ───────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    initBlockly();
    initDivider();
  });

  // ── Blockly ────────────────────────────────────────────────────────────────
  function initBlockly() {
    workspace = Blockly.inject("blocklyDiv", {
      toolbox: document.getElementById("toolbox"),
      theme: Blockly.Theme.defineTheme("sf", {
        base: Blockly.Themes.Classic,
        componentStyles: {
          workspaceBackgroundColour: "#13151f",
          toolboxBackgroundColour:   "#1a1d27",
          toolboxForegroundColour:   "#cccccc",
          flyoutBackgroundColour:    "#1e2130",
          flyoutForegroundColour:    "#e0e0e0",
          flyoutOpacity: 1,
          scrollbarColour: "#2a2e3e",
          insertionMarkerColour: "#5b9e3f",
          insertionMarkerOpacity: 0.3,
        },
      }),
      grid:     { spacing: 24, length: 3, colour: "#1e2130", snap: true },
      move:     { scrollbars: true, drag: true, wheel: true },
      zoom:     { controls: true, wheel: true, startScale: 0.9, maxScale: 2.5, minScale: 0.3, scaleSpeed: 1.1 },
      trashcan: true,
      sounds:   false,
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
    renderCode(code, errors, warnings);
    renderDiagnostics(errors, warnings);
    updateStats(errors, warnings);
    highlightBlocks(errors);
  }

  // ── Code panel ─────────────────────────────────────────────────────────────
  function renderCode(code, errors, warnings) {
    const el = document.getElementById("codeArea");

    if (!code) {
      el.innerHTML = `<div class="empty-state">
        <div class="es-icon">🧱</div>
        <p>Drag an <b>Event</b> block onto the canvas to start,<br>or click <b>Paste Code</b> to import existing Skript.</p>
      </div>`;
      return;
    }

    const hasErrors = errors.length > 0;
    const html = SF_Compiler.highlight(code);
    el.innerHTML = `<code class="sk-code" style="white-space:${wrapLines ? "pre-wrap" : "pre"}">${html}</code>`;

    // Copy button state
    const btn = document.getElementById("btnCopy");
    if (hasErrors) {
      btn.classList.add("btn-err");
      btn.title = `${errors.length} error(s) — fix before using`;
    } else {
      btn.classList.remove("btn-err");
      btn.title = "";
    }
  }

  // ── Diagnostics ────────────────────────────────────────────────────────────
  function renderDiagnostics(errors, warnings) {
    let panel = document.getElementById("diagPanel");

    if (!errors.length && !warnings.length) {
      if (panel) panel.remove();
      return;
    }

    if (!panel) {
      panel = document.createElement("div");
      panel.id = "diagPanel";
      document.getElementById("codePanel").appendChild(panel);
    }

    const items = [
      ...errors.map(e => ({ ...e, kind:"error" })),
      ...warnings.map(w => ({ ...w, kind:"warn" })),
    ];

    panel.innerHTML = items.map(item => {
      const isErr = item.kind === "error";
      return `<div class="diag-item diag-${item.kind}" onclick="SkriptForgeApp.focusBlock('${item.id}')">
        <div class="diag-head">${isErr ? "🔴 Error" : "🟡 Warning"}
          <span class="diag-hint">click to highlight block</span>
        </div>
        <div class="diag-msg">${item.msg}</div>
        <div class="diag-fix">💡 ${item.fix}</div>
      </div>`;
    }).join("");
  }

  function highlightBlocks(errors) {
    if (!workspace) return;
    workspace.getAllBlocks(false).forEach(b => b.setHighlighted(false));
    errors.forEach(({ id }) => workspace.getBlockById(id)?.setHighlighted(true));
  }

  window.SkriptForgeApp = {
    focusBlock(id) {
      const b = workspace?.getBlockById(id);
      if (b) { b.select(); workspace.centerOnBlock(id); }
    },
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  function updateStats(errors, warnings) {
    const all  = workspace.getAllBlocks(false);
    const tops = workspace.getTopBlocks(false);
    const code = SF_Compiler.generate(workspace);
    const lines = code ? code.split("\n").filter(l => l.trim()).length : 0;
    const evts  = tops.filter(b => b.type.startsWith("sk_on_") || b.type === "sk_every_x_seconds" || b.type === "sk_function_def").length;

    document.getElementById("statBlocks").textContent  = all.length;
    document.getElementById("statLines").textContent   = lines;
    document.getElementById("statEvents").textContent  = evts;
    document.getElementById("statErrors").textContent  = errors.length;
    document.getElementById("statErrors").style.color  = errors.length ? "#e06c75" : "#4ec9b0";
    document.getElementById("statWarns").textContent   = warnings.length;
    document.getElementById("statWarns").style.color   = warnings.length ? "#d19a66" : "#4ec9b0";
  }

  // ── Actions (called from HTML) ─────────────────────────────────────────────
  window.clearWorkspace = function () {
    if (!workspace || !workspace.getAllBlocks(false).length) return;
    if (!confirm("Clear the workspace?")) return;
    workspace.clear();
  };

  window.copyCode = function () {
    const el = document.getElementById("codeArea");
    const code = el.querySelector(".sk-code");
    if (!code) return;
    // Strip line number spans, get plain text
    const text = Array.from(code.querySelectorAll("span")).map(s => {
      return s.classList.contains("ln") ? "" : s.textContent;
    }).join("").split("\n").join("\n");
    navigator.clipboard.writeText(text).then(() => toast("✓ Copied!"));
  };

  window.downloadSk = function () {
    const el = document.getElementById("codeArea");
    const code = el.querySelector(".sk-code");
    if (!code) return;
    const text = Array.from(code.querySelectorAll("span")).map(s => {
      return s.classList.contains("ln") ? "" : s.textContent;
    }).join("");
    const blob = new Blob([text.trim()], { type: "text/plain" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "script.sk" });
    a.click();
    toast("⬇ Downloaded script.sk");
  };

  window.toggleWrap = function () {
    wrapLines = !wrapLines;
    document.getElementById("btnWrap").classList.toggle("active", wrapLines);
    renderAll();
  };

  // ── Paste Code modal ───────────────────────────────────────────────────────
  window.openPasteModal = function () {
    document.getElementById("pasteInput").value = "";
    document.getElementById("pasteError").textContent = "";
    document.getElementById("pasteModal").classList.add("open");
    setTimeout(() => document.getElementById("pasteInput").focus(), 100);
  };

  window.closePasteModal = function () {
    document.getElementById("pasteModal").classList.remove("open");
  };

  window.parseAndLoad = function () {
    const text = document.getElementById("pasteInput").value.trim();
    if (!text) return;

    const { xml, unknown } = SF_Compiler.reverseCompile(text);

    if (!xml) {
      document.getElementById("pasteError").textContent =
        "Could not find any recognisable Skript blocks. Check the code is valid Skript 2.9 syntax.";
      return;
    }

    // Load into workspace
    workspace.clear();
    try {
      const dom = Blockly.Xml.textToDom(xml);
      Blockly.Xml.domToWorkspace(dom, workspace);
    } catch (err) {
      document.getElementById("pasteError").textContent = "XML parse error: " + err.message;
      return;
    }

    closePasteModal();

    if (unknown.length) {
      const msg = `Imported with ${unknown.length} unrecognised line(s) skipped:\n` +
        unknown.slice(0, 5).map(u => `  Line ${u.lineNum}: ${u.raw}`).join("\n") +
        (unknown.length > 5 ? `\n  ...and ${unknown.length - 5} more` : "");
      setTimeout(() => alert(msg), 200);
    } else {
      toast(`✓ Imported ${workspace.getAllBlocks(false).length} blocks`);
    }

    workspace.scrollCenter();
  };

  // Close modal on Escape or backdrop click
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") document.querySelectorAll(".modal-backdrop.open").forEach(m => m.classList.remove("open"));
  });
  document.addEventListener("click", e => {
    if (e.target.classList.contains("modal-backdrop")) e.target.classList.remove("open");
  });

  // ── Divider resize ─────────────────────────────────────────────────────────
  function initDivider() {
    const div   = document.getElementById("divider");
    const panel = document.getElementById("codePanel");
    let dragging = false, startX = 0, startW = 0;

    div.addEventListener("mousedown", e => {
      dragging = true; startX = e.clientX; startW = panel.offsetWidth;
      div.classList.add("dragging");
      document.body.style.cssText += ";cursor:col-resize;user-select:none";
    });
    document.addEventListener("mousemove", e => {
      if (!dragging) return;
      const w = Math.max(200, Math.min(window.innerWidth * 0.7, startW + (startX - e.clientX)));
      panel.style.width = w + "px";
    });
    document.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      div.classList.remove("dragging");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      Blockly.svgResize(workspace);
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

})();