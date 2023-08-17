import ClientError from './ClientError.js';

/**
 * InvariantError extends ClientError
 * Have message and statusCode
 */
class InvariantError extends ClientError {
	/**
	 * Constructor InvariantError to change error name
	 * @param {*} message
	 */
	constructor(message) {
		super(message);
		this.name = 'InvariantError';
	}
}

export default InvariantError;
