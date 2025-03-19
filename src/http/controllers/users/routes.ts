import { FastifyInstance } from "fastify";
import { register } from "./register";
import { autheticate } from "./authenticate";
import { profile } from "./profile";
import { VerifyJWT } from "@/http/middlewares/verify-jwt";
import { refresh } from "./refresh";

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    "/users",
    {
      schema: {
        summary: "Register a new user.",
        description: "Register a new user in Database",
        tags: ["Users"],
        body: {
          type: "object",
          properties: {
            name: { type: "string", description: "User Name" },
            email: {
              type: "string",
              format: "email",
              description: "User E-mail",
            },
            password: { type: "string", description: "USer Password" },
          },
          required: ["name", "email", "password"],
          examples: [
            {
              name: "João Silva",
              email: "joao.silva@example.com",
              password: "senha123",
            },
          ],
        },
        response: {
          201: {
            description: "User successfuly register.",
            type: "object",
            properties: {},
          },
          409: {
            description: "E-mail already exists",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    register
  );
  app.post("/sessions", autheticate);

  app.patch("/token/refresh", refresh);

  /** Authenticated */
  app.get("/me", { onRequest: [VerifyJWT] }, profile);
}
