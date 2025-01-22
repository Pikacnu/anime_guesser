import { Database } from 'bun:sqlite';

type AnimeData = {
	index: number;
	data: {
		title: string;
		cover: string;
	}[];
};

const data = (await Bun.file('./src/data.json').json()) as AnimeData;
const animes = data.data;

const db = new Database('animes.sqlite');

const insert = db.query(`
  INSERT INTO animes (title, cover) VALUES (?, ?)`);

animes.forEach((anime) => {
	insert.run(anime.title, anime.cover);
});
