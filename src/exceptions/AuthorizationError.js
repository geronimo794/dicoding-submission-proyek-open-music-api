import ClientError from './ClientError.js';
/**
 * AuthorizationError extends ClientError
 * Have message and statusCode
 */
class AuthorizationError extends ClientError {
	/**
	 * Constructor to change response code
	 * And errorname
	 * @param {*} message
	 */
	constructor(message) {
		super(message, 403);
		this.name = 'AuthorizationError';
	}
}

export default AuthorizationError;
