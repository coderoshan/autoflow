const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const { createEventAdapter } = require("@slack/events-api");
const { handleSlackMessage, setBotUserId } = require("./slack");

const app = express();
const port = process.env.PORT || 3000;

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

app.use("/webhook/slack/events", slackEvents.expressMiddleware());

const { WebClient } = require("@slack/web-api");
const web = new WebClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const auth = await web.auth.test();
    setBotUserId(auth.user_id);
    console.log("🤖 Bot user ID:", auth.user_id);
  } catch (err) {
    console.error("Failed to get bot user ID:", err);
  }
})();

slackEvents.on("message", async (event) => {
  if (event.subtype === "bot_message") return;
  if (!event.text) return;

  const response = await handleSlackMessage(event);
  if (!response) return;

  try {
    await web.chat.postMessage({
      channel: event.channel,
      text: response.text,
      blocks: response.blocks,
      thread_ts: event.thread_ts || event.ts,
    });
  } catch (err) {
    console.error("Error posting message:", err);
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", ai: "ready" });
});

app.listen(port, () => {
  console.log(`🚀 AutoFlow bot running on port ${port}`);
});
