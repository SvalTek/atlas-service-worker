import { RouteEntry, Router } from 'itty-router';

export const CreateRouter = (path?: string, routes?: RouteEntry[]) => {
	const router = Router({ base: path, routes });
	return router
}

// now let's create a router (note the lack of "new")
const router = CreateRouter('/api');

router.get('/', () => new Response('Hello from API!'));

// GET collection index
// router.get('/api/todos', () => new Response('Todos Index!'));
// GET item
// router.get('/api/todos/:id', ({ params }) => new Response(`Todo #${params.id}`));
// POST to the collection (we'll use async here)
// router.post('/api/todos', async (request) => {
// 	const content = await request.json();
// 	return new Response('Creating Todo: ' + JSON.stringify(content));
// });


// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default router;
