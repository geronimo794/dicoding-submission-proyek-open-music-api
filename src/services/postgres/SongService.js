import pgPkg from 'pg';
import { nanoid } from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import mapSongDBToModel from '../../mapping/song.js';
import ResponseHelper from '../../utils/ResponseHelper.js';

const { Pool } = pgPkg;

class SongsService {
	constructor() {
		this._pool = new Pool();
	}
	async addSong({ title, year, genre, performer, duration, albumId }) {
		const id = nanoid(16);
		const createdAt = new Date().toISOString();
		const updatedAt = createdAt;

		const query = {
			text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
			values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
		};

		const result = await this._pool.query(query);

		if (!result.rows[0].id) {
			throw new InvariantError(ResponseHelper.RESPONSE_FAILED);
		}
		return result.rows[0].id;
	}
	async getSongs(title, performer) {
		// Find condition
		const bindParameters = [], conditions = [];
		let bindNumber = 1;
		if(title){
			conditions.push('title ILIKE $'+bindNumber+'');
			bindParameters.push('%' + title + '%');
			bindNumber++;
		}
		if(performer){
			conditions.push('performer ILIKE $'+bindNumber+'');
			bindParameters.push('%' + performer + '%');
			bindNumber++;
		}

		// Join string
		let conditionQuery = '';
		if(bindParameters.length > 0){
			conditionQuery = 'WHERE ' + conditions.join(' AND ');
		}

		// Query execution
		const query = {
			text: 'SELECT id, title, performer FROM songs ' + conditionQuery,
			values: bindParameters,
		};		
		const result = await this._pool.query(query);

		// Throw not found
		if (!result.rows.length) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
		return result.rows.map(mapSongDBToModel);
	}
	async getSongById(id) {
		const query = {
			text: 'SELECT * FROM songs WHERE id = $1',
			values: [id],
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}

		return result.rows.map(mapSongDBToModel)[0];
	}
	async editSongById(id, { title, year, genre, performer, duration, albumId  }) {
		const updatedAt = new Date().toISOString();
		const query = {
			text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
			values: [title, year, genre, performer, duration, albumId, updatedAt, id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
	}
	async deleteSongById(id) {
		const query = {
			text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
			values: [id],
		};
		const result = await this._pool.query(query);
		if (!result.rows.length) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
	}
}

export default SongsService;