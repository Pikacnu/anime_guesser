import { Database } from 'bun:sqlite';

export enum Language {
	en = 'en',
	zhTW = 'zh-TW',
	ja = 'ja',
}

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
/*
db.exec(`
  DELETE TABLE IF EXISTS translations;
  `);
*/
db.exec(`
  CREATE TABLE IF NOT EXISTS translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    anime_id INTEGER,
    language TEXT,
    title TEXT,
    FOREIGN KEY (anime_id) REFERENCES animes(id)
    );
  `);

export type Translation = {
	id: number;
	anime_id: number;
	language: Language;
	title: string;
};

export default db;
