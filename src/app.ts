import fastify from "fastify";
import { register } from "./http/controllers/register";
import { appRoutes } from "./http/routes";
import { error } from "console";
import { ZodError } from "zod";
import { env } from "./env";

export const app = fastify();

app.register(appRoutes);

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      issues: error.format(),
    });
  }

  if (env.NODE_ENV != "production") {
    console.log(error);
  } else {
    // TODO: Deveriamos enviar esse log de error para uma ferramenta externa como DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal Server error" });
});
