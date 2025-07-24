import { llm } from "../utils/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

// 🧠 Summary chain (LLM)
const summaryPrompt = PromptTemplate.fromTemplate(`
User goal: {goal}

Summarize the above into a 1-sentence career objective.
`);
export const summaryChain = RunnableSequence.from([summaryPrompt, llm]);

// 🗨️ Static responses

export function getGreetMessage(summary: string) {
  return `👋 Hello! Welcome to Just Guide, your personal mentor-finding assistant.

Here's a summary of your career goal:
"${summary}"

Is this correct? (yes/no)`;
}

export const confirmSummaryYesMessage = `Great! What would you like to do next?

1. Show me mentors who can help with this goal.
2. I want to answer a questionnaire to get better recommendations.

Please reply with '1' or '2'.`;

export const confirmSummaryNoMessage = `I see. Please tell me your career goal in a few words, and I'll find the right mentors for you.`;

export function getOptionsAfterSummary(summary: string) {
  return `✅ Got it! Here's your updated summary:
"${summary}"

Now, what would you like to do?

1. Show me mentors who can help with this goal.
2. I want to answer a questionnaire to get better recommendations.

Please reply with '1' or '2'.`;
}

export const mentorListMessage = `Here are some mentors who can help you with your goal. (TODO: Implement mentor matching logic)`;

export const questionnaireMessage = `Our questionnaire will help you get better recommendations. (TODO: Add questionnaire link)`;

export const invalidOptionMessage = `That's not a valid option. Please choose '1' to see mentors or '2' to take the questionnaire.`;

export const fallbackMessage = `I'm sorry, something went wrong. Let's start over.`;