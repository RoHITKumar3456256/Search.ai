/**
 * Search.ai Natural Language Query & Context Parser (PRD Sections 6.3 & 8)
 * Robust multi-lingual pattern detection for English, Hindi, and Hinglish.
 */

import { checkSafetyPolicies } from '../data/safetyPolicies.js';

export function parseNaturalLanguageQuery(rawQuery = "", userOverrides = {}) {
  const text = rawQuery.trim();
  const lower = text.toLowerCase();

  // 1. Language Detection
  let detectedLanguage = "English";
  const hindiChars = /[\u0900-\u097F]/;
  const hinglishKeywords = ["chahiye", "karna hai", "kaise", "kya", "paisa", "kharcha", "bina", "dukan", "shuru", "padhai", "kitna", "sasta", "kam"];

  if (hindiChars.test(text)) {
    detectedLanguage = "Hindi";
  } else if (hinglishKeywords.some(kw => lower.includes(kw))) {
    detectedLanguage = "Hinglish";
  }

  // 2. Domain Intent Classification
  let detectedDomain = "General";
  const domainKeywords = {
    Business: ["store", "ecommerce", "e-commerce", "shop", "bakery", "business", "crm", "sales", "inventory", "order", "dukaan", "billing", "gst", "vyapar", "selling", "products", "leads", "revenue"],
    Education: ["study", "exam", "neet", "jee", "upsc", "flashcard", "notes", "anki", "memorize", "padhai", "college", "course", "syllabus", "student", "math", "revision", "pomodoro"],
    Career: ["freelance", "freelancing", "portfolio", "resume", "cv", "client", "contract", "upwork", "proposal", "interview", "hire", "naukri", "job", "remote", "developer portfolio", "pitch"],
    Technology: ["saas", "tech stack", "database", "backend", "frontend", "next.js", "react", "deploy", "hosting", "supabase", "firebase", "api", "cloud", "serverless", "mvp", "app builder", "code", "no-code"],
    Productivity: ["todo", "task", "habits", "sprint", "kanban", "time blocking", "organize", "linear", "jira", "focus", "planner", "agenda", "project management"],
    Finance: ["budget", "expense", "split", "roommate", "bills", "sheets", "investing", "taxation", "money", "savings", "kharcha", "50/30/20", "cashflow"],
    Marketing: ["social media", "schedule", "linkedin", "twitter", "email newsletter", "testimonials", "plausible", "analytics", "traffic", "subscribers", "whatsapp marketing", "buffer", "canva"]
  };

  for (const [dom, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some(kw => lower.includes(kw))) {
      detectedDomain = dom;
      break;
    }
  }

  // 3. Budget Extraction
  let detectedBudget = "Flexible";
  let maxNumericBudget = null;

  const inrMatch = lower.match(/(?:rs\.?|inr|₹|under\s*₹?)\s*([\d,]+)/i);
  const usdMatch = lower.match(/(?:\$|usd)\s*([\d,]+)/i);

  if (lower.includes("free") || lower.includes("0 cost") || lower.includes("bina paise") || lower.includes("zero budget") || lower.includes("sasta") || lower.includes("₹0")) {
    detectedBudget = "Free (₹0)";
    maxNumericBudget = 0;
  } else if (inrMatch) {
    const amount = parseInt(inrMatch[1].replace(/,/g, ""), 10);
    maxNumericBudget = amount;
    detectedBudget = `Under ₹${amount.toLocaleString()}`;
  } else if (usdMatch) {
    const amount = parseInt(usdMatch[1].replace(/,/g, ""), 10);
    maxNumericBudget = amount * 85; // Approx INR conversion
    detectedBudget = `Under $${amount}/mo (~₹${maxNumericBudget.toLocaleString()})`;
  } else if (lower.includes("low cost") || lower.includes("cheap") || lower.includes("kam kharcha") || lower.includes("student budget")) {
    detectedBudget = "Low Cost (< ₹1,500/mo)";
    maxNumericBudget = 1500;
  }

  // 4. Skill Level Extraction
  let detectedSkill = "Beginner";
  if (lower.includes("no code") || lower.includes("bina code") || lower.includes("no coding") || lower.includes("non-tech") || lower.includes("beginner") || lower.includes("easy")) {
    detectedSkill = "Beginner (No-Code)";
  } else if (lower.includes("developer") || lower.includes("full-stack") || lower.includes("engineer") || lower.includes("code") || lower.includes("api") || lower.includes("advanced") || lower.includes("terminal")) {
    detectedSkill = "Technical / Dev";
  } else if (lower.includes("intermediate") || lower.includes("some experience")) {
    detectedSkill = "Intermediate";
  }

  // 5. Region/Location Extraction
  let detectedLocation = "India";
  if (lower.includes("us") || lower.includes("usa") || lower.includes("europe") || lower.includes("global") || lower.includes("worldwide") || lower.includes("international")) {
    detectedLocation = "Global";
  }

  // 6. Priority Extraction
  let detectedPriority = "Balanced Fit & Value";
  if (lower.includes("fast") || lower.includes("quick") || lower.includes("instant") || lower.includes("jaldi") || lower.includes("today")) {
    detectedPriority = "Speed & Quick Setup";
  } else if (lower.includes("privacy") || lower.includes("offline") || lower.includes("open source") || lower.includes("self-hosted") || lower.includes("data ownership")) {
    detectedPriority = "Privacy & Open Source";
  } else if (lower.includes("cheap") || lower.includes("sasta") || lower.includes("free") || lower.includes("low cost")) {
    detectedPriority = "Lowest Cost (Free First)";
  } else if (lower.includes("scale") || lower.includes("enterprise") || lower.includes("future proof") || lower.includes("expand")) {
    detectedPriority = "Scalability & Integrations";
  }

  // 7. Timeframe Extraction
  let detectedTimeframe = "7 Days";
  if (lower.includes("today") || lower.includes("1 day") || lower.includes("hours") || lower.includes("instant")) {
    detectedTimeframe = "24 Hours";
  } else if (lower.includes("month") || lower.includes("semester") || lower.includes("long term")) {
    detectedTimeframe = "1-3 Months";
  } else if (lower.includes("14 days") || lower.includes("2 weeks")) {
    detectedTimeframe = "14 Days";
  }

  // Check high-stakes policies
  const safetyStatus = checkSafetyPolicies(text);

  // Compile context with user overrides applied
  const context = {
    domain: userOverrides.domain || detectedDomain,
    language: detectedLanguage,
    budget: userOverrides.budget || detectedBudget,
    maxNumericBudget: userOverrides.maxNumericBudget !== undefined ? userOverrides.maxNumericBudget : maxNumericBudget,
    skill: userOverrides.skill || detectedSkill,
    location: userOverrides.location || detectedLocation,
    priority: userOverrides.priority || detectedPriority,
    timeframe: userOverrides.timeframe || detectedTimeframe,
    riskTolerance: userOverrides.riskTolerance || "Low (Safe defaults)",
    safety: safetyStatus
  };

  // Generate 2-3 contextual clarifying questions
  const clarifyingQuestions = generateClarifyingQuestions(context, text);

  return {
    rawQuery: text,
    normalizedGoal: restateGoal(text, context),
    context,
    clarifyingQuestions
  };
}

