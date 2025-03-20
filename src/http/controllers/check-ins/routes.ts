import { FastifyInstance } from "fastify";
import { VerifyJWT } from "@/http/middlewares/verify-jwt";
import { create } from "./create";
import { validate } from "./validate";
import { history } from "./history";
import { metrics } from "./metrics";
import { VerifyUserRole } from "@/http/middlewares/verify-user-role";
export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", VerifyJWT);
  //checkins hystory
  app.get(
    "/check-ins/history",
    {
      schema: {
        tags: ["Check-ins"],
        summary: "Fetch user check-ins history",
        description:
          "Fetch the history of check-ins for the authenticated user.",
        security: [
          {
            bearerAuth: [],
          },
        ],
        querystring: {
          type: "object",
          properties: {
            page: {
              type: "number",
              description:
                "requested page, return a maximum of 20 items per page",
              minimum: 1,
              default: 1,
            },
          },
        },
        response: {
          200: {
            type: "object",
            description: "Check-ins history fetched successfully.",
            properties: {
              checkIns: {
                type: "array",
                items: {
                  required: ["id", "created_at", "user_id", "gym_id"],
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      format: "uuid",
                    },
                    created_at: {
                      type: "string",
                      format: "date-time",
                    },
                    validated_at: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                    },
                    user_id: {
                      type: "string",
                      format: "uuid",
                    },
                    gym_id: {
                      type: "string",
                      format: "uuid",
                    },
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
    history
  );
  //checkin metrics
  app.get(
    "/check-ins/metrics",
    {
      schema: {
        tags: ["Check-ins"],
        summary: "Fetch user check-ins metrics",
        description: "Fetch check-ins metrics for the authenticated user.",
        security: [
          {
            bearerAuth: [],
          },
        ],
        response: {
          200: {
            description: "Check-ins metrics fetched successfully.",
            type: "object",
            properties: {
              checkInsCount: {
                type: "integer",
                minimum: 0,
              },
            },
            required: ["checkInsCount"],
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
    metrics
  );

  //create checkin for a gym
  app.post(
    "/gyms/:gymId/check-ins",
    {
      schema: {
        tags: ["Check-ins"],
        summary: "Create check-in for a gym",
        description:
          "Create a check-in for a specific gym based on the provided gym ID, user's latitude and longitude.",
        security: [
          {
            bearerAuth: [],
          },
        ],
        params: {
          type: "object",
          required: ["gymId"],
          properties: {
            gymId: {
              type: "string",
              description: "Gym ID for the check-in.",
              format: "uuid",
            },
          },
        },
        body: {
          description: "User's latitude and longitude for the check-in.",
          type: "object",
          properties: {
            latitude: {
              type: "number",
              format: "float",
            },
            longitude: {
              type: "number",
              format: "float",
            },
          },
          required: ["latitude", "longitude"],
        },
        response: {
          201: {
            description: "Check-in created successfully.",
            type: "object",
          },
          401: {
            type: "object",
            description: "Unauthorized user token",
            properties: {
              message: { type: "string", example: "Unauthorized" },
            },
          },
          403: {
            type: "object",
            description:
              "Forbidden. The user is too far from the gym to check in.",
            properties: {
              message: { type: "string", example: "Max distance reached." },
            },
          },
          404: {
            type: "object",
            description: "Not found. Gym with the specified ID not found.",
            properties: {
              message: { type: "string", example: "Resource not found" },
            },
          },
          409: {
            type: "object",
            description:
              "Conflict. The user has already checked in on the same day.",
            properties: {
              message: {
                type: "string",
                example: "Max number os check-ins reached.",
              },
            },
          },
        },
      },
    },
    create
  );
  //validate checkin only admin user
  app.patch(
    "/check-ins/:checkInId/validate",
    {
      onRequest: [VerifyUserRole("ADMIN")],
      schema: {
        tags: ["Check-ins"],
        summary: "Validate check in",
        description:
          "Validate check in. Note: Only users with the 'ADMIN' role can validate check in.",
        security: [
          {
            bearerAuth: [],
          },
        ],
        params: {
          type: "object",
          required: ["checkInId"],
          properties: {
            checkInId: {
              type: "string",
              description: "Check in id",
              format: "uuid",
            },
          },
        },
        response: {
          204: {
            description: "check in validated successfully.",
            type: "object",
          },
          403: {
            type: "object",
            description:
              "Forbidden. The check-in can only be validated until 20 minutes of its creation.",
            properties: {
              message: {
                type: "string",
                example:
                  "The check-in can only be validated until 20 minutes of its creation.",
              },
            },
          },
          404: {
            type: "object",
            description: "Not found. Check in with the specified ID not found.",
            properties: {
              message: { type: "string", example: "Resource not found" },
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
    validate
  );
}
