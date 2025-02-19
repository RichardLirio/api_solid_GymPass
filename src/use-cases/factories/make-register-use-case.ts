import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../register";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository(); //crio o repository que será usado na classe do use case
  const registerUseCase = new RegisterUseCase(usersRepository); //instacio o use case com o repository

  return registerUseCase;
}
