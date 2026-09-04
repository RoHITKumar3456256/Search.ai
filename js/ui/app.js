/**
 * Search.ai Application Orchestrator & Bootstrap (PRD Compliant)
 */

import { AuthStore } from '../state/authState.js';
import { Navigation } from './navigation.js';
import { AskFlowUI } from './askFlow.js';
import { ComparisonViewUI } from './comparisonView.js';
import { ToolDirectoryUI } from './toolDirectory.js';
import { WorkspaceViewUI } from './workspaceView.js';
import { PricingViewUI } from './pricingView.js';

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Views
  Navigation.init();
  AskFlowUI.init();
  ComparisonViewUI.init();
  ToolDirectoryUI.init();
  WorkspaceViewUI.init();
  PricingViewUI.init();

  // 2. Setup Auth & Profile UI
  setupAuthControls();

  // 3. Setup Language Switcher
  setupLanguageSwitcher();

  // 4. Setup Custom Weights Modal
  setupWeightsTunerModal();

  console.log("Search.ai Decision Intelligence Engine Initialized — PRD v1.0 Ready.");
});

function setupAuthControls() {
  const user = AuthStore.getUser();
  const authStatusPill = document.getElementById("header-auth-status");
  const authModal = document.getElementById("auth-modal");
  const authClose = document.getElementById("modal-auth-close");
  const mockGoogleBtn = document.getElementById("btn-auth-google");
  const magicLinkBtn = document.getElementById("btn-auth-magic");
  const emailInput = document.getElementById("auth-email-input");

  function updateHeader() {
    const u = AuthStore.getUser();
    if (authStatusPill) {
      if (u.isAuthenticated) {
        authStatusPill.innerHTML = `
          <div style="display: flex; align-items: center; gap: 6px; cursor: pointer;" id="btn-user-profile">
            <span class="badge badge-emerald">Pro Active</span>
            <span style="font-size: 0.8rem; font-weight: 600; color: #ffffff;">${u.email.split('@')[0]}</span>
          </div>
        `;
      } else {
        authStatusPill.innerHTML = `
          <button class="btn btn-secondary btn-sm" id="btn-open-login">
            Sign In / Sign Up
          </button>
        `;
      }

      // Re-bind click
      const openLogin = document.getElementById("btn-open-login");
      if (openLogin && authModal) {
        openLogin.addEventListener("click", () => authModal.classList.add("open"));
      }
      const userProf = document.getElementById("btn-user-profile");
      if (userProf) {
        userProf.addEventListener("click", () => {
          if (confirm(`Logged in as ${u.email} (${u.plan} plan). Would you like to log out?`)) {
            AuthStore.logout();
            updateHeader();
          }
        });
      }
    }
  }

  updateHeader();

  if (authClose && authModal) {
    authClose.addEventListener("click", () => authModal.classList.remove("open"));
  }

  if (mockGoogleBtn) {
    mockGoogleBtn.addEventListener("click", () => {
      AuthStore.login("founder.demo@google.com", "Google User");
      if (authModal) authModal.classList.remove("open");
      updateHeader();
    });
  }

  if (magicLinkBtn) {
    magicLinkBtn.addEventListener("click", () => {
      const email = emailInput?.value?.trim() || "student.indie@search.ai";
      AuthStore.login(email, email.split("@")[0]);
      if (authModal) authModal.classList.remove("open");
      updateHeader();
    });
  }
}

function setupLanguageSwitcher() {
  const langSelect = document.getElementById("header-lang-select");
  if (langSelect) {
    const user = AuthStore.getUser();
    langSelect.value = user.language || "English";

    langSelect.addEventListener("change", (e) => {
      AuthStore.setLanguage(e.target.value);
    });
  }
}

function setupWeightsTunerModal() {
  const modal = document.getElementById("weights-tuner-modal");
  const closeBtn = document.getElementById("modal-weights-close");
  const openBtn = document.getElementById("btn-open-weights-tuner");

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => modal.classList.add("open"));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  }
}
