import UseDB from "@controllers/DB";
import { PrismaClient } from "@prisma/client/edge";

let db: PrismaClient;

export async function LogRequest(request: Request, env: Env, ctx: ExecutionContext) {
	if (!db) {
		db = await UseDB({ env });
	}
	const url = new URL(request.url);
	const { protocol, host, pathname, search, hash } = url;

	console.log(`Request: ${request.method} ${request.url}`);

	await db.log
		.create({
			data: {
				level: 'Info',
				message: `${request.method} ${request.url}`,
				meta: {
					headers: JSON.stringify(request.headers),
					protocol,
					host,
					pathname,
					search,
					hash,
				},
			},
		})
		.then()
}

// decorator to log requests
export function ServiceLogger() {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			const [request, env, ctx] = args;
			LogRequest(request, env, ctx);
			return originalMethod.apply(this, args);
		};
		return descriptor;
	};
}
