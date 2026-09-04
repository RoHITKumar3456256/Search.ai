/**
 * Search.ai Workspace & Project Persistence Store (PRD Sections 6.7 & 14)
 * Uses LocalStorage with structured project grouping, notes, and checklist state.
 */

const STORAGE_KEYS = {
  DECISIONS: "searchai_saved_decisions",
  PROJECTS: "searchai_projects",
  CUSTOM_NOTES: "searchai_decision_notes",
  CORRECTIONS: "searchai_user_corrections"
};

export const WorkspaceStore = {
  getProjects() {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!saved) {
      const defaultProjects = [
        { id: "proj_main", name: "Primary Decisions", description: "General saved research and briefs", color: "#38bdf8" },
        { id: "proj_startup", name: "Online Business / Startup", description: "Launch stack & tooling", color: "#34d399" },
        { id: "proj_studies", name: "Studies & Exams", description: "Memory retention & notes", color: "#a78bfa" }
      ];
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(defaultProjects));
      return defaultProjects;
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  },

  createProject(name, description = "", color = "#38bdf8") {
    const projects = this.getProjects();
    const newProj = {
      id: `proj_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      color
    };
    projects.push(newProj);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProj;
  },

  getSavedDecisions() {
    const saved = localStorage.getItem(STORAGE_KEYS.DECISIONS);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  },

  saveDecision(brief, actionPlan, selectedOptionIndex = 0, projectId = "proj_main", notes = "") {
    const decisions = this.getSavedDecisions();
    const existingIndex = decisions.findIndex(d => d.id === brief.id);

    const record = {
      id: brief.id,
      savedAt: new Date().toISOString(),
      projectId: projectId || "proj_main",
      query: brief.constraints.rawQuery || brief.restatedGoal,
      domain: brief.constraints.domain,
      budget: brief.constraints.budget,
      skill: brief.constraints.skill,
      timeframe: brief.constraints.timeframe,
      confidence: brief.confidence,
      selectedOptionIndex,
      selectedTool: brief.topRanked[selectedOptionIndex] ? brief.topRanked[selectedOptionIndex].data.tool : brief.topRanked[0].data.tool,
      brief,
      actionPlan: actionPlan || null,
      notes: notes || "",
      status: "In Progress", // "In Progress" | "Completed" | "Archived"
      tags: [brief.constraints.domain, brief.constraints.budget]
    };

    if (existingIndex >= 0) {
      decisions[existingIndex] = { ...decisions[existingIndex], ...record };
    } else {
      decisions.unshift(record);
    }

    localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisions));
    return record;
  },

  removeDecision(id) {
    let decisions = this.getSavedDecisions();
    decisions = decisions.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisions));
    return decisions;
  },

  updateDecisionStatus(id, newStatus) {
    const decisions = this.getSavedDecisions();
    const target = decisions.find(d => d.id === id);
    if (target) {
      target.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisions));
    }
  },

  updateDecisionNotes(id, notes) {
    const decisions = this.getSavedDecisions();
    const target = decisions.find(d => d.id === id);
    if (target) {
      target.notes = notes;
      localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisions));
    }
  },

  updateActionStep(decisionId, dayIndex, taskIndex, isCompleted) {
    const decisions = this.getSavedDecisions();
    const target = decisions.find(d => d.id === decisionId);
    if (target && target.actionPlan && target.actionPlan.steps[dayIndex]) {
      // Toggle task
      target.actionPlan.steps[dayIndex].completed = isCompleted;
      localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisions));
    }
  },

  saveCorrectionReport(toolId, toolName, reportedIssue, sourceLink = "") {
    const corrections = JSON.parse(localStorage.getItem(STORAGE_KEYS.CORRECTIONS) || "[]");
    corrections.push({
      id: `corr_${Date.now()}`,
      toolId,
      toolName,
      reportedIssue,
      sourceLink,
      submittedAt: new Date().toISOString(),
      status: "Pending Human Review"
    });
    localStorage.setItem(STORAGE_KEYS.CORRECTIONS, JSON.stringify(corrections));
    return true;
  }
};
