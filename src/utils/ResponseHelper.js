

const RESPONSE_OK = 'Ok';
const RESPONSE_CREATED = 'Data created';
const RESPONSE_UPDATED = 'Data updated';
const RESPONSE_NOT_FOUND = 'Data not found';
const RESPONSE_DELETED = 'Data deleted';
const RESPONSE_INTERNAL_ERROR = 'Internal server error';
const RESPONSE_FAILED = 'Action failed';

class ResponseHelper{
	static buildSuccessResponse(h, responseMessage, responseData) {
		const response = h.response({
			status: 'success',
			message: responseMessage,
			data: responseData,
		});
		response.code(this.getResponseCode(responseMessage));
		return response;
	}
	static buildErrorResponse(h, responseMessage){
		const response = h.response({
			status: (responseMessage == this.RESPONSE_INTERNAL_ERROR ? 'error':'fail'),
			message: responseMessage,
		});
		response.code(this.getResponseCode(responseMessage));
		return response;
	}
	static getResponseCode(responseMessage){
		switch (responseMessage) {
		case RESPONSE_OK:
		case RESPONSE_UPDATED:
		case RESPONSE_DELETED:
			return 200;		
		case RESPONSE_CREATED:
			return 201;
		case RESPONSE_FAILED:
			return 400;
		case RESPONSE_NOT_FOUND:
			return 404;
		case RESPONSE_INTERNAL_ERROR:
			return 500;
		}
		// Client error
		return 400;
	}
	static get RESPONSE_OK() {
		return RESPONSE_OK;
	}
	static get RESPONSE_CREATED() {
		return RESPONSE_CREATED;
	}
	static get RESPONSE_UPDATED() {
		return RESPONSE_UPDATED;
	}
	static get RESPONSE_NOT_FOUND() {
		return RESPONSE_NOT_FOUND;
	}
	static get RESPONSE_DELETED() {
		return RESPONSE_DELETED;
	}
	static get RESPONSE_INTERNAL_ERROR() {
		return RESPONSE_INTERNAL_ERROR;
	}
	static get RESPONSE_FAILED() {
		return RESPONSE_FAILED;
	}
}

export default ResponseHelper;