import apiRouter from './Router';
import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()

addEventListener('fetch', (event) => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event: FetchEvent): Promise<Response> {
  const { request } = event

  // waitUntil method is used for sending logs, after response is sent
  event.waitUntil(
    prisma.log
      .create({
        data: {
          level: 'Info',
          message: `${request.method} ${request.url}`,
          meta: {
            headers: JSON.stringify(request.headers),
          },
        },
      })
      .then()
  )

  return new Response(`request method: ${request.method}!`)
}

/**
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
*/

export default {
	// The fetch handler is invoked when this worker receives a HTTP(S) request
	// and should return a Response (optionally wrapped in a Promise)

	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

		// You'll find it helpful to parse the request.url string into a URL object. Learn more at https://developer.mozilla.org/en-US/docs/Web/API/URL
		const url = new URL(request.url);

		if (url.pathname.startsWith('/api/')) {
			// You can also use more robust routing
			return apiRouter.handle(request);
		}

		/**
		 * Default response
		*/

		return new Response(
			`Invalid request.
      <ul>
      <li><a href="#">Home</a></li>
			</ul>
			`,
			{ headers: { 'Content-Type': 'text/html' } }
		);
	},
};
