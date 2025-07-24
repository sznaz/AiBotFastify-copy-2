// src/routes/bot.route.ts
import { FastifyPluginAsync } from "fastify";
import { handleBotMessage } from "../agents/bot";

const botRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/", async (request, reply) => {
    const { userMessage, session } = request.body as {
      userMessage: string;
      session: any;
    };

    const { response, updatedSession } = await handleBotMessage(userMessage, session);
    reply.send({ response, session: updatedSession });
  });
};

export default botRoutes;
