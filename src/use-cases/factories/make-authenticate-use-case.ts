import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthenticateUseCase } from "../authenticate";

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository(); //crio o repository que será usado na classe do use case
  const authenticateUseCase = new AuthenticateUseCase(usersRepository); //instacio o use case com o repository

  return authenticateUseCase;
}
