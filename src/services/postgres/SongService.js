import pgPkg from 'pg';
import {nanoid} from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import mapSongDBToModel from '../../mapping/song.js';
import ResponseHelper from '../../utils/ResponseHelper.js';

const {Pool} = pgPkg;
/**
 * Song service action
 */
class SongsService {
	/**
	 * Constructor to get psql pool
	 */
	constructor() {
		this._pool = new Pool();
	}
	/**
	 * Add song function with query
	 * @param {*} param0 Object of song
	 * @return {object} Object of inserted id
	 */
	async addSong({title, year, genre, performer, duration, albumId}) {
		const id = nanoid(16);
		const createdAt = new Date().toISOString();

		const query = {
			text: 'INSERT INTO songs '+
				'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id',
			values: [id, title, year, genre, performer, duration, albumId,
				createdAt],
		};

		const result = await this._pool.query(query);

		if (!result.rows[0].id) {
			throw new InvariantError(ResponseHelper.RESPONSE_FAILED);
		}
		return result.rows[0].id;
	}
	/**
	 * Get songs data
	 * @param {*} title optional to search
	 * @param {*} performer optional to search
	 * @return {array} Array list data of song
	 */
	async getSongs(title, performer) {
		// Find condition
		const bindParameters = [];
		const conditions = [];
		let bindNumber = 1;
		if (title) {
			conditions.push('title ILIKE $'+bindNumber+'');
			bindParameters.push('%' + title + '%');
			bindNumber++;
		}
		if (performer) {
			conditions.push('performer ILIKE $'+bindNumber+'');
			bindParameters.push('%' + performer + '%');
			bindNumber++;
		}

		// Join string
		let conditionQuery = '';
		if (bindParameters.length > 0) {
			conditionQuery = 'WHERE ' + conditions.join(' AND ');
		}

		// Query execution
		const query = {
			text: 'SELECT id, title, performer FROM songs ' + conditionQuery,
			values: bindParameters,
		};
		const result = await this._pool.query(query);

		// Throw not found
		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
		return result.rows.map(mapSongDBToModel);
	}
	/**
	 * Get song by id
	 * @param {*} id
	 * @return {object} Object of selected id
	 */
	async getSongById(id) {
		const query = {
			text: 'SELECT * FROM songs WHERE id = $1',
			values: [id],
		};
		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}

		return mapSongDBToModel(result.rows[0]);
	}
	/**
	 * Edit song by id
	 * @param {*} id
	 * @param {*} param1 object of song
	 */
	async editSongById(id, {title, year, genre, performer, duration, albumId}) {
		const updatedAt = new Date().toISOString();
		const query = {
			text: 'UPDATE songs '+
				'SET title = $1, year = $2, genre = $3, performer = $4, '+
				'duration = $5, album_id = $6, updated_at = $7 '+
				'WHERE id = $8 RETURNING id',
			values: [title, year, genre, performer, duration, albumId, updatedAt, id],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
	}
	/**
	 * Delete song function by song id
	 * @param {*} id
	 */
	async deleteSongById(id) {
		const query = {
			text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
			values: [id],
		};
		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
	}
}

export default SongsService;
