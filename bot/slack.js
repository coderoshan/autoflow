const { classifyIntent, extractTask } = require("./groq");
const { createClient } = require("@supabase/supabase-js");
const { findBestAssignee } = require("./delegate");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

let botUserId = null;

function setBotUserId(id) {
  botUserId = id;
}

function cleanMessageText(text) {
  if (!text) return "";
  return text
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&")
    .replace(/^>\s*/gm, "")
    .replace(/[_*~`]/g, "")
    .replace(/"([^"]*)"/g, "$1")
    .trim();
}

async function handleSlackMessage(event) {
  const { text: rawText, user, channel, ts, team, subtype } = event;

  if (user === botUserId) return null;
  if (
    subtype &&
    (subtype === "message_changed" || subtype === "message_deleted")
  )
    return null;

  const text = cleanMessageText(rawText);
  console.log("📩 Message received:", text);
  if (!text) return null;

  try {
    let intent = await classifyIntent(text);
    intent = intent?.trim().toLowerCase() || "general_chat";
    console.log("🧠 Intent:", intent);

    if (intent === "create_task") {
      const taskData = await extractTask(text);
      console.log("📝 Extracted task:", taskData);

      const { data, error } = await supabase
        .from("slack_tasks")
        .insert({
          slack_team_id: team || "unknown",
          slack_user_id: user,
          slack_channel_id: channel,
          slack_message_ts: ts,
          raw_text: text,
          task: taskData.title,
          assignee: taskData.assignee,
          deadline: taskData.due_date ? taskData.due_date + "T00:00:00Z" : null,
          priority: taskData.priority,
          category: taskData.category,
          status: "pending",
          source: "slack",
        })
        .select();

      if (error) throw error;

      const assignee = findBestAssignee(taskData);
      const delegateText = `\n🎯 *Recommended:* ${assignee.assignee_name} (${assignee.ai_confidence * 100}% match)`;

      return {
        text: `✅ Task created! *${taskData.title}*\nPriority: ${taskData.priority}\nCategory: ${taskData.category}${delegateText}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `✅ *Task Created!*\n\n*Task:* ${taskData.title}\n*Priority:* ${taskData.priority}\n*Category:* ${taskData.category}${delegateText}`,
            },
          },
        ],
      };
    }

    if (intent === "list_tasks") {
      const { data: tasks } = await supabase
        .from("slack_tasks")
        .select("*")
        .eq("slack_user_id", user)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      const taskList = tasks?.length
        ? tasks.map((t, i) => `${i + 1}. *${t.task}* — ${t.status}`).join("\n")
        : "No pending tasks found.";

      return { text: `📋 Your tasks:\n${taskList}` };
    }

    return {
      text: `🤖 I detected intent: *${intent}*. This feature is coming soon!`,
    };
  } catch (err) {
    console.error("Error handling message:", err);
    return { text: "❌ Oops, something went wrong. Please try again." };
  }
}

module.exports = { handleSlackMessage, setBotUserId };
