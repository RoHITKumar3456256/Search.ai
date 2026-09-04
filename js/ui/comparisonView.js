/**
 * Search.ai Side-by-Side Comparison Matrix (PRD Section 6.6)
 * Compares up to 5 tools across 12 standardized criteria with active filter chips.
 */

import { TOOL_DATABASE } from '../data/toolDatabase.js';

export const ComparisonViewUI = {
  selectedToolIds: ["tool_shopify", "tool_dukaan", "tool_woocommerce"],
  activeFilters: new Set(),

  init() {
    this.render();
    this.bindEvents();
  },

  render() {
    const container = document.getElementById("comparison-matrix-container");
    if (!container) return;

    const tools = this.getSelectedTools();

    container.innerHTML = `
      <div class="matrix-container">
        <div class="matrix-toolbar">
          <div>
            <span class="badge badge-cyan">Side-by-Side Decision Matrix</span>
            <h3 style="margin-top: 4px;">Comparative Architecture & Trade-offs</h3>
            <p style="font-size: 0.82rem;">Direct audit of pricing, features, limitations, and verification dates.</p>
          </div>
          
          <!-- Tool Selection Selector -->
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <select id="matrix-add-tool-select" class="context-select" style="background: var(--bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-medium);">
              <option value="">+ Add Tool to Compare (Max 5)</option>
              ${TOOL_DATABASE.filter(t => !this.selectedToolIds.includes(t.id)).map(t => `
                <option value="${t.id}">${t.name} (${t.category})</option>
              `).join("")}
            </select>
          </div>
        </div>

        <!-- Filter Chips Row (PRD Section 6.6) -->
        <div style="margin-bottom: 1.25rem;">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-tertiary); font-weight: 700; margin-bottom: 6px;">
            Quick Criteria Filters
          </div>
          <div class="filter-chips-row">
            <button class="filter-chip-btn ${this.activeFilters.has('free') ? 'active' : ''}" data-filter="free">Free First</button>
            <button class="filter-chip-btn ${this.activeFilters.has('beginner') ? 'active' : ''}" data-filter="beginner">Beginner Friendly</button>
            <button class="filter-chip-btn ${this.activeFilters.has('india') ? 'active' : ''}" data-filter="india">India / Local Support</button>
            <button class="filter-chip-btn ${this.activeFilters.has('nocode') ? 'active' : ''}" data-filter="nocode">No-Code</button>
            <button class="filter-chip-btn ${this.activeFilters.has('opensource') ? 'active' : ''}" data-filter="opensource">Open-Source / Privacy</button>
            <button class="filter-chip-btn ${this.activeFilters.has('fastsetup') ? 'active' : ''}" data-filter="fastsetup">Setup < 1 Day</button>
          </div>
        </div>

        <!-- Comparison Table -->
        <div class="matrix-table-wrapper">
          <table class="matrix-table">
            <thead>
              <tr>
                <th style="min-width: 160px; background: var(--bg-surface-active);">Criteria</th>
                ${tools.map(t => `
                  <th style="min-width: 220px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <div style="font-size: 1.1rem; font-weight: 800; color: #ffffff;">${t.name}</div>
                        <div style="font-size: 0.72rem; color: var(--text-accent);">${t.subCategory}</div>
                      </div>
                      ${this.selectedToolIds.length > 2 ? `
                        <button class="btn-remove-matrix-col" data-tool-id="${t.id}" style="background: transparent; border: none; color: var(--text-tertiary); cursor: pointer; font-size: 1rem;">×</button>
                      ` : ''}
                    </div>
                  </th>
                `).join("")}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Best For</strong></td>
                ${tools.map(t => `<td><span style="color: #ffffff; font-weight: 500;">${t.best_for}</span></td>`).join("")}
              </tr>
              <tr>
                <td><strong>Starting Price</strong></td>
                ${tools.map(t => `<td><strong style="color: var(--text-accent-emerald);">${t.starting_price === 0 ? 'Free / ₹0' : (t.currency === 'INR' ? '₹' : '$') + t.starting_price.toLocaleString() + ' / ' + t.billing_cycle}</strong></td>`).join("")}
              </tr>
              <tr>
                <td><strong>Free Plan / Trial</strong></td>
                ${tools.map(t => `<td>${t.free_plan ? '<span class="badge badge-emerald">Free Tier Available</span>' : '<span class="badge badge-amber">' + t.trial + '</span>'}</td>`).join("")}
              </tr>
              <tr>
                <td><strong>Setup Time</strong></td>
                ${tools.map(t => `<td>${t.setup_time_estimate}</td>`).join("")}
              </tr>
              <tr>
                <td><strong>Learning Curve</strong></td>
                ${tools.map(t => `<td><span class="badge ${t.learning_curve.includes('Low') ? 'badge-cyan' : 'badge-amber'}">${t.learning_curve}</span></td>`).join("")}
              </tr>
              <tr>
                <td><strong>Core Features</strong></td>
                ${tools.map(t => `<td><ul style="padding-left: 16px; font-size: 0.8rem; margin: 0;">${t.features.slice(0, 4).map(f => `<li>${f}</li>`).join("")}</ul></td>`).join("")}
              </tr>
              <tr>
                <td><strong>Limitations / Trade-offs</strong></td>
                ${tools.map(t => `<td><ul style="padding-left: 16px; font-size: 0.8rem; color: var(--text-secondary); margin: 0;">${t.tradeoffs.map(to => `<li>${to}</li>`).join("")}</ul></td>`).join("")}
              </tr>
              <tr>
                <td><strong>Region & Payments</strong></td>
                ${tools.map(t => `<td>${t.countries_supported.join(", ")}</td>`).join("")}
              </tr>
              <tr>
                <td><strong>Privacy & Security</strong></td>
                ${tools.map(t => `<td style="font-size: 0.78rem;">${t.privacy_security_notes}</td>`).join("")}
              </tr>
              <tr>
                <td><strong>Primary Sources & Date</strong></td>
                ${tools.map(t => `
                  <td>
                    <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 4px;">Verified: ${t.last_verified_at}</div>
                    <a href="${t.official_url}" target="_blank" style="font-size: 0.75rem;">Official Docs ↗</a>
                  </td>
                `).join("")}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.bindEvents();
  },

  getSelectedTools() {
    let list = TOOL_DATABASE.filter(t => this.selectedToolIds.includes(t.id));
    
    // Apply quick filters if active
    if (this.activeFilters.has("free")) {
      list = list.filter(t => t.free_plan);
    }
    if (this.activeFilters.has("beginner")) {
      list = list.filter(t => t.learning_curve.toLowerCase().includes("low"));
    }
    if (this.activeFilters.has("india")) {
      list = list.filter(t => t.countries_supported.includes("India") || t.currency === "INR");
    }
    if (this.activeFilters.has("fastsetup")) {
      list = list.filter(t => t.setup_time_estimate.toLowerCase().includes("hour") || t.setup_time_estimate.toLowerCase().includes("under"));
    }

    return list.length > 0 ? list : TOOL_DATABASE.filter(t => this.selectedToolIds.includes(t.id));
  },

  bindEvents() {
    // Add Tool Selector
    const addSelect = document.getElementById("matrix-add-tool-select");
    if (addSelect) {
      addSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val && !this.selectedToolIds.includes(val) && this.selectedToolIds.length < 5) {
          this.selectedToolIds.push(val);
          this.render();
        }
      });
    }

    // Remove Column Buttons
    document.querySelectorAll(".btn-remove-matrix-col").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.toolId;
        this.selectedToolIds = this.selectedToolIds.filter(tid => tid !== id);
        this.render();
      });
    });

    // Filter Buttons
    document.querySelectorAll(".filter-chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        if (this.activeFilters.has(filter)) {
          this.activeFilters.delete(filter);
        } else {
          this.activeFilters.add(filter);
        }
        this.render();
      });
    });
  },

  setToolsToCompare(toolIds) {
    this.selectedToolIds = toolIds.slice(0, 5);
    this.render();
  }
};
