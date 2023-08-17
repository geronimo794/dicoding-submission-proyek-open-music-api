import ClientError from './ClientError.js';

/**
 * NotFoundError class Extends ClientError
 * from Error
 */
class NotFoundError extends ClientError {
	/**
	 * Constructro message to override message and status code
	 * Change name of the instance
	 * @param {*} message
	 */
	constructor(message) {
		super(message, 404);
		this.name = 'NotFoundError';
	}
}

export default NotFoundError;
