const SKILL_MAP = {
  marketing: ["Charlie (Marketing)", "Alice (Content)"],
  development: ["Alice (Developer)", "Bob (Frontend)"],
  design: ["Bob (Designer)", "Charlie (Brand)"],
  meeting: ["Alice (PM)"],
  general: ["Alice", "Bob", "Charlie"],
};

function findBestAssignee(taskData) {
  const category = taskData.category || "general";
  const candidates = SKILL_MAP[category] || SKILL_MAP.general;
  const index = Math.floor(Math.random() * candidates.length);
  return {
    assignee_name: candidates[index],
    ai_confidence: 0.85,
  };
}

module.exports = { findBestAssignee };
