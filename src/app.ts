import fastify from "fastify";
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";
import fastifyswagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export const app = fastify();

// Configuração do Swagger
app.register(fastifyswagger, {
  openapi: {
    info: {
      title: "API Solid Like a GymPass",
      description:
        "Documentação da API like a GymPass construída com princípios SOLID",
      version: "1.0.0",
    },
    externalDocs: {
      description: "Repository of project",
      url: "https://github.com/RichardLirio/api_solid_GymPass",
    },
    servers: [
      {
        url: "http://localhost:3333", // Ajuste a porta conforme sua configuração
        description: "Servidor local",
      },
    ],
    tags: [
      {
        name: "Documentation",
        description: "Routes about documentation",
      },
      {
        name: "Users",
        description: "Routes about users",
      },
      {
        name: "Gyms",
        description: "Routes about gyms",
      },
      {
        name: "Check-ins",
        description: "Routes about check-ins",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      "/docs": {
        get: {
          tags: ["Documentation"],
          summary: "OpenAPI Documentation",
          description: "Serve the OpenAPI documentation in Swagger UI.",
          responses: {
            200: {
              description: "API documentation fetched successfully.",
              content: {
                "text/html": {
                  schema: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});

// Configuração do Swagger UI
app.register(fastifySwaggerUi, {
  routePrefix: "/docs", // Acessível em http://localhost:3333/docs
  uiConfig: {
    docExpansion: "list", // Expande os endpoints por padrão
    deepLinking: false,
  },
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(fastifyCors, {
  origin: true,
  credentials: true,
});

app.register(fastifyCookie);

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

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
