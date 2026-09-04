/**
 * Search.ai Workspace & Project Management View (PRD Section 6.7 & 14)
 * Stores decisions, project groupings, user notes, and interactive checklist execution.
 */

import { WorkspaceStore } from '../state/workspaceState.js';
import { DecisionBriefUI } from './decisionBrief.js';
import { Navigation } from './navigation.js';

export const WorkspaceViewUI = {
  activeProjectId: "all",

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById("workspace-container");
    if (!container) return;

    const projects = WorkspaceStore.getProjects();
    const allDecisions = WorkspaceStore.getSavedDecisions();
    const filteredDecisions = this.activeProjectId === "all"
      ? allDecisions
      : allDecisions.filter(d => d.projectId === this.activeProjectId);

    container.innerHTML = `
      <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge badge-indigo">Execution Hub</span>
          <h2 style="margin-top: 4px;">Personal Decision Workspace</h2>
          <p>Manage your saved decisions, project milestones, and action plans in one place.</p>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-create-project">
          + New Project Folder
        </button>
      </div>

      <div class="workspace-layout">
        <!-- Sidebar Projects Navigation -->
        <div class="project-sidebar">
          <h4 style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-tertiary); letter-spacing: 0.05em;">
            Workspaces & Projects
          </h4>
          <ul class="project-list-nav">
            <li class="project-item-link ${this.activeProjectId === 'all' ? 'active' : ''}" data-project-id="all">
              <span>📁 All Decisions</span>
              <span class="badge badge-cyan" style="font-size: 0.65rem;">${allDecisions.length}</span>
            </li>
            ${projects.map(proj => {
              const count = allDecisions.filter(d => d.projectId === proj.id).length;
              return `
                <li class="project-item-link ${this.activeProjectId === proj.id ? 'active' : ''}" data-project-id="${proj.id}">
                  <span>📂 ${proj.name}</span>
                  <span class="badge badge-indigo" style="font-size: 0.65rem;">${count}</span>
                </li>
              `;
            }).join("")}
          </ul>
        </div>

        <!-- Saved Decisions Content Area -->
        <div>
          ${filteredDecisions.length === 0 ? `
            <div class="glass-panel" style="padding: 3rem 2rem; text-align: center;">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">📋</div>
              <h3>No saved decisions in this project</h3>
              <p style="margin: 0.5rem auto 1.5rem auto; max-width: 450px;">
                Ask a question to map your options and click "Save to Workspace" on any decision brief.
              </p>
              <button class="btn btn-primary" id="btn-start-first-decision">Start a Decision</button>
            </div>
          ` : `
            <div class="saved-decisions-list">
              ${filteredDecisions.map(d => `
                <div class="saved-decision-card">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span class="badge badge-cyan">${d.domain}</span>
                        <span class="badge ${d.confidence.level === 'High' ? 'badge-emerald' : 'badge-amber'}">Confidence: ${d.confidence.level}</span>
                        <span style="font-size: 0.75rem; color: var(--text-tertiary);">Saved ${new Date(d.savedAt).toLocaleDateString()}</span>
                      </div>
                      <h3 style="font-size: 1.35rem; color: #ffffff;">${d.selectedTool.name} (${d.selectedTool.subCategory})</h3>
                      <p style="font-size: 0.88rem; margin-top: 4px;">${d.query}</p>
                    </div>

                    <!-- Status Selector -->
                    <select class="context-select btn-update-status" data-decision-id="${d.id}" style="background: var(--bg-surface-elevated); padding: 4px 10px; border: 1px solid var(--border-medium); border-radius: var(--radius-sm);">
                      <option value="In Progress" ${d.status === 'In Progress' ? 'selected' : ''}>⏳ In Progress</option>
                      <option value="Completed" ${d.status === 'Completed' ? 'selected' : ''}>✅ Completed</option>
                      <option value="Archived" ${d.status === 'Archived' ? 'selected' : ''}>📦 Archived</option>
                    </select>
                  </div>

                  <!-- Notes Box -->
                  <div style="margin: 1.25rem 0;">
                    <label style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-tertiary); font-weight: 700;">Personal Notes & Assumptions</label>
                    <textarea class="decision-notes-input query-textarea" data-decision-id="${d.id}" style="border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px; min-height: 60px; font-size: 0.85rem; margin-top: 4px;" placeholder="Add private notes on team discussions or budget approvals...">${d.notes || ''}</textarea>
                  </div>

                  <!-- Action Bar -->
                  <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 1rem; margin-top: 1rem; flex-wrap: wrap; gap: 8px;">
                    <div style="font-size: 0.8rem; color: var(--text-tertiary);">
                      Budget: <strong>${d.budget}</strong> • Timeframe: <strong>${d.timeframe}</strong>
                    </div>
                    <div style="display: flex; gap: 8px;">
                      <button class="btn btn-primary btn-sm btn-open-brief" data-decision-id="${d.id}">
                        Open Decision Brief
                      </button>
                      <button class="btn btn-outline btn-sm btn-delete-decision" data-decision-id="${d.id}" title="Delete record">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>

      <!-- Create Project Modal -->
      <div id="new-project-modal" class="modal-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Create New Project Workspace</h3>
            <button class="modal-close-btn" id="modal-proj-close">&times;</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label style="font-size: 0.8rem; color: var(--text-tertiary);">Project Name</label>
              <input type="text" id="new-proj-name" class="dir-search-input" style="padding: 8px 12px;" placeholder="e.g. Q4 E-Commerce Launch">
            </div>
            <div>
              <label style="font-size: 0.8rem; color: var(--text-tertiary);">Description (Optional)</label>
              <input type="text" id="new-proj-desc" class="dir-search-input" style="padding: 8px 12px;" placeholder="e.g. Tooling and vendor decisions">
            </div>
            <button class="btn btn-primary" id="btn-submit-new-project" style="margin-top: 8px;">Create Project</button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    // Project Nav Clicks
    document.querySelectorAll(".project-item-link").forEach(item => {
      item.addEventListener("click", () => {
        this.activeProjectId = item.dataset.projectId;
        this.render();
      });
    });

    // Start Decision CTA
    const startBtn = document.getElementById("btn-start-first-decision");
    if (startBtn) {
      startBtn.addEventListener("click", () => Navigation.switchTab("ask"));
    }

    // Status Selector Change
    document.querySelectorAll(".btn-update-status").forEach(select => {
      select.addEventListener("change", (e) => {
        const id = select.dataset.decisionId;
        WorkspaceStore.updateDecisionStatus(id, e.target.value);
      });
    });

    // Notes Input
    document.querySelectorAll(".decision-notes-input").forEach(textarea => {
      textarea.addEventListener("blur", (e) => {
        const id = textarea.dataset.decisionId;
        WorkspaceStore.updateDecisionNotes(id, e.target.value);
      });
    });

    // Open Saved Brief
    document.querySelectorAll(".btn-open-brief").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.decisionId;
        const target = WorkspaceStore.getSavedDecisions().find(d => d.id === id);
        if (target && target.brief) {
          DecisionBriefUI.render(target.brief, target.actionPlan);
          Navigation.switchTab("brief");
        }
      });
    });

    // Delete Decision
    document.querySelectorAll(".btn-delete-decision").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.decisionId;
        if (confirm("Are you sure you want to remove this saved decision from your workspace?")) {
          WorkspaceStore.removeDecision(id);
          this.render();
        }
      });
    });

    // Project Creator Modal
    const projBtn = document.getElementById("btn-create-project");
    const modal = document.getElementById("new-project-modal");
    const closeBtn = document.getElementById("modal-proj-close");
    const submitBtn = document.getElementById("btn-submit-new-project");

    if (projBtn && modal) {
      projBtn.addEventListener("click", () => modal.classList.add("open"));
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    }
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const name = document.getElementById("new-proj-name")?.value || "";
        const desc = document.getElementById("new-proj-desc")?.value || "";
        if (name.trim()) {
          WorkspaceStore.createProject(name, desc);
          modal.classList.remove("open");
          this.render();
        }
      });
    }
  }
};
