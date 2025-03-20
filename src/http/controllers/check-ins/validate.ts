import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeValidateCheckInsUseCase } from "@/use-cases/factories/make-validate-check-ins-use-case";
import { ResourceNotFoundError } from "@/use-cases/erros/resource-not-found-error";
import { LateCheckInValidateError } from "@/use-cases/erros/late-check-in-validate-error";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  try {
    const validateCheckInsUseCase = makeValidateCheckInsUseCase();

    await validateCheckInsUseCase.execute({
      checkInId,
    }); //executo o metodo execute criado dentro da classe do use case
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    if (error instanceof LateCheckInValidateError) {
      return reply.status(403).send({
        message: error.message,
      });
    }
  }

  return reply.status(204).send();
}
