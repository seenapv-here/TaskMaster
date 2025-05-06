// utils/ai.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateTaskDescription(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 100,
    });
    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    return "AI generation failed.";
  }
}

module.exports = { generateTaskDescription };
