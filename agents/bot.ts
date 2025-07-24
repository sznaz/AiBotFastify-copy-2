import {
  summaryChain,
  getGreetMessage,
  confirmSummaryYesMessage,
  confirmSummaryNoMessage,
  getOptionsAfterSummary,
  mentorListMessage,
  questionnaireMessage,
  invalidOptionMessage,
  fallbackMessage,
} from "./chains";

type Step = "initial" | "greet" | "confirm_summary" | "ask_goal" | "show_options";

export interface SessionState {
  step: Step;
  summary: string;
  userGoal: string;
}

export async function handleBotMessage(
  userMessage: string,
  session: SessionState
): Promise<{ response: string; updatedSession: SessionState }> {
  switch (session.step) {
    case "initial": {
      const res = await summaryChain.invoke({ goal: session.userGoal });
      const summary = res.content as string;
      return {
        response: getGreetMessage(summary),
        updatedSession: { ...session, summary, step: "confirm_summary" },
      };
    }

    case "confirm_summary": {
      if (userMessage?.toLowerCase().includes("yes")) {
        return {
          response: confirmSummaryYesMessage,
          updatedSession: { ...session, step: "show_options" },
        };
      } else {
        return {
          response: confirmSummaryNoMessage,
          updatedSession: { ...session, step: "ask_goal" },
        };
      }
    }

    case "ask_goal": {
      const goal = userMessage;
      const res = await summaryChain.invoke({ goal });
      const summary = res.content as string;

      return {
        response: getOptionsAfterSummary(summary),
        updatedSession: {
          ...session,
          userGoal: goal,
          summary,
          step: "show_options",
        },
      };
    }

    case "show_options": {
      if (userMessage?.trim() === "1") {
        return {
          response: mentorListMessage,
          updatedSession: session,
        };
      } else if (userMessage?.trim() === "2") {
        return {
          response: questionnaireMessage,
          updatedSession: session,
        };
      } else {
        return {
          response: invalidOptionMessage,
          updatedSession: session,
        };
      }
    }

    default:
      return {
        response: fallbackMessage,
        updatedSession: { step: "initial", summary: "", userGoal: "" },
      };
  }
}