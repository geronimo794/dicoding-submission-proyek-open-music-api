const RESPONSE_OK = 'Ok';
const RESPONSE_CREATED = 'Data created';
const RESPONSE_UPDATED = 'Data updated';
const RESPONSE_NOT_FOUND = 'Data not found';
const RESPONSE_DELETED = 'Data deleted';
const RESPONSE_INTERNAL_ERROR = 'Internal server error';
const RESPONSE_FAILED = 'Action failed';
const RESPONSE_INVALID_INPUT = 'Invalid input';
const RESPONSE_DUPLICATE_ENTRY = 'Duplicate entry';
const RESPONSE_UNAUTHORIZED = 'Unauthorized user';

/**
 * Response Helper contain static function
 */
class ResponseHelper {
	/**
	 * Build success response helber
	 * @param {*} h object of hapi
	 * @param {*} responseMessage Response message with constant
	 * @param {*} responseData Data object
	 * @return {object} response object with response code
	 */
	static buildSuccessResponse(h, responseMessage, responseData) {
		const responseStructure = {
			status: 'success',
			message: responseMessage,
		};

		// If there is data, create new data key
		if (responseData) {
			responseStructure['data'] = responseData;
		}
		const response = h.response(responseStructure);
		response.code(this.getResponseCode(responseMessage));
		return response;
	}
	/**
	 * Build error response
	 * @param {*} h object of hapi
	 * @param {*} responseMessage Response message with constant
	 * @return {object} response object with response code
	 */
	static buildErrorResponse(h, responseMessage) {
		const response = h.response({
			status: (responseMessage == this.RESPONSE_INTERNAL_ERROR ?
				'error':'fail'),
			message: responseMessage,
		});
		response.code(this.getResponseCode(responseMessage));
		return response;
	}
	/**
	 * Insert string constant to generate status code
	 * @param {string} responseMessage Constant string
	 * @return {int} Status code
	 */
	static getResponseCode(responseMessage) {
		switch (responseMessage) {
		case RESPONSE_OK:
		case RESPONSE_UPDATED:
		case RESPONSE_DELETED:
			return 200;
		case RESPONSE_CREATED:
			return 201;
		case RESPONSE_FAILED:
		case RESPONSE_DUPLICATE_ENTRY:
		case RESPONSE_INVALID_INPUT:
			return 400;
		case RESPONSE_UNAUTHORIZED:
			return 401;
		case RESPONSE_NOT_FOUND:
			return 404;
		case RESPONSE_INTERNAL_ERROR:
			return 500;
		}
		// Client error
		return 400;
	}
	/**
	 * Get function RESPONSE_OK
	 */
	static get RESPONSE_OK() {
		return RESPONSE_OK;
	}
	/**
	 * Get function RESPONSE_CREATED
	 */
	static get RESPONSE_CREATED() {
		return RESPONSE_CREATED;
	}
	/**
	 * Get function RESPONSE_UPDATED
	 */
	static get RESPONSE_UPDATED() {
		return RESPONSE_UPDATED;
	}
	/**
	 * Get function RESPONSE_NOT_FOUND
	 */
	static get RESPONSE_NOT_FOUND() {
		return RESPONSE_NOT_FOUND;
	}
	/**
	 * Get function RESPONSE_DELETED
	 */
	static get RESPONSE_DELETED() {
		return RESPONSE_DELETED;
	}
	/**
	 * Get function RESPONSE_INTERNAL_ERROR
	 */
	static get RESPONSE_INTERNAL_ERROR() {
		return RESPONSE_INTERNAL_ERROR;
	}
	/**
	 * Get function RESPONSE_FAILED
	 */
	static get RESPONSE_FAILED() {
		return RESPONSE_FAILED;
	}
	/**
	 * Get function RESPONSE_DUPLICATE_ENTRY
	 */
	static get RESPONSE_DUPLICATE_ENTRY() {
		return RESPONSE_DUPLICATE_ENTRY;
	}
	/**
	 * Get function RESPONSE_INVALID_INPUT
	 */
	static get RESPONSE_INVALID_INPUT() {
		return RESPONSE_INVALID_INPUT;
	}
	/**
	 * Get function RESPONSE_UNAUTHORIZED
	 */
	static get RESPONSE_UNAUTHORIZED() {
		return RESPONSE_UNAUTHORIZED;
	}
}

export default ResponseHelper;
