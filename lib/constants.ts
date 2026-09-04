export const APP_NAME = "Search.ai";
export const APP_DESCRIPTION = "Turn uncertainty into your next best move. Evidence-grounded AI decision briefs.";

export const DEFAULT_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["en", "hi", "hinglish"] as const;

export const PLAN_LIMITS = {
  free: { standardDaily: 10, deepMonthly: 3 },
  plus: { standardDaily: 100, deepMonthly: 100 },
  pro: { standardDaily: 500, deepMonthly: 500 },
  teams: { standardDaily: 2000, deepMonthly: 2000 },
} as const;

export const PROMPT_VERSION = "v1.0.0";
