import pgPkg from 'pg';
import {nanoid} from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import mapAlbumDBToModel from '../../mapping/album.js';
import mapSongDBToModel from '../../mapping/song.js';
import ResponseHelper from '../../utils/ResponseHelper.js';
const {Pool} = pgPkg;

/**
 * Album service function save to postgress
 */
class AlbumsService {
	/**
	 * Constructor to create new pool
	 */
	constructor() {
		this._pool = new Pool();
	}
	/**
	 * Add album service to service
	 * @param {*} param0 object of album
	 * @return {string} string of inserted id
	 */
	async addAlbum({name, year}) {
		const id = nanoid(16);
		const createdAt = new Date().toISOString();

		const query = {
			text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
			values: [id, name, year, createdAt],
		};

		const result = await this._pool.query(query);

		if (!result.rows[0].id) {
			throw new InvariantError(ResponseHelper.RESPONSE_FAILED);
		}
		return result.rows[0].id;
	}
	/**
	 * Get albums data list
	 * @return {array} Array object of albums
	 */
	async getAlbums() {
		const result = await this._pool.query('SELECT * FROM albums');
		return result.rows.map(mapAlbumDBToModel);
	}
	/**
	 * Get detail album by id
	 * @param {*} id
	 * @return {object} Object or error response
	 */
	async getAlbumById(id) {
		const query = {
			text: 'SELECT * FROM albums WHERE id = $1',
			values: [id],
		};
		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}

		const data = result.rows.map(mapAlbumDBToModel)[0];
		const querySongs = {
			text: 'SELECT * FROM songs WHERE album_id = $1',
			values: [id],
		};
		const resultSongs = await this._pool.query(querySongs);
		data['songs'] = resultSongs.rows.map(mapSongDBToModel);

		return data;
	}
	/**
	 * Edit album by id
	 * @param {*} id
	 * @param {*} param1 Object request of name and year
	 */
	async editAlbumById(id, {name, year}) {
		const updatedAt = new Date().toISOString();
		const query = {
			text: 'UPDATE albums '+
				'SET name = $1, year = $2, updated_at = $3 '+
				'WHERE id = $4 RETURNING id',
			values: [name, year, updatedAt, id],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
	}
	/**
	 * Delete album by id
	 * @param {*} id
	 */
	async deleteAlbumById(id) {
		const query = {
			text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
			values: [id],
		};
		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
	}
}

export default AlbumsService;
