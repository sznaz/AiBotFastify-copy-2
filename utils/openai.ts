import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const llm = new ChatOpenAI({
  temperature: 0.7,
  modelName: "gpt-4o-mini",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a friendly and helpful mentor-finding assistant. Your goal is to guide users to the best mentors for their needs. Stick to the topic of mentorship. If a user asks something unrelated, gently steer them back to the topic.",
  ],
  ["placeholder", "{messages}"],
]);