import ResponseHelper from '../../utils/ResponseHelper.js';
/**
 * Playlist Request Handler
 */
class PlaylistsHandler {
	/**
	 * PLAYLIST HANDLER
	 */
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
	 * Add single playlist handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async postPlaylistHandler(request, h) {
		this._validator.validatePlaylistPayload(request.payload);

		// Get userId from JWT Token
		const {id: userId} = request.auth.credentials;

		const {name} = request.payload;
		const playlistId = await this._service.addPlaylists({name, userId});

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_CREATED, {playlistId});
	}
	/**
	 * Get list playlist handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async getPlaylistsHandler(request, h) {
		// Get userId from JWT Token
		const {id: userId} = request.auth.credentials;

		const data = await this._service.getPlaylistsByUserId(userId);

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_OK, {playlists: data});
	}
	/**
	 * Delete single data handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async deletePlaylistByIdHandler(request, h) {
		const {id} = request.params;

		// Get userId from JWT Token
		const {id: userId} = request.auth.credentials;

		// Verify the resource before proceed
		await this._service.verifyPlaylistOwner(id, userId);

		await this._service.deletePlaylistsById(id);
		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_DELETED);
	}
	/**
	 * PLAYLIST SONG HANDLER
	 */
	/**
	 * Add new song to playlist handler
	 * @param {*} request
	 * @param {*} h
	 */
	async postPlaylistSongHandler(request, h) {
		const {id} = request.params; // playlistId

		// Vefied input data
		await this._validator.validatePlaylistSongPayload(request.payload);
		const {songId} = request.payload;

		// Get userId from JWT Token
		const {id: userId} = request.auth.credentials;

		// Verify the resource before proceed
		await this._service.verifyPlaylistOwner(id, userId);

		const playlistSongId = await this._service.addPlaylistSong(id, songId);

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_CREATED, {playlistSongId});
	}
	/**
	 * Add new song to playlist handler
	 * @param {*} request
	 * @param {*} h
	 */
	async getPlaylistSongsHandler(request, h) {
		const {id} = request.params; // playlistId

		// Get userId from JWT Token
		const {id: userId} = request.auth.credentials;

		// Verify the resource before proceed
		await this._service.verifyPlaylistOwner(id, userId);

		const playlist = await this._service.getPlaylistSongByPlaylistId(id);

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_OK, {playlist});
	}
	/**
	 * Add new song to playlist handler
	 * @param {*} request
	 * @param {*} h
	 */
	async deletePlaylistSongHandler(request, h) {
		const {id} = request.params; // playlistId

		// Vefied input data
		await this._validator.validatePlaylistSongPayload(request.payload);
		const {songId} = request.payload;

		// Get userId from JWT Token
		const {id: userId} = request.auth.credentials;

		// Verify the resource before proceed
		await this._service.verifyPlaylistOwner(id, userId);

		const playlistSongId = await this._service.deletePlaylistSong(id, songId);

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_OK, {playlistSongId});
	}
}

export default PlaylistsHandler;
