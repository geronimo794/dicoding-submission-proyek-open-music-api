import pgPkg from 'pg';
import {nanoid} from 'nanoid';
import bcrypt from 'bcrypt';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import ResponseHelper from '../../utils/ResponseHelper.js';

const {Pool} = pgPkg;

/**
 * User service action
 */
class UsersService {
	/**
	 * Constructor user to define new pgsql pool
	 */
	constructor() {
		this._pool = new Pool();
	}
	/**
	 * Add user function service
	 * @param {*} param0 Object of user
	 */
	async addUser({username, password, fullname}) {
		await this.verifyNewUsername(username);
		const createdAt = new Date().toISOString();
		const id = `user-${nanoid(16)}`;
		const hashedPassword = await bcrypt.hash(password, 10);

		const query = {
			text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $5) RETURNING id',
			values: [id, username, hashedPassword, fullname, createdAt],
		};

		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new InvariantError(ResponseHelper.RESPONSE_FAILED);
		}

		return result.rows[0].id;
	}
	/**
	 * Get user service by id
	 * @param {*} userId
	 * @return {object} Object of user
	 */
	async getUserById(userId) {
		const query = {
			text: 'SELECT id, username, fullname FROM users WHERE id = $1',
			values: [userId],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
		return result.rows[0];
	}
	/**
	 * Validate and verify duplicate username
	 * @param {*} username
	 */
	async verifyNewUsername(username) {
		const query = {
			text: 'SELECT username FROM users WHERE username = $1',
			values: [username],
		};
		const result = await this._pool.query(query);

		if (result.rowCount > 0) {
			throw new InvariantError(ResponseHelper.RESPONSE_DUPLICATE_ENTRY);
		}
	}
}

export default UsersService;
