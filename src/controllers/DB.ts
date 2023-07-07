import { PrismaClient } from '@prisma/client/edge'

let prisma: PrismaClient;



export default async function UseDB({ env }: { env: Env }): Promise<PrismaClient> {
	if (!prisma) {
		prisma = new PrismaClient(
			{
				datasources: {
					db: {
						url: env.DATABASE_URL,
					},
				},
			}
		)
	}

	return prisma;
}
