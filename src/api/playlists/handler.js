import ResponseHelper from '../../utils/ResponseHelper.js';
import ActivityAction from '../../utils/ActivityAction.js';

/**
 * Playlist Request Handler
 */
class PlaylistsHandler {
	/**
	 * PLAYLIST HANDLER
	 */
	/**
	 * Constructor inject with function dependencies
	 * @param {*} playlistsService
	 * @param {*} collaborationsService
	 * @param {*} validator
	 */
	constructor(playlistsService, collaborationsService, validator) {
		this._playlistsService = playlistsService;
		this._collaborationsService = collaborationsService;
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
		const playlistId =
			await this._playlistsService.addPlaylists({name, userId});

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

		const data = await this._playlistsService.getPlaylistsByUserId(userId);

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
		await this._playlistsService.verifyPlaylistOwner(id, userId);

		await this._playlistsService.deletePlaylistsById(id);
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
		const isAllowCollaborate = await this._collaborationsService.
			isAllowCollaborate({playlistId: id, userId});
		if (!isAllowCollaborate) {
			await this._playlistsService.verifyPlaylistOwner(id, userId);
		}

		const playlistSongId =
			await this._playlistsService.addPlaylistSong(id, songId);

		// Add activities log: ADD
		await this._playlistsService.addPlaylistSongActivity(
			id, songId, userId, ActivityAction.ADD);

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
		const isAllowCollaborate = await this._collaborationsService.
			isAllowCollaborate({playlistId: id, userId});
		if (!isAllowCollaborate) {
			await this._playlistsService.verifyPlaylistOwner(id, userId);
		}

		const playlist =
			await this._playlistsService.getPlaylistSongByPlaylistId(id);

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
		const isAllowCollaborate = await this._collaborationsService.
			isAllowCollaborate({playlistId: id, userId});
		if (!isAllowCollaborate) {
			await this._playlistsService.verifyPlaylistOwner(id, userId);
		}

		const playlistSongId =
			await this._playlistsService.deletePlaylistSong(id, songId);

		// Add activities log: DELETE
		await this._playlistsService.addPlaylistSongActivity(
			id, songId, userId, ActivityAction.DElETE);

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_OK, {playlistSongId});
	}
	/**
	 * Get playlist song activities handler
	 * @param {*} request
	 * @param {*} h
	 */
	async getPlaylistSongActivitiesHandler(request, h) {
		const {id} = request.params; // playlistId

		// Get userId from JWT Token
		const {id: userId} = request.auth.credentials;

		// Verify the resource before proceed
		const isAllowCollaborate = await this._collaborationsService.
			isAllowCollaborate({playlistId: id, userId});
		if (!isAllowCollaborate) {
			await this._playlistsService.verifyPlaylistOwner(id, userId);
		}

		// Playlist song activities
		const response = await this._playlistsService.getPlaylistSongActivities(id);

		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_OK, response);
	}
}

export default PlaylistsHandler;
