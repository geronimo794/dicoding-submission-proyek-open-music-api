import ResponseHelper from '../../utils/ResponseHelper.js';

/**
 * Handle authentication request
 */
class AuthenticationsHandler {
	/**
	 * Constructor to inject auth service, user service,
	 * token manager, and validator
	 * @param {*} authenticationsService
	 * @param {*} usersService
	 * @param {*} tokenManager
	 * @param {*} validator
	 */
	constructor(authenticationsService, usersService, tokenManager, validator) {
		this._authenticationsService = authenticationsService;
		this._usersService = usersService;
		this._tokenManager = tokenManager;
		this._validator = validator;
	}
	/**
	 * Hanlder authentication or login process
	 * @param {*} request
	 * @param {*} h
	 * @return {object} Return object and token
	 */
	async postAuthenticationHandler(request, h) {
		this._validator.validatePostAuthenticationPayload(request.payload);
		const {username, password} = request.payload;
		const id = await this._usersService.verifyUserCredential(username,
			password);

		const accessToken = this._tokenManager.generateAccessToken({id});
		const refreshToken = this._tokenManager.generateRefreshToken({id});

		await this._authenticationsService.addRefreshToken(refreshToken);

		return ResponseHelper.buildSuccessResponse(
			h,
			ResponseHelper.RESPONSE_CREATED,
			{accessToken, refreshToken});
	}
	/**
	 * Request access token from refresh token
	 * @param {*} request
	 * @param {*} h
	 * @return {object} response new acces token
	 */
	async putAuthenticationHandler(request, h) {
		this._validator.validatePutAuthenticationPayload(request.payload);

		const {refreshToken} = request.payload;
		await this._authenticationsService.verifyRefreshToken(refreshToken);
		const {id} = this._tokenManager.verifyRefreshToken(refreshToken);

		const accessToken = this._tokenManager.generateAccessToken({id});

		return ResponseHelper.buildSuccessResponse(
			h,
			ResponseHelper.RESPONSE_OK,
			{accessToken});
	}
	/**
	 * Request delete refresh token on database
	 * @param {*} request
	 * @param {*} h
	 * @return {object} response
	 */
	async deleteAuthenticationHandler(request, h) {
		this._validator.validateDeleteAuthenticationPayload(request.payload);

		const {refreshToken} = request.payload;
		await this._authenticationsService.verifyRefreshToken(refreshToken);
		await this._authenticationsService.deleteRefreshToken(refreshToken);

		return ResponseHelper.buildSuccessResponse(
			h,
			ResponseHelper.RESPONSE_DELETED);
	}
}

export default AuthenticationsHandler;
