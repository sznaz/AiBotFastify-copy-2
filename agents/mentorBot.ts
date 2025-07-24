import {
  START,
  END,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { llm } from "../utils/openai";
import { HumanMessage } from "@langchain/core/messages";

interface State {
  summary?: string;
  goal?: string;
  botReply?: string;
  userReply?: string;
  currentStep?: string;
}

// Simple reducer: just overwrite latest value
const overwrite = (_prev: string | undefined, next?: string) => next ?? "";

const graphBuilder = new StateGraph<State>({
  channels: {
    summary: { value: overwrite, default: () => "" },
    goal: { value: overwrite, default: () => "" },
    botReply: { value: overwrite, default: () => "" },
    userReply: { value: overwrite, default: () => "" },
    currentStep: { value: overwrite, default: () => "" },
  },
});

// Nodes
const greet = async (state: State) => ({
  botReply: `👋 Hi! Here's your summary: ${state.summary}\nIs that right? (Yes/No)`,
  currentStep: "handleUserConfirmation",
});

const handleUserConfirmation = async (state: State) => {
  const reply = state.userReply?.toLowerCase() ?? "";
  if (reply.includes("yes")) {
    return {
      botReply: `✅ Great! Choose:\n1) Show Mentors\n2) Try Free Questionnaire`,
      currentStep: "chooseOption",
    };
  } else {
    return {
      botReply: `🔄 Got it. What's your career goal?`,
      currentStep: "askGoal",
    };
  }
};

const askGoal = async () => ({
  botReply: `Please type your career goal.`,
  currentStep: "updateSummary",
});

const updateSummary = async (state: State) => {
  const result = await llm.invoke([
    new HumanMessage(
      `Create a short summary based on this goal: ${state.userReply}`
    ),
  ]);

  return {
    summary: result.content as string,
    botReply: `📝 Summary updated: ${result.content}\n\nChoose:\n1) Show Mentors\n2) Try Free Questionnaire`,
    currentStep: "chooseOption",
  };
};

const chooseOption = async (state: State) => {
  const input = state.userReply?.toLowerCase() ?? "";
  if (input.includes("1")) {
    return {
      botReply: `🧑‍🏫 Suggested Mentors:\n- Tech Mentor\n- Career Coach\n- Startup Advisor`,
      currentStep: "done",
    };
  } else if (input.includes("2")) {
    return {
      botReply: `📝 Starting questionnaire...`,
      currentStep: "done",
    };
  } else {
    return {
      botReply: `❌ Invalid input. Please type 1 or 2.`,
      currentStep: "chooseOption",
    };
  }
};

// Graph definition
graphBuilder
  .addNode("greet", greet, { ends: ["handleUserConfirmation"] })
  .addNode("handleUserConfirmation", handleUserConfirmation, {
    ends: ["chooseOption", "askGoal"],
  })
  .addNode("askGoal", askGoal, { ends: ["updateSummary"] })
  .addNode("updateSummary", updateSummary, { ends: ["chooseOption"] })
  .addNode("chooseOption", chooseOption, { ends: ["chooseOption", END] })
  .addEdge(START, "greet");

const memory = new MemorySaver();
export const mentorGraph = graphBuilder.compile({ checkpointer: memory });
