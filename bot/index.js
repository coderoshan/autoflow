const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const { WebClient } = require("@slack/web-api");
const { handleSlackMessage, setBotUserId } = require("./slack");

const app = express();
app.use(express.json());

const web = new WebClient(process.env.SLACK_BOT_TOKEN);

// Get bot user ID
(async () => {
  try {
    const auth = await web.auth.test();
    setBotUserId(auth.user_id);
    console.log("🤖 Bot user ID:", auth.user_id);
  } catch (err) {
    console.error("Failed to get bot user ID:", err);
  }
})();

// Slack event handler - URL verification + events
app.post("/webhook/slack/events", async (req, res) => {
  // URL verification (Slack challenge)
  if (req.body.type === "url_verification") {
    return res.status(200).send(req.body.challenge);
  }

  // Handle actual events
  const event = req.body.event;
  if (
    !event ||
    event.type !== "message" ||
    event.subtype === "bot_message" ||
    !event.text
  ) {
    return res.status(200).send("OK");
  }

  try {
    const response = await handleSlackMessage(event);
    if (!response) return res.status(200).send("OK");

    await web.chat.postMessage({
      channel: event.channel,
      text: response.text,
      blocks: response.blocks,
      thread_ts: event.thread_ts || event.ts,
    });
  } catch (err) {
    console.error("Error handling Slack event:", err);
  }

  res.status(200).send("OK");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", ai: "ready" });
});

// For Vercel: export the app instead of listening
module.exports = app;

// For local development only
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 AutoFlow bot running on port ${port}`);
  });
}
