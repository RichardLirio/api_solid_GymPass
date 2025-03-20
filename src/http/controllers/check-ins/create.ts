import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";
import { MaxDistanceError } from "@/use-cases/erros/max-distance-error";
import { ResourceNotFoundError } from "@/use-cases/erros/resource-not-found-error";
import { MaxNumberOfCheckInsError } from "@/use-cases/erros/max-number-of-check-ins-erros";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = createCheckInParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  try {
    const checkInUseCase = makeCheckInUseCase();

    await checkInUseCase.execute({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    }); //executo o metodo execute criado dentro da classe do use case
  } catch (error) {
    if (error instanceof MaxDistanceError) {
      return reply.status(403).send({
        message: error.message,
      });
    }

    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    if (error instanceof MaxNumberOfCheckInsError) {
      return reply.status(409).send({
        message: error.message,
      });
    }

    return reply.status(500).send();
  }

  return reply.status(201).send();
}
