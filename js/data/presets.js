/**
 * Search.ai Example & Preset Queries
 * Includes English, Hindi, and Hinglish decision questions from the PRD
 */

export const PRESET_QUERIES = [
  {
    id: "preset_business_1",
    language: "English",
    label: "Launch Online Store under ₹10,000",
    query: "I want to start an online business under ₹10,000 and I have no coding experience.",
    domain: "Business",
    suggestedContext: {
      budget: "Under ₹10,000",
      skill: "Beginner",
      priority: "Fast Launch & Low Cost",
      location: "India",
      timeframe: "7 Days"
    }
  },
  {
    id: "preset_business_hinglish",
    language: "Hinglish",
    label: "Bakery Store Online Setup (Hinglish)",
    query: "Meri local bakery shop ke liye online ordering aur WhatsApp UPI payments setup karni hai kam kharche me.",
    domain: "Business",
    suggestedContext: {
      budget: "Under ₹5,000",
      skill: "Beginner",
      priority: "Ease of Use",
      location: "India",
      timeframe: "3 Days"
    }
  },
  {
    id: "preset_edu_1",
    language: "English",
    label: "Exam Preparation & Spaced Memory",
    query: "How should I prepare for competitive exams with high volume memorization on a student budget?",
    domain: "Education",
    suggestedContext: {
      budget: "Free / ₹0",
      skill: "Beginner",
      priority: "Retention & Evidence",
      location: "Global",
      timeframe: "1-3 Months"
    }
  },
  {
    id: "preset_edu_hindi",
    language: "Hindi",
    label: "विद्यार्थी के लिए फ्री स्टडी प्लान (Hindi)",
    query: "कॉलेज की पढ़ाई और नोट्स ऑर्गनाइज़ करने के लिए सबसे अच्छे फ्री टूल्स और 7-दिन का स्टडी प्लान चाहिए।",
    domain: "Education",
    suggestedContext: {
      budget: "Free / ₹0",
      skill: "Beginner",
      priority: "Cost (Free First)",
      location: "India",
      timeframe: "7 Days"
    }
  },
  {
    id: "preset_career_1",
    language: "English",
    label: "Start Freelancing as a Designer / Dev",
    query: "What tools do I need to start freelancing, send client contracts, and build a portfolio without high fees?",
    domain: "Career",
    suggestedContext: {
      budget: "Free / Low Cost",
      skill: "Intermediate",
      priority: "0% Commission & Speed",
      location: "Global",
      timeframe: "14 Days"
    }
  },
  {
    id: "preset_tech_1",
    language: "English",
    label: "SaaS MVP Tech Stack for Indie Hacker",
    query: "How do I launch a full-stack SaaS MVP cheaply with authentication, relational database, and auto-deploy?",
    domain: "Technology",
    suggestedContext: {
      budget: "Under ₹2,000/mo ($25)",
      skill: "Intermediate",
      priority: "Developer Velocity & Scalability",
      location: "Global",
      timeframe: "14 Days"
    }
  },
  {
    id: "preset_crm_sales",
    language: "English",
    label: "Sales CRM for 3-Person Team",
    query: "Which CRM fits a 3-person sales team to track pipeline deals and send email tracking without high monthly costs?",
    domain: "Business",
    suggestedContext: {
      budget: "Free / Low Cost",
      skill: "Beginner",
      priority: "Ease of Use",
      location: "Global",
      timeframe: "Under 1 Day"
    }
  },
  {
    id: "preset_finance_1",
    language: "Hinglish",
    label: "Monthly Budget & Roommate Split (Hinglish)",
    query: "Roommates ke sath flat rent aur bills split karne aur monthly 50-30-20 budget manage karne ke safe tools batao.",
    domain: "Finance",
    suggestedContext: {
      budget: "Free / ₹0",
      skill: "Beginner",
      priority: "Privacy & Zero Cost",
      location: "India",
      timeframe: "Immediate"
    }
  }
];
