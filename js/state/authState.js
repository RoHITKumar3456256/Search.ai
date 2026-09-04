/**
 * Search.ai Authentication & Preferences State (PRD Section 6.2)
 * Manages user profile, preferred language, regional default currency, and consent.
 */

const AUTH_STORAGE_KEY = "searchai_auth_user";

export const AuthStore = {
  getUser() {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) {
      const defaultGuest = {
        isAuthenticated: false,
        name: "Founder / Explorer",
        email: "demo.student@search.ai",
        language: "English", // "English" | "Hindi" | "Hinglish"
        country: "India",
        currency: "INR",
        defaultSkill: "Beginner",
        defaultBudget: "Under ₹10,000",
        plan: "Free", // "Free" | "Plus" | "Pro" | "Teams"
        queriesRemainingToday: 10,
        consentedToAI: true
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultGuest));
      return defaultGuest;
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      return { isAuthenticated: false, plan: "Free" };
    }
  },

  setUser(profile) {
    const current = this.getUser();
    const updated = { ...current, ...profile };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  login(email, name = "Founder") {
    return this.setUser({
      isAuthenticated: true,
      email,
      name,
      plan: "Plus" // Pro student experience unlocked in demo
    });
  },

  logout() {
    return this.setUser({
      isAuthenticated: false,
      name: "Guest Explorer",
      email: "",
      plan: "Free"
    });
  },

  setLanguage(language) {
    return this.setUser({ language });
  }
};
