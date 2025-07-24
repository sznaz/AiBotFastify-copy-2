// src/bot/chains.ts
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.4,
});

// 🧠 Summary chain (LLM)
const summaryPrompt = PromptTemplate.fromTemplate(`
User goal: {goal}

Summarize the above into a 1-sentence career objective.
`);
export const summaryChain = RunnableSequence.from([summaryPrompt, model]);

// 🗨️ Static responses

export function getGreetMessage(summary: string) {
  return `👋 Hello! Welcome to Just Guide.

Here's what I understand about your background:
${summary}

Are you looking for mentorship based on this summary? Reply with "yes" or "no".`;
}

export const confirmSummaryYesMessage = `✅ Awesome! You now have two options:

1. Show Mentors – See mentor suggestions based on your goal.
2. Try Free Questionnaire – Answer a few questions to refine your path.

Reply with "1" or "2".`;

export const confirmSummaryNoMessage = `No worries! 😊

Could you please tell me your current career goal or what you're aiming for?`;

export function getOptionsAfterSummary(summary: string) {
  return `✅ Got it! Here's your updated summary:
"${summary}"

Now choose an option:

1. Show Mentors – Based on your updated goal.
2. Try Free Questionnaire – Answer questions to refine your path.

Reply with "1" or "2".`;
}

export const mentorListMessage = `Here are some mentor suggestions based on your goal: (TODO: implement matching logic)`;

export const questionnaireMessage = `Redirecting to the free questionnaire... (TODO: plug your questionnaire link here)`;

export const invalidOptionMessage = `Please choose either 1 (Show Mentors) or 2 (Free Questionnaire).`;

export const fallbackMessage = `Something went wrong. Restarting session.`;
