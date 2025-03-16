import { FastifyInstance } from "fastify";
import { VerifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search";
import { nearby } from "./nearby";
import { create } from "./create";
import { VerifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", VerifyJWT);

  app.get("/gyms/search", search);
  app.get("/gyms/nearby", nearby);

  app.post("/gyms", { onRequest: [VerifyUserRole("ADMIN")] }, create);
}
