import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history";
import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInRepository(); //crio o repository que será usado na classe do use case
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository); //instacio o use case com o repository

  return useCase;
}
