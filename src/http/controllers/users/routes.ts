import { FastifyInstance } from "fastify";
import { register } from "./register";
import { autheticate } from "./authenticate";
import { profile } from "./profile";
import { VerifyJWT } from "@/http/middlewares/verify-jwt";
import { refresh } from "./refresh";
import { Schema } from "zod";

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
  app.post(
    "/sessions",
    {
      schema: {
        tags: ["Users"],
        summary: "Create a authentication session",
        description: "Create a authentication session",
        body: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User E-mail",
            },
            password: {
              type: "string",
              description: "The user password, will be encrypted",
            },
          },
          required: ["email", "password"],
          examples: [
            {
              email: "joao.silva@example.com",
              password: "senha123",
            },
          ],
        },
        response: {
          200: {
            description: "Successful authentication.",
            headers: {
              "Set-Cookie": {
                description: "refreshToken cookie",
                type: "string",
                example:
                  "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiTUVNQkVSIiwic3ViIjoiYTA5NDhjMmMtYzQ1My00YzNlLWExNTUtNzVjNjJlNzA1YmExIiwiaWF0IjoxNjgyNjE5NzM4LCJleHAiOjE2ODMyMjQ1Mzh9.1sBGO89KZ7MJLF8qT5zPoK0GK_lcvR9LAbMokyHQt5o; Path=/; HttpOnly; Secure; SameSite=Strict",
              },
            },
            type: "object",
            properties: {
              token: {
                type: "string",
                description: "JWT access token",
                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjJ9.6rEJp1jglRWiYHOJFO_x9l2zjKl7TcI1GjT_nSxQkzE",
              },
            },
          },
          400: {
            description: "Invalid credentials | Validation error",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    autheticate
  );

  app.patch(
    "/token/refresh",
    {
      schema: {
        tags: ["Users"],
        summary: "Refresh a authentication session",
        description: "Refresh the JWT token using a refreshToken cookie",
        security: [
          {
            bearerAuth: [],
          },
        ],
        response: {
          200: {
            description: "Successful authentication.",
            headers: {
              "Set-Cookie": {
                description: "refreshToken cookie",
                schema: {
                  type: "string",
                  example:
                    "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiTUVNQkVSIiwic3ViIjoiYTA5NDhjMmMtYzQ1My00YzNlLWExNTUtNzVjNjJlNzA1YmExIiwiaWF0IjoxNjgyNjE5NzM4LCJleHAiOjE2ODMyMjQ1Mzh9.1sBGO89KZ7MJLF8qT5zPoK0GK_lcvR9LAbMokyHQt5o; Path=/; HttpOnly; Secure; SameSite=Strict",
                },
              },
            },
            type: "object",
            properties: {
              token: {
                type: "string",
                description: "JWT access token",
                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjJ9.6rEJp1jglRWiYHOJFO_x9l2zjKl7TcI1GjT_nSxQkzE",
              },
            },
          },
        },
      },
    },
    refresh
  );

  /** Authenticated */
  app.get(
    "/me",
    {
      onRequest: [VerifyJWT],
      schema: {
        tags: ["Users"],
        summary: "Get the user profile",
        description: "Get the user profile",
        security: [
          {
            bearerAuth: [],
          },
        ],
        response: {
          200: {
            description: "Successful get the user profile.",

            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    format: "uuid",
                    description: "User ID",
                    example: "b2b221b1-7824-4c43-b7c7-869ddc3083ee",
                  },
                  name: {
                    type: "string",
                    description: "User name",
                    example: "João Silva",
                  },
                  email: {
                    type: "string",
                    description: "User email",
                    example: "joao.silva@example.com",
                  },
                  role: {
                    type: "string",
                    description: "User role",
                    enum: ["ADMIN", "MEMBER"],
                    example: "ADMIN",
                  },
                  created_at: {
                    type: "string",
                    format: "date-time",
                    description: "User creation timestamp",
                    example: "2023-04-27T12:34:56.789Z",
                  },
                },
              },
            },
          },
        },
      },
    },
    profile
  );
}
