import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { RegisterUseCase } from "@/use-cases/register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository(); //crio o repository que será usado na classe do use case
    const registerUseCase = new RegisterUseCase(usersRepository); //instacio o use case com o repository

    await registerUseCase.execute({ name, email, password }); //executo o metodo execute criado dentro da classe do use case
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send();
}
