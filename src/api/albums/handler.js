import ResponseHelper from '../../utils/ResponseHelper.js';
/**
 * Album request handler
 */
class AlbumsHandler {
	/**
	 * Constructor inject with function dependencies
	 * @param {*} service
	 * @param {*} validator
	 */
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;
	}
	/**
	 * Add album data handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async postAlbumHandler(request, h) {
		this._validator.validateAlbumPayload(request.payload);

		const {name, year} = request.payload;
		const albumId = await this._service.addAlbum({name, year});

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_CREATED,
			{albumId});
	}
	/**
	 * Get list album data handler
	 * @param {*} _
	 * @param {*} h
	 * @return {*} response
	 */
	async getAlbumsHandler(_, h) {
		const albums = await this._service.getAlbums();

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_OK,
			{albums: albums});
	}
	/**
	 * Get single album data handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async getAlbumByIdHandler(request, h) {
		const {id} = request.params;
		const data = await this._service.getAlbumById(id);

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_OK,
			{album: data});
	}
	/**
	 * Edit single note data handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async putAlbumByIdHandler(request, h) {
		this._validator.validateAlbumPayload(request.payload);
		const {id} = request.params;

		await this._service.editAlbumById(id, request.payload);

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_UPDATED);
	}
	/**
	 * Delete single data handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async deleteAlbumByIdHandler(request, h) {
		const {id} = request.params;
		await this._service.deleteAlbumById(id);

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_DELETED);
	}
}

export default AlbumsHandler;
