/**
 * Search.ai Pricing & Monetization View (PRD Section 12)
 * Transparent subscription plans, student discount verifications, and quota management.
 */

export const PricingViewUI = {
  isAnnual: false,

  init() {
    this.render();
  },

  render() {
    const container = document.getElementById("pricing-container");
    if (!container) return;

    container.innerHTML = `
      <div class="pricing-header">
        <span class="badge badge-cyan">Transparent Pricing</span>
        <h2 style="font-size: 2.5rem; margin-top: 6px;">Simple, Transparent Plans for Every Decision Maker</h2>
        <p style="max-width: 600px; margin: 0 auto;">
          Grounded evidence without marketing fluff. Choose a tier tailored to your workflow.
        </p>

        <!-- Billing Toggle -->
        <div class="billing-toggle-container">
          <span style="font-size: 0.85rem; color: ${!this.isAnnual ? '#ffffff; font-weight: 700;' : 'var(--text-secondary);'}">Monthly</span>
          <button id="pricing-billing-switch" class="btn btn-secondary btn-sm" style="padding: 4px 10px; border-radius: var(--radius-full);">
            ${this.isAnnual ? 'Switch to Monthly' : 'Switch to Annual (Save ~30%)'}
          </button>
          <span style="font-size: 0.85rem; color: ${this.isAnnual ? '#ffffff; font-weight: 700;' : 'var(--text-secondary);'}">Annual <span class="badge badge-emerald" style="font-size: 0.65rem;">SAVE 30%</span></span>
        </div>
      </div>

      <!-- Student Plan Hero Banner -->
      <div class="glass-panel" style="border: 1px solid rgba(52, 211, 153, 0.3); background: rgba(52, 211, 153, 0.05); padding: 1.25rem 1.75rem; border-radius: var(--radius-lg); margin-bottom: 2.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="font-size: 1.8rem;">🎓</div>
          <div>
            <h4 style="color: #ffffff;">Verified Student & Educator Program</h4>
            <p style="font-size: 0.85rem; margin: 0;">Get 50% discount on Search.ai Plus with any valid college / school ID or .edu email.</p>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="alert('Student verification active: You have full access in this demo environment!')">
          Verify Student Status
        </button>
      </div>

      <!-- Pricing Tier Cards Grid -->
      <div class="pricing-grid">
        <!-- 1. Free -->
        <div class="pricing-tier-card">
          <div>
            <span class="badge badge-cyan">Starter</span>
            <h3 style="margin-top: 6px;">Free</h3>
            <p style="font-size: 0.82rem;">For students and casual decision makers.</p>
            <div class="tier-price-amount">₹0</div>
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">Free forever, no credit card</span>

            <ul class="tier-features-list">
              <li>✓ 10 standard questions / day</li>
              <li>✓ 3 deep comparisons / month</li>
              <li>✓ Basic verified sources</li>
              <li>✓ 10 saved decisions in workspace</li>
              <li>✓ 7-Day Action Plan generator</li>
            </ul>
          </div>
          <button class="btn btn-outline" style="width: 100%;" onclick="alert('You are currently exploring on the Free tier!')">Current Plan</button>
        </div>

        <!-- 2. Plus (Featured) -->
        <div class="pricing-tier-card featured">
          <div class="popular-badge-ribbon">MOST POPULAR</div>
          <div>
            <span class="badge badge-emerald">Freelancer & Pro</span>
            <h3 style="margin-top: 6px;">Plus</h3>
            <p style="font-size: 0.82rem;">For creators, indie builders, and power users.</p>
            <div class="tier-price-amount">${this.isAnnual ? '₹208' : '₹299'}<span style="font-size: 0.9rem; font-weight: 500; color: var(--text-tertiary);">/mo</span></div>
            <span style="font-size: 0.75rem; color: var(--text-accent-emerald);">${this.isAnnual ? 'Billed ₹2,499 annually' : 'Billed monthly'}</span>

            <ul class="tier-features-list">
              <li>✓ <strong>Unlimited</strong> standard questions</li>
              <li>✓ 100 deep comparisons / month</li>
              <li>✓ Full side-by-side matrix with 12 criteria</li>
              <li>✓ Unlimited workspace saves & projects</li>
              <li>✓ Markdown & PDF decision export</li>
              <li>✓ Source freshness audit reports</li>
            </ul>
          </div>
          <button class="btn btn-primary" style="width: 100%;" onclick="alert('Unlocked! You are on full Pro features in this environment.')">Upgrade to Plus</button>
        </div>

        <!-- 3. Pro -->
        <div class="pricing-tier-card">
          <div>
            <span class="badge badge-indigo">Founders</span>
            <h3 style="margin-top: 6px;">Pro</h3>
            <p style="font-size: 0.82rem;">For startups, founders, and consultants.</p>
            <div class="tier-price-amount">${this.isAnnual ? '₹583' : '₹799'}<span style="font-size: 0.9rem; font-weight: 500; color: var(--text-tertiary);">/mo</span></div>
            <span style="font-size: 0.75rem; color: var(--text-accent-emerald);">${this.isAnnual ? 'Billed ₹6,999 annually' : 'Billed monthly'}</span>

            <ul class="tier-features-list">
              <li>✓ 500 deep comparisons / month</li>
              <li>✓ Advanced ROI & budget scenario modeling</li>
              <li>✓ Private unlisted projects</li>
              <li>✓ Priority evidence synthesis</li>
              <li>✓ Custom criteria weights tuning</li>
            </ul>
          </div>
          <button class="btn btn-secondary" style="width: 100%;" onclick="alert('Contact sales or subscribe via Razorpay / Stripe integration.')">Start Pro Trial</button>
        </div>

        <!-- 4. Teams -->
        <div class="pricing-tier-card">
          <div>
            <span class="badge badge-amber">Collaborative</span>
            <h3 style="margin-top: 6px;">Teams</h3>
            <p style="font-size: 0.82rem;">For fast-moving small teams & agencies.</p>
            <div class="tier-price-amount">₹1,499<span style="font-size: 0.9rem; font-weight: 500; color: var(--text-tertiary);">/seat/mo</span></div>
            <span style="font-size: 0.75rem; color: var(--text-tertiary);">Billed monthly per member</span>

            <ul class="tier-features-list">
              <li>✓ Shared team decision rooms</li>
              <li>✓ Collaborative comments & voting</li>
              <li>✓ Team shortlists & vendor management</li>
              <li>✓ Admin usage analytics & audit trail</li>
            </ul>
          </div>
          <button class="btn btn-outline" style="width: 100%;" onclick="alert('Contact sales for team provisioning.')">Contact Teams Sales</button>
        </div>
      </div>

      <!-- Responsible Monetization Notice (PRD Section 6.5 & 10) -->
      <div class="glass-panel" style="padding: 1.5rem; text-align: center; max-width: 800px; margin: 0 auto;">
        <h4 style="color: var(--text-primary); margin-bottom: 6px;">Our Trust & Transparency Commitment</h4>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 0;">
          Search.ai never sells rankings or disguises advertisements as organic recommendations. Any affiliate links or sponsored placements are visibly disclosed and cannot override objective fit scoring.
        </p>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents() {
    const switchBtn = document.getElementById("pricing-billing-switch");
    if (switchBtn) {
      switchBtn.addEventListener("click", () => {
        this.isAnnual = !this.isAnnual;
        this.render();
      });
    }
  }
};
