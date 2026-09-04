/**
 * Search.ai Ask & Clarify Flow (PRD Section 6.3)
 * Handles natural language input, context extractors, clarifying questions, and search orchestration.
 */

import { parseNaturalLanguageQuery } from '../engine/nlpExtractor.js';
import { scoreTools } from '../engine/scoringEngine.js';
import { generateActionPlan } from '../engine/planGenerator.js';
import { PRESET_QUERIES } from '../data/presets.js';
import { Navigation } from './navigation.js';
import { DecisionBriefUI } from './decisionBrief.js';

export const AskFlowUI = {
  currentParsed: null,
  currentBrief: null,
  currentPlan: null,

  init() {
    this.bindEvents();
    this.renderPresetChips();
  },

  bindEvents() {
    const askTextarea = document.getElementById("ask-textarea");
    const mapOptionsBtn = document.getElementById("map-options-btn");
    const heroTryBtn = document.getElementById("hero-try-btn");
    const heroDemoInput = document.getElementById("hero-demo-input");

    // Live NLP parsing on input
    if (askTextarea) {
      askTextarea.addEventListener("input", () => {
        this.handleQueryInput(askTextarea.value);
      });
    }

    if (mapOptionsBtn) {
      mapOptionsBtn.addEventListener("click", () => {
        this.executeDecisionMapping();
      });
    }

    if (heroTryBtn && heroDemoInput) {
      heroTryBtn.addEventListener("click", () => {
        const query = heroDemoInput.value.trim() || "I want to start an online business under ₹10,000 and I have no coding experience.";
        this.loadQueryIntoAsk(query);
      });
    }

    // Context Overrides Listeners
    ["ctx-domain", "ctx-budget", "ctx-skill", "ctx-location", "ctx-timeframe", "ctx-priority"].forEach(id => {
      const select = document.getElementById(id);
      if (select) {
        select.addEventListener("change", () => {
          this.reparseWithOverrides();
        });
      }
    });
  },

  loadQueryIntoAsk(queryText) {
    const textarea = document.getElementById("ask-textarea");
    if (textarea) {
      textarea.value = queryText;
    }
    Navigation.switchTab("ask");
    this.handleQueryInput(queryText);
  },

  renderPresetChips() {
    const container = document.getElementById("preset-chips-list");
    const heroChipsContainer = document.getElementById("hero-preset-chips");
    if (!container && !heroChipsContainer) return;

    const html = PRESET_QUERIES.map(p => `
      <button class="preset-chip" data-query="${p.query.replace(/"/g, '&quot;')}" title="${p.language}">
        <span>${p.label}</span>
      </button>
    `).join("");

    if (container) container.innerHTML = html;
    if (heroChipsContainer) heroChipsContainer.innerHTML = html;

    // Attach click handlers
    document.querySelectorAll(".preset-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const query = btn.dataset.query;
        this.loadQueryIntoAsk(query);
      });
    });
  },

  handleQueryInput(rawText) {
    if (!rawText.trim()) {
      this.clearContextPills();
      return;
    }

    const parsed = parseNaturalLanguageQuery(rawText, this.getContextOverrides());
    this.currentParsed = parsed;
    this.updateContextPillsUI(parsed.context);
    this.renderSafetyAlert(parsed.context.safety);
    this.renderClarifyingQuestions(parsed.clarifyingQuestions);
  },

  getContextOverrides() {
    return {
      domain: document.getElementById("ctx-domain")?.value || null,
      budget: document.getElementById("ctx-budget")?.value || null,
      skill: document.getElementById("ctx-skill")?.value || null,
      location: document.getElementById("ctx-location")?.value || null,
      timeframe: document.getElementById("ctx-timeframe")?.value || null,
      priority: document.getElementById("ctx-priority")?.value || null
    };
  },

  reparseWithOverrides() {
    const textarea = document.getElementById("ask-textarea");
    if (textarea && textarea.value) {
      this.handleQueryInput(textarea.value);
    }
  },

  updateContextPillsUI(context) {
    const domainSel = document.getElementById("ctx-domain");
    const budgetSel = document.getElementById("ctx-budget");
    const skillSel = document.getElementById("ctx-skill");
    const locSel = document.getElementById("ctx-location");
    const timeSel = document.getElementById("ctx-timeframe");
    const prioSel = document.getElementById("ctx-priority");

    if (domainSel && context.domain) domainSel.value = context.domain;
    if (skillSel && context.skill) skillSel.value = context.skill;
    if (locSel && context.location) locSel.value = context.location;
    if (timeSel && context.timeframe) timeSel.value = context.timeframe;
    if (prioSel && context.priority) prioSel.value = context.priority;
    if (budgetSel && context.budget) budgetSel.value = context.budget;
  },

  clearContextPills() {
    const drawer = document.getElementById("clarifying-questions-container");
    if (drawer) drawer.innerHTML = "";
    const safetyContainer = document.getElementById("ask-safety-alert");
    if (safetyContainer) safetyContainer.innerHTML = "";
  },

  renderSafetyAlert(safety) {
    const container = document.getElementById("ask-safety-alert");
    if (!container) return;

    if (safety && safety.isSensitive) {
      container.innerHTML = `
        <div class="safety-alert-box">
          <div style="font-size: 1.4rem;">⚠️</div>
          <div>
            <strong>Responsible AI Boundary Notice (${safety.policy.domain})</strong>
            <p>${safety.policy.disclaimer}</p>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = "";
    }
  },

  renderClarifyingQuestions(questions) {
    const container = document.getElementById("clarifying-questions-container");
    if (!container) return;

    if (!questions || questions.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <div class="clarifying-drawer">
        <div class="clarifying-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span>Context Refinement (Optional)</span>
        </div>
        ${questions.map((q, idx) => `
          <div class="question-block">
            <p>${idx + 1}. ${q.question}</p>
            <div class="option-radio-group">
              ${q.options.map((opt, optIdx) => `
                <button type="button" class="option-radio-btn ${optIdx === 0 ? 'selected' : ''}" onclick="this.parentElement.querySelectorAll('.option-radio-btn').forEach(b => b.classList.remove('selected')); this.classList.add('selected');">
                  ${opt}
                </button>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;
  },

  async executeDecisionMapping() {
    const textarea = document.getElementById("ask-textarea");
    const query = textarea?.value?.trim() || "I want to start an online business under ₹10,000 and I have no coding experience.";

    // Show Progress State
    const progressCard = document.getElementById("research-progress-modal");
    if (progressCard) progressCard.style.display = "block";

    const step1 = document.getElementById("step-nlp");
    const step2 = document.getElementById("step-retrieval");
    const step3 = document.getElementById("step-scoring");
    const step4 = document.getElementById("step-brief");

    // Execute with smooth transition
    if (step1) step1.className = "progress-step-item active";
    await new Promise(r => setTimeout(r, 200));

    const parsed = parseNaturalLanguageQuery(query, this.getContextOverrides());
    this.currentParsed = parsed;
    if (step1) step1.className = "progress-step-item done";
    if (step2) step2.className = "progress-step-item active";

    await new Promise(r => setTimeout(r, 250));
    const brief = scoreTools(parsed.context);
    this.currentBrief = brief;
    if (step2) step2.className = "progress-step-item done";
    if (step3) step3.className = "progress-step-item active";

    await new Promise(r => setTimeout(r, 250));
    const actionPlan = generateActionPlan(brief.topRanked[0].data.tool, parsed.context);
    this.currentPlan = actionPlan;
    if (step3) step3.className = "progress-step-item done";
    if (step4) step4.className = "progress-step-item active";

    await new Promise(r => setTimeout(r, 200));
    if (progressCard) progressCard.style.display = "none";

    // Render Brief and navigate
    DecisionBriefUI.render(brief, actionPlan);
    Navigation.switchTab("brief");
  }
};
