import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { autheticate } from "./controllers/authenticate";
import { profile } from "./controllers/profile";
import { VerifyJWT } from "./middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", autheticate);

  /** Authenticated */
  app.get("/me", { onRequest: [VerifyJWT] }, profile);
}