function restateGoal(text, context) {
  if (!text) return "Analyze optimal software and workflow options tailored to your constraints.";
  // Structured restatement per PRD
  return `Find the best ${context.domain.toLowerCase()} solutions matching budget constraint [${context.budget}], skill requirement [${context.skill}], and targeted launch within [${context.timeframe}].`;
}

function generateClarifyingQuestions(context, rawText) {
  const questions = [];

  if (context.domain === "Business") {
    questions.push({
      id: "q_biz_type",
      question: "Are you selling physical items (with shipping) or digital downloads / services?",
      options: ["Physical goods (Need Indian courier & UPI)", "Digital files / SaaS (Global cards & instant delivery)", "Local service / Invoicing only"]
    });
    questions.push({
      id: "q_biz_speed",
      question: "What is your highest operational priority for the launch?",
      options: ["Fastest 1-day launch with zero setup hassle", "Zero monthly subscription fee (Pay per transaction)", "Maximum future branding & customization"]
    });
  } else if (context.domain === "Education") {
    questions.push({
      id: "q_edu_device",
      question: "Which primary device do you study on?",
      options: ["Android phone + Laptop (Need multi-sync)", "iPad / iPhone / Mac", "Purely offline laptop / PC"]
    });
    questions.push({
      id: "q_edu_target",
      question: "What is the primary exam or learning goal?",
      options: ["High-stakes memorization (UPSC / NEET / GRE)", "General semester GPA & lecture notes", "Conceptual clarity in Math / Coding"]
    });
  } else if (context.domain === "Career") {
    questions.push({
      id: "q_career_role",
      question: "What type of freelance or career role are you establishing?",
      options: ["Software / Web Developer", "UI/UX & Graphic Designer", "Content Writer / Marketer / Consultant"]
    });
  } else if (context.domain === "Technology") {
    questions.push({
      id: "q_tech_stack",
      question: "What level of custom coding will you be doing?",
      options: ["Modern Full-Stack (Next.js / TypeScript / React)", "Backend API & Database only (Node / Python / PostgreSQL)", "100% No-Code / Visual App Builder"]
    });
  } else {
    questions.push({
      id: "q_gen_priority",
      question: "What is your main decision criteria?",
      options: ["Lowest cost (100% Free / Open source)", "Easiest to learn without prior experience", "Industry standard with widest community support"]
    });
  }

  return questions;
}
