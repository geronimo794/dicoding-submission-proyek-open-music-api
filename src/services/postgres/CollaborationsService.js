import pgPkg from 'pg';
import {nanoid} from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import ResponseHelper from '../../utils/ResponseHelper.js';

const {Pool} = pgPkg;

/**
 * Collaboration service action
 */
class CollaborationsService {
	/**
	 * Constructor to get psql pool
	 */
	constructor() {
		this._pool = new Pool();
	}
	/**
	 * Add collab function
	 * @param {*} param0 Object of collaboration
	 * @return {object} Object of inserted id
	 */
	async addCollaboration({playlistId, userId}) {
		// Find the user first
		const queryUser = {
			text: 'SELECT id, username, fullname FROM users WHERE id = $1',
			values: [userId],
		};

		const resultUser = await this._pool.query(queryUser);

		if (!resultUser.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}

		// User valid then create
		const id = 'collab-' + nanoid(16);
		const createdAt = new Date().toISOString();

		const query = {
			text: 'INSERT INTO ' +
				'collaborations(id, playlist_id, user_id, created_at, updated_at) '+
				'VALUES($1, $2, $3, $4, $4) RETURNING id',
			values: [id, playlistId, userId, createdAt],
		};

		const result = await this._pool.query(query);

		if (!result.rows[0].id) {
			throw new InvariantError(ResponseHelper.RESPONSE_FAILED);
		}
		return result.rows[0].id;
	}
	/**
	 * Delete song function by song id
	 * @param {*} id
	 */
	async deleteCollaboration({playlistId, userId}) {
		const query = {
			text: 'DELETE FROM collaborations ' +
				'WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
			values: [playlistId, userId],
		};
		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
	}
	/**
	 * Check is allow collaborate on playlist
	 * @param {*} param
	 * @return {boolean}
	 */
	async isAllowCollaborate({playlistId, userId}) {
		const query = {
			text: 'SELECT id FROM collaborations ' +
				'WHERE playlist_id = $1 AND user_id = $2',
			values: [playlistId, userId],
		};
		const result = await this._pool.query(query);
		console.log(playlistId);
		console.log(userId);
		console.log(result.rowCount);
		if (!result.rowCount) {
			return false;
		}
		return true;
	}
}

export default CollaborationsService;
