/**
 * Search.ai Action Plan & Checklist Generator (PRD Sections 4 & 6.7)
 * Generates tailored, time-boxed 3 to 7-day execution roadmaps.
 */

export function generateActionPlan(recommendedTool, context) {
  const toolName = recommendedTool.name;
  const domain = context.domain;

  const steps = [
    {
      day: "Day 1",
      title: "Account Setup & Baseline Configuration",
      description: `Create account on ${toolName} and complete initial onboarding verification (KYC/Auth).`,
      tasks: [
        `Register at official portal (${recommendedTool.official_url})`,
        `Configure default currency and regional settings (${context.location})`,
        `Set up secure 2-Factor Authentication (2FA) for workspace access`
      ],
      completed: false
    },
    {
      day: "Day 2",
      title: "Core Template & Integration Connection",
      description: `Connect foundational tools and configure primary workflows.`,
      tasks: [
        `Select recommended starter template for ${domain.toLowerCase()} use cases`,
        `Connect primary payment gateway or communication channels (e.g. Razorpay / WhatsApp / Google Drive)`,
        `Run test transaction or sample workflow validation`
      ],
      completed: false
    },
    {
      day: "Day 3",
      title: "Data Population & Initial Assets",
      description: `Upload your core catalog, flashcard decks, code repositories, or client service list.`,
      tasks: [
        `Import first 5-10 items / notes / project assets`,
        `Configure custom domain or public profile link`,
        `Review mobile app accessibility on smartphone`
      ],
      completed: false
    },
    {
      day: "Day 4",
      title: "Quality Review & Boundary Check",
      description: `Verify pricing transparency, speed, and privacy compliance.`,
      tasks: [
        `Check for any hidden fees, platform limits, or bandwidth thresholds`,
        `Test customer / user experience on a 360px mobile screen`,
        `Backup initial workspace settings and configurations`
      ],
      completed: false
    },
    {
      day: "Day 5-7",
      title: "Live Launch & Feedback Loop",
      description: `Share with your initial target users and track key milestones.`,
      tasks: [
        `Share live link with first 5-10 trusted testers/customers`,
        `Collect initial feedback and note necessary workflow refinements`,
        `Schedule weekly 15-minute review in Search.ai Workspace to track progress`
      ],
      completed: false
    }
  ];

  return {
    id: `plan_${Date.now()}`,
    targetTool: toolName,
    timeframe: context.timeframe || "7 Days",
    steps
  };
}
