/**
 * Search.ai Navigation & Tab Controller
 */

export const Navigation = {
  currentTab: "landing",

  init() {
    const tabButtons = document.querySelectorAll(".nav-tab-btn");
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        this.switchTab(target);
      });
    });

    // Logo brand click -> Landing
    const brandLogo = document.getElementById("brand-logo-btn");
    if (brandLogo) {
      brandLogo.addEventListener("click", () => this.switchTab("landing"));
    }
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update active tab buttons
    document.querySelectorAll(".nav-tab-btn").forEach(btn => {
      if (btn.dataset.target === tabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update visible view section
    document.querySelectorAll(".view-section").forEach(sec => {
      if (sec.id === `view-${tabId}`) {
        sec.classList.add("active");
      } else {
        sec.classList.remove("active");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
