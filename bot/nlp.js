const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function classifyIntent(text) {
  const prompt = `Classify intent: "${text}". Return JSON: {"type": "CREATE_TASK|MEETING_SUMMARY|STATUS_UPDATE|FOLLOW_UP|GENERAL", "confidence": 0.0-1.0}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.1
  });

  return JSON.parse(response.choices[0].message.content);
}

async function extractTask(text) {
  const prompt = `Extract task from: "${text}". Return JSON: {"description": "", "assignee": null, "deadline": null, "priority": "medium", "category": "general"}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.2
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { classifyIntent, extractTask };
