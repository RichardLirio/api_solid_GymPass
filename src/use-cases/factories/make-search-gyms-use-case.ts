import { SearchGymsUseCase } from "../search-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository(); //crio o repository que será usado na classe do use case
  const useCase = new SearchGymsUseCase(gymsRepository); //instacio o use case com o repository

  return useCase;
}
