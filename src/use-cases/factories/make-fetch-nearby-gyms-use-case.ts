import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository(); //crio o repository que será usado na classe do use case
  const useCase = new FetchNearbyGymsUseCase(gymsRepository); //instacio o use case com o repository

  return useCase;
}
