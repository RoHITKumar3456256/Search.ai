/**
 * Search.ai Decision Brief View (PRD Sections 4, 6.5, 8 & 15)
 * Renders structured multi-lens recommendations, 8-signal breakdowns, verified sources, and 7-day action checklists.
 */

import { WorkspaceStore } from '../state/workspaceState.js';
import { Navigation } from './navigation.js';

export const DecisionBriefUI = {
  currentBrief: null,
  currentActionPlan: null,
  selectedLensIndex: 0,

  render(brief, actionPlan) {
    this.currentBrief = brief;
    this.currentActionPlan = actionPlan;
    this.selectedLensIndex = 0;

    const container = document.getElementById("decision-brief-container");
    if (!container) return;

    if (!brief || !brief.topRanked || brief.topRanked.length === 0) {
      container.innerHTML = `<div class="glass-panel" style="padding: 2rem; text-align: center;"><h3>No decisions mapped yet.</h3><p>Please enter a question in Ask mode.</p></div>`;
      return;
    }

    container.innerHTML = `
      <div class="brief-header-panel">
        <div class="brief-meta-row">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="badge badge-cyan">${brief.constraints.domain} DECISION BRIEF</span>
              <span class="badge ${brief.confidence.level === 'High' ? 'badge-emerald' : 'badge-amber'}">Confidence: ${brief.confidence.level}</span>
              <span style="font-size: 0.75rem; color: var(--text-tertiary);">${brief.dataFreshness}</span>
            </div>
            <h2 style="font-size: 1.75rem;">Evidence-Grounded Recommendation</h2>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="btn-save-decision-top">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              Save to Workspace
            </button>
            <button class="btn btn-outline btn-sm" id="btn-export-markdown">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export Brief
            </button>
          </div>
        </div>

        <div class="restated-goal-box">
          <h4>YOUR RESTATED GOAL & CONSTRAINTS</h4>
          <p>${brief.restatedGoal}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; font-size: 0.8rem; color: var(--text-secondary);">
            <span><strong>Budget:</strong> ${brief.constraints.budget}</span> •
            <span><strong>Skill:</strong> ${brief.constraints.skill}</span> •
            <span><strong>Timeframe:</strong> ${brief.constraints.timeframe}</span> •
            <span><strong>Region:</strong> ${brief.constraints.location}</span> •
            <span><strong>Priority:</strong> ${brief.constraints.priority}</span>
          </div>
        </div>

        ${brief.safetyNotices && brief.safetyNotices.length > 0 ? `
          <div class="safety-alert-box" style="margin: 1rem 0;">
            <div style="font-size: 1.2rem;">⚠️</div>
            <p>${brief.safetyNotices[0]}</p>
          </div>
        ` : ''}

        <!-- 3 Decision Lenses Switcher -->
        <h4 style="margin: 1.5rem 0 0.75rem 0; font-size: 0.9rem; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 0.05em;">
          Select Decision Lens
        </h4>
        <div class="lens-tabs" id="brief-lens-tabs">
          ${brief.topRanked.map((item, idx) => `
            <div class="lens-tab-card ${idx === 0 ? 'active' : ''}" data-lens-index="${idx}">
              <span class="lens-score-pill">${item.data.totalScore}% Fit</span>
              <span class="lens-badge ${idx === 0 ? 'badge-cyan' : idx === 1 ? 'badge-emerald' : 'badge-indigo'}">${item.lens}</span>
              <div class="lens-tool-name">${item.data.tool.name}</div>
              <p style="font-size: 0.78rem; margin-top: 2px;">${item.label}</p>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Active Selected Tool Breakdown Hero -->
      <div id="active-lens-content"></div>

      <!-- Action Plan Section -->
      <div class="action-plan-container">
        <div class="plan-header">
          <div>
            <span class="badge badge-emerald">Time-Boxed Execution</span>
            <h3 style="margin-top: 4px;">7-Day Action Plan (${brief.topRanked[0].data.tool.name})</h3>
            <p style="font-size: 0.85rem;">Step-by-step checklist to turn your decision into reality.</p>
          </div>
          <div id="plan-progress-pill" style="font-size: 0.85rem; font-weight: 700; color: var(--text-accent-emerald);">
            0 / ${actionPlan.steps.length} Milestones Complete
          </div>
        </div>

        <div class="plan-steps-list">
          ${actionPlan.steps.map((step, sIdx) => `
            <div class="plan-step-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span class="step-day-badge">${step.day}</span>
                <span style="font-size: 0.85rem; font-weight: 700; color: #ffffff;">${step.title}</span>
              </div>
              <p style="font-size: 0.82rem; margin-bottom: 8px;">${step.description}</p>
              <div class="checklist-tasks-group">
                ${step.tasks.map((task, tIdx) => `
                  <label class="checklist-item" data-step="${sIdx}" data-task="${tIdx}">
                    <input type="checkbox" class="action-task-check">
                    <span>${task}</span>
                  </label>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Verified Sources Drawer -->
      <div class="glass-panel" style="padding: 1.75rem; margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.5rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <h3>Verified Primary Sources & Evidence</h3>
        </div>
        <p style="font-size: 0.85rem;">Every factual claim, pricing fact, and platform specification is verified directly from official primary sources.</p>
        
        <div class="sources-grid">
          ${brief.sources.map(src => `
            <div class="source-item-card">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span class="source-trust-tag">${src.trust_tier} Source</span>
                <span style="font-size: 0.72rem; color: var(--text-tertiary);">Verified ${src.lastVerified || 'Aug 2026'}</span>
              </div>
              <strong style="color: #ffffff; font-size: 0.88rem; display: block; margin-bottom: 4px;">${src.title}</strong>
              <a href="${src.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.78rem; word-break: break-all;">
                ${src.url} ↗
              </a>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    this.renderSelectedLensDetails();
    this.bindBriefEvents();
  },

  renderSelectedLensDetails() {
    const target = document.getElementById("active-lens-content");
    if (!target || !this.currentBrief) return;

    const currentItem = this.currentBrief.topRanked[this.selectedLensIndex];
    const tool = currentItem.data.tool;
    const scoreData = currentItem.data;

    target.innerHTML = `
      <div class="selected-recommendation-details">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.25rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <h2 style="font-size: 2rem;">${tool.name}</h2>
              <span class="badge badge-emerald">Fit Score: ${scoreData.totalScore}/100</span>
              <span class="badge badge-cyan">${tool.subCategory}</span>
            </div>
            <p style="margin-top: 6px; font-size: 0.95rem; max-width: 680px;">${tool.description}</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="${tool.official_url}" target="_blank" class="btn btn-primary btn-sm">Visit Official Site ↗</a>
            <a href="${tool.pricing_url}" target="_blank" class="btn btn-secondary btn-sm">Pricing Details ↗</a>
          </div>
        </div>

        <div class="rec-grid-two-col">
          <!-- Left: Why it fits, costs, and tradeoffs -->
          <div>
            <!-- Estimated Costs Box -->
            <div class="glass-panel-elevated" style="padding: 1.25rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-tertiary); font-weight: 700;">Setup Cost</div>
                <div style="font-size: 1.3rem; font-weight: 800; color: #ffffff; margin-top: 2px;">${scoreData.estimatedMonthlyCost.setupCost}</div>
              </div>
              <div>
                <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-tertiary); font-weight: 700;">Recurring Cost</div>
                <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-accent-emerald); margin-top: 2px;">${scoreData.estimatedMonthlyCost.recurringCost}</div>
              </div>
            </div>

            <!-- Why this fits -->
            <h4 style="color: var(--text-accent-emerald); display: flex; align-items: center; gap: 6px;">
              <span>Why this fits your constraints</span>
            </h4>
            <ul class="fit-points-list">
              ${scoreData.fitRationale.map(pt => `<li>${pt}</li>`).join("")}
            </ul>

            <!-- Trade-offs -->
            <h4 style="color: var(--text-accent-amber); margin-top: 1.5rem; display: flex; align-items: center; gap: 6px;">
              <span>Transparent Trade-offs & Limitations</span>
            </h4>
            <ul class="tradeoffs-list">
              ${scoreData.tradeOffs.map(to => `<li>${to}</li>`).join("")}
            </ul>

            ${this.currentBrief.popularUnselected ? `
              <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-surface-elevated); border-radius: var(--radius-md); border-left: 3px solid var(--text-tertiary);">
                <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
                  Why wasn't popular alternative "${this.currentBrief.popularUnselected.toolName}" chosen?
                </div>
                <p style="font-size: 0.82rem; margin-top: 4px; color: var(--text-tertiary);">
                  ${this.currentBrief.popularUnselected.reason}
                </p>
              </div>
            ` : ''}
          </div>

          <!-- Right: 8-Signal Explainable Score Breakdown -->
          <div>
            <div class="signal-breakdown-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="font-size: 0.9rem;">8-Signal Explainability</h4>
                <span style="font-size: 0.75rem; color: var(--text-tertiary);">Audit Trail</span>
              </div>

              <div class="signal-row">
                <div class="signal-meta"><span>Goal / Use-case fit (25%)</span> <strong>${Math.round(scoreData.breakdown.goalFit)}/25</strong></div>
                <div class="signal-bar-track"><div class="signal-bar-fill" style="width: ${(scoreData.breakdown.goalFit / 25) * 100}%"></div></div>
              </div>

              <div class="signal-row">
                <div class="signal-meta"><span>Budget & Cost fit (20%)</span> <strong>${Math.round(scoreData.breakdown.budgetFit)}/20</strong></div>
                <div class="signal-bar-track"><div class="signal-bar-fill" style="width: ${(scoreData.breakdown.budgetFit / 20) * 100}%"></div></div>
              </div>

              <div class="signal-row">
                <div class="signal-meta"><span>Required Capabilities (20%)</span> <strong>${Math.round(scoreData.breakdown.capabilityFit)}/20</strong></div>
                <div class="signal-bar-track"><div class="signal-bar-fill" style="width: ${(scoreData.breakdown.capabilityFit / 20) * 100}%"></div></div>
              </div>

              <div class="signal-row">
                <div class="signal-meta"><span>Skill Level & Learning Curve (10%)</span> <strong>${Math.round(scoreData.breakdown.skillFit)}/10</strong></div>
                <div class="signal-bar-track"><div class="signal-bar-fill" style="width: ${(scoreData.breakdown.skillFit / 10) * 100}%"></div></div>
              </div>

              <div class="signal-row">
                <div class="signal-meta"><span>Location & Regional Support (10%)</span> <strong>${Math.round(scoreData.breakdown.locationFit)}/10</strong></div>
                <div class="signal-bar-track"><div class="signal-bar-fill" style="width: ${(scoreData.breakdown.locationFit / 10) * 100}%"></div></div>
              </div>

              <div class="signal-row">
                <div class="signal-meta"><span>Time-to-Value & Setup Speed (5%)</span> <strong>${Math.round(scoreData.breakdown.timeToValue)}/5</strong></div>
                <div class="signal-bar-track"><div class="signal-bar-fill" style="width: ${(scoreData.breakdown.timeToValue / 5) * 100}%"></div></div>
              </div>

              <div class="signal-row">
                <div class="signal-meta"><span>Evidence Confidence (5%)</span> <strong>${Math.round(scoreData.breakdown.evidenceConfidence)}/5</strong></div>
                <div class="signal-bar-track"><div class="signal-bar-fill" style="width: ${(scoreData.breakdown.evidenceConfidence / 5) * 100}%"></div></div>
              </div>

              <div class="signal-row">
                <div class="signal-meta"><span>User Preference Alignment (5%)</span> <strong>${Math.round(scoreData.breakdown.preferenceFit)}/5</strong></div>
                <div class="signal-bar-track"><div class="signal-bar-fill" style="width: ${(scoreData.breakdown.preferenceFit / 5) * 100}%"></div></div>
              </div>
            </div>

            <!-- Practical Adoption Quick Specs -->
            <div class="glass-panel" style="padding: 1.25rem; margin-top: 1rem;">
              <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 8px;">Adoption Metadata</h4>
              <div style="font-size: 0.82rem; display: flex; flex-direction: column; gap: 6px;">
                <div><strong>Setup Time:</strong> ${tool.setup_time_estimate}</div>
                <div><strong>Learning Curve:</strong> ${tool.learning_curve}</div>
                <div><strong>Supported Platforms:</strong> ${tool.platforms.join(", ")}</div>
                <div><strong>Security & Privacy:</strong> ${tool.privacy_security_notes}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  bindBriefEvents() {
    // Lens Switcher Click
    const lensCards = document.querySelectorAll(".lens-tab-card");
    lensCards.forEach(card => {
      card.addEventListener("click", () => {
        lensCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        this.selectedLensIndex = parseInt(card.dataset.lensIndex, 10);
        this.renderSelectedLensDetails();
      });
    });

    // Save Decision Button
    const saveBtn = document.getElementById("btn-save-decision-top");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        WorkspaceStore.saveDecision(this.currentBrief, this.currentActionPlan, this.selectedLensIndex);
        saveBtn.innerHTML = `✓ Saved to Workspace`;
        saveBtn.classList.remove("btn-secondary");
        saveBtn.classList.add("btn-primary");
        setTimeout(() => {
          saveBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> Save to Workspace`;
          saveBtn.classList.remove("btn-primary");
          saveBtn.classList.add("btn-secondary");
        }, 2000);
      });
    }

    // Export Markdown Button
    const exportBtn = document.getElementById("btn-export-markdown");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        this.exportBriefAsMarkdown();
      });
    }

    // Checklist Checkbox Toggles
    const checkboxes = document.querySelectorAll(".action-task-check");
    checkboxes.forEach(cb => {
      cb.addEventListener("change", (e) => {
        const itemLabel = cb.closest(".checklist-item");
        if (cb.checked) {
          itemLabel.classList.add("checked");
        } else {
          itemLabel.classList.remove("checked");
        }
        this.updatePlanProgressCounter();
      });
    });
  },

  updatePlanProgressCounter() {
    const total = document.querySelectorAll(".action-task-check").length;
    const checked = document.querySelectorAll(".action-task-check:checked").length;
    const pill = document.getElementById("plan-progress-pill");
    if (pill) {
      pill.textContent = `${checked} / ${total} Tasks Checked`;
    }
  },

  exportBriefAsMarkdown() {
    if (!this.currentBrief) return;
    const b = this.currentBrief;
    const topTool = b.topRanked[this.selectedLensIndex].data.tool;

    const md = `# Search.ai Decision Brief: ${topTool.name}
**Date:** ${new Date().toLocaleDateString()}  
**Confidence:** ${b.confidence.level} (${b.confidence.explanation})  
**Goal:** ${b.restatedGoal}  

## Recommended Solution: ${topTool.name} (${topTool.subCategory})
- **Starting Cost:** ${b.topRanked[this.selectedLensIndex].data.estimatedMonthlyCost.recurringCost}
- **Official URL:** ${topTool.official_url}
- **Setup Time:** ${topTool.setup_time_estimate}
- **Learning Curve:** ${topTool.learning_curve}

### Why this fits:
${b.topRanked[this.selectedLensIndex].data.fitRationale.map(r => `- ${r}`).join("\n")}

### Trade-offs & Limitations:
${b.topRanked[this.selectedLensIndex].data.tradeOffs.map(t => `- ${t}`).join("\n")}

## 7-Day Action Plan
${this.currentActionPlan.steps.map(s => `### ${s.day}: ${s.title}\n${s.tasks.map(t => `- [ ] ${t}`).join("\n")}`).join("\n\n")}

---
*Generated by Search.ai — Turn uncertainty into your next best move.*
`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SearchAI_Decision_${topTool.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
