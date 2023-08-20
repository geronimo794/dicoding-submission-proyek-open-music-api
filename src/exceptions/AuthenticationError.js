import ClientError from './ClientError.js';

/**
 * AuthenticationError extends ClientError
 * Have message and statusCode
 */
class AuthenticationError extends ClientError {
	/**
	 * Constructor AuthenticationError to change error name
	 * @param {*} message
	 */
	constructor(message) {
		super(message, 401);
		this.name = 'AuthenticationError';
	}
}

export default AuthenticationError;
