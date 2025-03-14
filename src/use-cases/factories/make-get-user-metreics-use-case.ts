import { GetUserMetricsUseCase } from "../get-user-metrics";
import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInRepository(); //crio o repository que será usado na classe do use case
  const useCase = new GetUserMetricsUseCase(checkInsRepository); //instacio o use case com o repository

  return useCase;
}
