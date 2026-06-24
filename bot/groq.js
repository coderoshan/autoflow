// bot/groq.js
const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Simple keyword-based fallback + AI classification
async function classifyIntent(text) {
  const lowerText = text.toLowerCase();

  // Fast keyword check first (more reliable for common patterns)
  if (lowerText.includes("create") && lowerText.includes("task"))
    return "create_task";
  if (lowerText.includes("add") && lowerText.includes("task"))
    return "create_task";
  if (lowerText.includes("new") && lowerText.includes("task"))
    return "create_task";
  if (lowerText.includes("todo")) return "create_task";
  if (lowerText.includes("delegate") || lowerText.includes("assign to"))
    return "delegate_task";
  if (
    lowerText.includes("list") &&
    (lowerText.includes("task") || lowerText.includes("todo"))
  )
    return "list_tasks";
  if (
    lowerText.includes("show") &&
    (lowerText.includes("task") || lowerText.includes("todo"))
  )
    return "list_tasks";
  if (lowerText.includes("my tasks")) return "list_tasks";
  if (lowerText.includes("update") && lowerText.includes("task"))
    return "update_task";

  // Fallback to AI for ambiguous cases
  const systemPrompt = `Classify the user's intent into EXACTLY one of these categories. Respond with ONLY the category name, no explanation.

Categories:
- create_task: User wants to create/add/make a new task, todo, or reminder
- delegate_task: User wants to assign a task to someone else
- list_tasks: User wants to see/view/list their tasks
- update_task: User wants to modify/change an existing task
- general_chat: General conversation, greeting, or unrelated message

Examples:
"Create a task to review report by Friday" -> create_task
"Add todo: buy groceries" -> create_task
"Show my tasks" -> list_tasks
"Assign this to John" -> delegate_task
"Hey there" -> general_chat
"What's up" -> general_chat`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.1,
      max_tokens: 20,
    });

    const result = completion.choices[0].message.content.trim().toLowerCase();
    return result || "general_chat";
  } catch (err) {
    console.error("Groq classify error:", err.message);
    return "general_chat";
  }
}

async function extractTask(text) {
  const systemPrompt = `You are a task extraction assistant. Extract task details from the user's message.
Respond in this EXACT JSON format (no markdown, no explanation):
{
  "title": "short task title",
  "description": "detailed description",
  "priority": "low|medium|high",
  "due_date": "YYYY-MM-DD or null",
  "assignee": "person name or null",
  "category": "general|development|design|marketing|meeting"
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.2,
      max_tokens: 300,
    });

    const raw = completion.choices[0].message.content.trim();
    const jsonStr = raw.replace(/```json\s*|\s*```/g, "").trim();

    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse AI response:", e.message);
    return {
      title: text.slice(0, 50),
      description: text,
      priority: "medium",
      due_date: null,
      assignee: null,
      category: "general",
    };
  }
}

module.exports = { classifyIntent, extractTask };
