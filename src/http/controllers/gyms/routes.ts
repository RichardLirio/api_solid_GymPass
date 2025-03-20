import { FastifyInstance } from "fastify";
import { VerifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search";
import { nearby } from "./nearby";
import { create } from "./create";
import { VerifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", VerifyJWT);

  app.get(
    "/gyms/search",
    {
      schema: {
        tags: ["Gyms"],
        summary: "Search gyms",
        description:
          "Search for gyms based on a query string and optional pagination.",
        security: [
          {
            bearerAuth: [],
          },
        ],
        querystring: {
          type: "object",
          required: ["q"],

          properties: {
            q: {
              type: "string",
              description: "query to search for the title of the gyms",
            },
            page: {
              type: "string",
              description:
                "requested page, return a maximum of 20 items per page",
            },
          },
        },
        response: {
          200: {
            type: "object",
            description:
              "List of gyms found that contain search query in title",
            properties: {
              gyms: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    description: { type: "string", nullnable: true },
                    id: { type: "string" },
                    title: { type: "string" },
                    phone: { type: "string", nullnable: true },
                    latitude: { type: "number" },
                    longitude: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
    search
  );
  app.get("/gyms/nearby", nearby);

  app.post(
    "/gyms",
    {
      onRequest: [VerifyUserRole("ADMIN")],
      schema: {
        tags: ["Gyms"],
        summary: "Create a new gym",
        description:
          "Create a new gym. Note: Only users with the 'ADMIN' role can create a gym.",
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    create
  );
}
