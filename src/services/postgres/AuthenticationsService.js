import pgPkg from 'pg';
import InvariantError from '../../exceptions/InvariantError.js';
import ResponseHelper from '../../utils/ResponseHelper.js';

const {Pool} = pgPkg;


/**
 * Service for authentication process
 */
class AuthenticationsService {
	/**
	 * Init constructor for property
	 */
	constructor() {
		this._pool = new Pool();
	}
	/**
	 * Function save token
	 * @param {*} token
	 */
	async addRefreshToken(token) {
		const query = {
			text: 'INSERT INTO authentications VALUES($1)',
			values: [token],
		};
		await this._pool.query(query);
	}
	/**
	 * Verify token data to existing database
	 * @param {*} token
	 */
	async verifyRefreshToken(token) {
		const query = {
			text: 'SELECT token FROM authentications WHERE token = $1',
			values: [token],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError(ResponseHelper.RESPONSE_INVALID_INPUT);
		}
	}
	/**
	 * Delete token from the database
	 * @param {*} token
	 */
	async deleteRefreshToken(token) {
		const query = {
			text: 'DELETE FROM authentications WHERE token = $1',
			values: [token],
		};
		await this._pool.query(query);
	}
}

export default AuthenticationsService;
