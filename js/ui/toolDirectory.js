/**
 * Search.ai Curated Tool Directory & Knowledge Base Browser (PRD Section 9 & 10)
 * Search, category filters, verification timestamps, and correction submission workflow.
 */

import { TOOL_DATABASE, CATEGORIES } from '../data/toolDatabase.js';
import { WorkspaceStore } from '../state/workspaceState.js';

export const ToolDirectoryUI = {
  selectedCategory: "All",
  searchQuery: "",
  activeModalTool: null,

  init() {
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById("tool-directory-container");
    if (!container) return;

    const filtered = this.getFilteredTools();

    container.innerHTML = `
      <div class="directory-header">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge badge-cyan">Curated Knowledge Base</span>
            <h2 style="margin-top: 4px;">Audited Tools & Platforms (${filtered.length} Indexed)</h2>
            <p>Every tool record is verified against official product pricing and documentation pages.</p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-suggest-tool">
            + Report Price / Suggest Tool
          </button>
        </div>

        <!-- Search Bar -->
        <div class="search-input-wrapper">
          <svg class="search-icon-pos" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="directory-search-input" class="dir-search-input" placeholder="Search by name, capability (e.g. UPI, database, spaced repetition), or category..." value="${this.searchQuery}">
        </div>

        <!-- Category Filter Tabs -->
        <div class="category-tabs">
          ${CATEGORIES.map(cat => `
            <button class="cat-tab-btn ${this.selectedCategory === cat ? 'active' : ''}" data-category="${cat}">
              ${cat}
            </button>
          `).join("")}
        </div>
      </div>

      <!-- Tools Grid -->
      <div class="tools-grid">
        ${filtered.map(tool => `
          <div class="tool-card">
            <div>
              <div class="tool-card-top">
                <div>
                  <h3 style="font-size: 1.25rem;">${tool.name}</h3>
                  <span style="font-size: 0.75rem; color: var(--text-accent);">${tool.category} • ${tool.subCategory}</span>
                </div>
                <span class="badge ${tool.free_plan ? 'badge-emerald' : 'badge-cyan'}">
                  ${tool.free_plan ? 'Free Tier' : 'Paid'}
                </span>
              </div>
              <p style="font-size: 0.85rem; margin-top: 6px;">${tool.description}</p>
              
              <div class="tool-meta-tags">
                <span class="badge badge-indigo" style="font-size: 0.7rem;">Setup: ${tool.setup_time_estimate}</span>
                <span class="badge badge-amber" style="font-size: 0.7rem;">Curve: ${tool.learning_curve}</span>
              </div>
            </div>

            <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem; margin-top: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-accent-emerald);">
                  ${tool.starting_price === 0 ? 'Free (₹0)' : (tool.currency === 'INR' ? '₹' : '$') + tool.starting_price.toLocaleString() + ' / ' + tool.billing_cycle}
                </span>
                <span style="font-size: 0.7rem; color: var(--text-tertiary);">Verified ${tool.last_verified_at}</span>
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-secondary btn-sm btn-inspect-tool" data-tool-id="${tool.id}" style="flex: 1;">
                  Inspect Specs
                </button>
                <a href="${tool.official_url}" target="_blank" class="btn btn-outline btn-sm" title="Visit official site">↗</a>
              </div>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Tool Detail Modal -->
      <div id="tool-detail-modal" class="modal-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <h3 id="modal-tool-title">Tool Specs</h3>
            <button class="modal-close-btn" id="modal-tool-close">&times;</button>
          </div>
          <div id="modal-tool-body"></div>
        </div>
      </div>

      <!-- Correction Report Modal -->
      <div id="correction-modal" class="modal-overlay">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Report Data Correction</h3>
            <button class="modal-close-btn" id="modal-corr-close">&times;</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <p style="font-size: 0.85rem;">Help us keep our knowledge base accurate. Report any outdated pricing or changed platform features.</p>
            <div>
              <label style="font-size: 0.8rem; color: var(--text-tertiary);">Tool Name / Identifier</label>
              <input type="text" id="corr-tool-name" class="dir-search-input" style="padding: 8px 12px;" placeholder="e.g. Shopify, Supabase">
            </div>
            <div>
              <label style="font-size: 0.8rem; color: var(--text-tertiary);">Description of Outdated Fact</label>
              <textarea id="corr-description" class="query-textarea" style="border: 1px solid var(--border-medium); border-radius: 8px; padding: 8px; min-height: 80px;" placeholder="e.g. Price changed from ₹1,999 to ₹2,499 on official site."></textarea>
            </div>
            <div>
              <label style="font-size: 0.8rem; color: var(--text-tertiary);">Official Source Link (Optional)</label>
              <input type="url" id="corr-source-url" class="dir-search-input" style="padding: 8px 12px;" placeholder="https://...">
            </div>
            <button class="btn btn-primary" id="btn-submit-correction" style="margin-top: 8px;">Submit for Verification</button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  getFilteredTools() {
    return TOOL_DATABASE.filter(tool => {
      const matchesCategory = this.selectedCategory === "All" || tool.category.toLowerCase() === this.selectedCategory.toLowerCase();
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.features.some(f => f.toLowerCase().includes(q)) ||
        tool.use_cases.some(u => u.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById("directory-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }

    // Category Tabs
    document.querySelectorAll(".cat-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedCategory = btn.dataset.category;
        this.render();
      });
    });

    // Inspect Buttons
    document.querySelectorAll(".btn-inspect-tool").forEach(btn => {
      btn.addEventListener("click", () => {
        const toolId = btn.dataset.toolId;
        const tool = TOOL_DATABASE.find(t => t.id === toolId);
        if (tool) this.openToolModal(tool);
      });
    });

    // Modal Close
    const closeBtn = document.getElementById("modal-tool-close");
    const modal = document.getElementById("tool-detail-modal");
    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    }

    // Correction Modal
    const suggestBtn = document.getElementById("btn-suggest-tool");
    const corrModal = document.getElementById("correction-modal");
    const corrClose = document.getElementById("modal-corr-close");
    const submitCorrBtn = document.getElementById("btn-submit-correction");

    if (suggestBtn && corrModal) {
      suggestBtn.addEventListener("click", () => corrModal.classList.add("open"));
    }
    if (corrClose && corrModal) {
      corrClose.addEventListener("click", () => corrModal.classList.remove("open"));
    }
    if (submitCorrBtn) {
      submitCorrBtn.addEventListener("click", () => {
        const name = document.getElementById("corr-tool-name")?.value || "General";
        const desc = document.getElementById("corr-description")?.value || "";
        const url = document.getElementById("corr-source-url")?.value || "";
        if (desc.trim()) {
          WorkspaceStore.saveCorrectionReport("user_report", name, desc, url);
          alert("Thank you! Your correction has been submitted to the human review queue.");
          corrModal.classList.remove("open");
        }
      });
    }
  },

  openToolModal(tool) {
    const modal = document.getElementById("tool-detail-modal");
    const title = document.getElementById("modal-tool-title");
    const body = document.getElementById("modal-tool-body");
    if (!modal || !body) return;

    title.textContent = tool.name;
    body.innerHTML = `
      <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 1rem;">
        <p>${tool.description}</p>
        <div class="glass-panel" style="padding: 1rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>Starting Price:</strong> ${tool.starting_price === 0 ? 'Free' : (tool.currency === 'INR' ? '₹' : '$') + tool.starting_price + ' / ' + tool.billing_cycle}</div>
            <div><strong>Free Tier:</strong> ${tool.free_plan ? 'Yes' : 'No (' + tool.trial + ')'}</div>
            <div><strong>Setup Time:</strong> ${tool.setup_time_estimate}</div>
            <div><strong>Learning Curve:</strong> ${tool.learning_curve}</div>
          </div>
        </div>

        <div>
          <strong style="color: var(--text-accent-emerald);">Core Features:</strong>
          <ul style="padding-left: 18px; margin-top: 4px;">
            ${tool.features.map(f => `<li>${f}</li>`).join("")}
          </ul>
        </div>

        <div>
          <strong style="color: var(--text-accent-amber);">Trade-offs & Limitations:</strong>
          <ul style="padding-left: 18px; margin-top: 4px; color: var(--text-secondary);">
            ${tool.tradeoffs.map(to => `<li>${to}</li>`).join("")}
          </ul>
        </div>

        <div style="border-top: 1px solid var(--border-subtle); padding-top: 10px;">
          <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 6px;">Last Verified: ${tool.last_verified_at}</div>
          <div style="display: flex; gap: 8px;">
            <a href="${tool.official_url}" target="_blank" class="btn btn-primary btn-sm">Official Website ↗</a>
            <a href="${tool.pricing_url}" target="_blank" class="btn btn-secondary btn-sm">Pricing Page ↗</a>
            <a href="${tool.docs_url}" target="_blank" class="btn btn-outline btn-sm">Docs ↗</a>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("open");
  }
};
