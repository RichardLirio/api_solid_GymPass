import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const fecthUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await fecthUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  }); //executo o metodo execute criado dentro da classe do use case

  return reply.status(200).send({
    checkIns,
  });
}
