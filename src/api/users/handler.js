import ResponseHelper from '../../utils/ResponseHelper.js';

/**
 * User Request Handler
 */
class UsersHandler {
	/**
	 * Constructor to inject depdencies
	 * @param {*} service
	 * @param {*} validator
	 */
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;
	}
	/**
	 * Post add user handler
	 * @param {*} request
	 * @param {*} h
	 * @return {object} response user id
	 */
	async postUserHandler(request, h) {
		this._validator.validateUserPayload(request.payload);
		const {username, password, fullname} = request.payload;

		const userId = await this._service.addUser({username, password, fullname});

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_CREATED, {userId});
	}
	/**
	 * Get user data by id request handler
	 * @param {*} request
	 * @param {*} h
	 * @return {object} Response object
	 */
	async getUserByIdHandler(request, h) {
		const {id} = request.params;

		const data = await this._service.getUserById(id);
		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_OK, {user: data});
	}
}

export default UsersHandler;
