import { FastifyInstance } from "fastify";
import { VerifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search";
import { nearby } from "./nearby";
import { create } from "./create";
import { VerifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", VerifyJWT);
  //gym search
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
              type: "integer",
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
          401: {
            type: "object",
            description: "Unauthorized user token",
            properties: {
              message: { type: "string", example: "Unauthorized" },
            },
          },
        },
      },
    },
    search
  );
  //gym nearby
  app.get(
    "/gyms/nearby",
    {
      schema: {
        tags: ["Gyms"],
        summary: "Fetch nearby gyms",
        description:
          "Retrieve a list of nearby gyms based on the user's latitude and longitude.",
        security: [
          {
            bearerAuth: [],
          },
        ],
        querystring: {
          type: "object",
          required: ["latitude", "longitude"],
          properties: {
            latitude: {
              type: "number",
              description: "User's latitude coordinate.",
              format: "float",
            },
            longitude: {
              type: "number",
              description: "User's longitude coordinate.",
              format: "float",
            },
          },
        },
        response: {
          200: {
            description: "A list of nearby gyms.",
            type: "object",
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
          401: {
            type: "object",
            description: "Unauthorized user token",
            properties: {
              message: { type: "string", example: "Unauthorized" },
            },
          },
        },
      },
    },
    nearby
  );
  //create gym only admin user
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
        body: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Title of the gym",
            },
            description: {
              type: "string",
              description: "Description of the gym",
              nullable: true,
            },
            phone: {
              type: "string",
              description: "Phone number of the gym",
              nullable: true,
            },
            latitude: {
              type: "number",
              description: "Latitude of the gym's location",
            },
            longitude: {
              type: "number",
              description: "Longitude of the gym's location",
            },
          },
          required: ["title", "latitude", "longitude"],
        },
        response: {
          201: {
            type: "object",
            description: "Gym created successfully",
          },
          401: {
            type: "object",
            description: "Unauthorized user token",
            properties: {
              message: { type: "string", example: "Unauthorized" },
            },
          },
        },
      },
    },
    create
  );
}
