import ResponseHelper from '../../utils/ResponseHelper.js';
/**
 * Song Request Handler
 */
class SongsHandler {
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
	 * Add single song handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async postSongHandler(request, h) {
		this._validator.validateSongPayload(request.payload);

		const {title, year, genre, performer, duration, albumId} = request.payload;
		const songId = await this._service.addSong(
			{title, year, genre, performer, duration, albumId});

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_CREATED, {songId});
	}
	/**
	 * Get list song handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async getSongsHandler(request, h) {
		const data = await this._service.getSongs(
			request.query.title, request.query.performer);

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_OK, {songs: data});
	}
	/**
	 * Get single song data handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async getSongByIdHandler(request, h) {
		const {id} = request.params;
		const data = await this._service.getSongById(id);

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_OK, {song: data});
	}
	/**
	 * Edit single song data handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async putSongByIdHandler(request, h) {
		this._validator.validateSongPayload(request.payload);
		const {id} = request.params;

		await this._service.editSongById(id, request.payload);
		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_UPDATED);
	}
	/**
	 * Delete single data handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async deleteSongByIdHandler(request, h) {
		const {id} = request.params;
		await this._service.deleteSongById(id);
		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_DELETED);
	}
}

export default SongsHandler;
