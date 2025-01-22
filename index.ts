import db, { type Anime } from './src/db';

//const data: AnimeData = await Bun.file('./src/data.json').json();
//const animes = data.data;

function getRandomInRange(max: number, min = 0) {
	return Math.floor(Math.random() * (max - min) + min);
}
function shuffle(array: Array<any>) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

const port = 8080;

Bun.serve({
	port: port,
	async fetch(request, server) {
		const url = new URL(request.url);
		const path = url.pathname;
		if (path === '/') {
			const rows = url.searchParams.get('rows') || '10';
			const cols = url.searchParams.get('cols') || '10';
			const questions = url.searchParams.get('questions') || '20';
			const replaceData = Object.entries({
				rows,
				cols,
				questions,
			}).map(([key, value]) => {
				return [`$${key}$`, value];
			});
			let file = await Bun.file('./src/index.html').text();
			replaceData.forEach(([key, value]) => {
				file = file.replace(key, value);
			});
			return new Response(file, {
				headers: {
					'Content-Type': 'text/html',
				},
			});
		}
		if (path === '/api') {
			return new Response(Bun.file('./src/api-docs.html'));
		}
		if (path === '/api/tool') {
			return new Response(Bun.file('./src/tools.html'));
		}

		if (path === '/data') {
			if (request.method === 'GET') {
				const counts = parseInt(url.searchParams.get('count') || '') || 10;

				const animes = db
					.query('SELECT * FROM animes ORDER BY RANDOM() LIMIT ?')
					.all(counts) as Anime[];

				const AnsIndex = getRandomInRange(counts);
				const answer = animes[AnsIndex];

				return new Response(
					JSON.stringify({
						data: animes,
						answer: answer,
					}),
					{
						headers: {
							Cache: 'no-cache',
							'Content-Type': 'application/json',
						},
					},
				);
			}
		}
		if (path === '/api/animes') {
			if (request.method === 'GET') {
				const result = db.query('SELECT * FROM animes').all();
				return new Response(JSON.stringify(result), {
					headers: {
						'Content-Type': 'application/json',
					},
				});
			}
			if (request.method === 'POST') {
				const { title, cover } = await request.json();
				if (!title || !cover) {
					return new Response('Bad Request', { status: 400 });
				}
				const result = db
					.query('INSERT INTO animes (title, cover) VALUES (?, ?)')
					.run(title, cover);
				return new Response(JSON.stringify(result), {
					headers: {
						'Content-Type': 'application/json',
					},
				});
			}
			if (request.method === 'DELETE') {
				const body = await request.json();
				if (body['id']) {
					const { id } = body;
					if (!id) {
						return new Response(
							JSON.stringify({
								message: 'Bad Request',
								reason: 'ID is required',
							}),
							{ status: 400 },
						);
					}
					db.query('DELETE FROM animes WHERE id = ?').run(id);
					return new Response(
						JSON.stringify({
							message: 'Deleted',
							id: id,
						}),
						{
							headers: {
								'Content-Type': 'application/json',
							},
						},
					);
				}
				if (body['title']) {
					const { title } = body;
					if (!title) {
						return new Response(
							JSON.stringify({
								message: 'Bad Request',
								reason: 'Title is required',
							}),
							{ status: 400 },
						);
					}
					db.query('DELETE FROM animes WHERE title = ?').run(title);
					return new Response(
						JSON.stringify({
							message: 'Deleted',
							title: title,
						}),
						{
							headers: {
								'Content-Type': 'application/json',
							},
						},
					);
				}
			}
		}
		if (path === '/api/random') {
			if (request.method === 'GET') {
				const counts = parseInt(url.searchParams.get('count') || '') || 10;
				const animes = db.query('SELECT * FROM animes').all() as Anime[];
				const result = shuffle(animes).slice(0, counts);
				return new Response(JSON.stringify(result), {
					headers: {
						'Content-Type': 'application/json',
					},
				});
			}
		}
		return new Response('Not Found', { status: 404 });
	},
});

console.log(`Server started at http://localhost:${port}`);
