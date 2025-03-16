import { FastifyInstance } from "fastify";
import { register } from "./register";
import { autheticate } from "./authenticate";
import { profile } from "./profile";
import { VerifyJWT } from "@/http/middlewares/verify-jwt";
import { refresh } from "./refresh";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", autheticate);

  app.patch("/token/refresh", refresh);

  /** Authenticated */
  app.get("/me", { onRequest: [VerifyJWT] }, profile);
}
