import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetUserProfileUseCase } from "../get-user-profile";

export function makeGetUserProfileUseCaseUseCase() {
  const usersRepository = new PrismaUsersRepository(); //crio o repository que será usado na classe do use case
  const useCase = new GetUserProfileUseCase(usersRepository); //instacio o use case com o repository

  return useCase;
}
