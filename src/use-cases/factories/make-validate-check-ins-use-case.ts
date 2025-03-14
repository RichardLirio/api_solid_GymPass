import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckInUseCase } from "../validate-check-in";

export function makeValidateCheckInsUseCase() {
  const checkInsRepository = new PrismaCheckInRepository(); //crio o repository que será usado na classe do use case
  const useCase = new ValidateCheckInUseCase(checkInsRepository); //instacio o use case com o repository

  return useCase;
}
