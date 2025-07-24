// src/agent.ts
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const llm = new ChatOpenAI({
  temperature: 0.7,
  modelName: "gpt-4o-mini",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful mentor suggestion assistant."],
  ["placeholder", "{messages}"]
]);
