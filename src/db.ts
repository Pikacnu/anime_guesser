import { Database } from 'bun:sqlite';

const db = new Database('animes.sqlite');

export type Anime = {
	id: number;
	title: string;
	cover: string;
};

db.exec(`
CREATE TABLE IF NOT EXISTS animes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  cover TEXT
);
`);

export default db;
