// src/server.ts
import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import botRoutes from "./routes/bot.route";

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: "*", // You can replace "*" with your frontend URL like "http://localhost:5173"
});
// Register bot routes
fastify.register(botRoutes, { prefix: "/bot" });

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
