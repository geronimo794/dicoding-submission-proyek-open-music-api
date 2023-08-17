/**
 * ClientError for throw new Error
 */
class ClientError extends Error {
	/**
	 * Constructor to define message and status code
	 * @param {*} message custom message error
	 * @param {*} statusCode default status code 400
	 */
	constructor(message, statusCode = 400) {
		super(message);
		this.statusCode = statusCode;
		this.name = 'ClientError';
	}
}

export default ClientError;
