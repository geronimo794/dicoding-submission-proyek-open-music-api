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
	 * @param {*} collaborationsService Main service
	 * @param {*} playlistsService Playlist service
	 * @param {*} validator
	 */
	constructor(collaborationsService, playlistsService, validator) {
		this._collaborationsService = collaborationsService;
		this._playlistsService = playlistsService;
		this._validator = validator;
	}
	/**
	 * Add single playlist handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async postCollaborationHandler(request, h) {
		// Validate input
		this._validator.validateCollaborationPayload(request.payload);
		const {playlistId, userId} = request.payload;

		// Verify playlist owner
		const {id: ownerUserId} = request.auth.credentials;
		await this._playlistsService.verifyPlaylistOwner(playlistId, ownerUserId);

		// Add collaboration
		const collaborationId =
			await this._collaborationsService.addCollaboration({playlistId, userId});

		// Response
		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_CREATED, {collaborationId});
	}
	/**
	 * Delete single data handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async deleteCollaborationHandler(request, h) {
		// Validate input
		this._validator.validateCollaborationPayload(request.payload);
		const {playlistId, userId} = request.payload;

		// Verify playlist owner
		const {id: ownerUserId} = request.auth.credentials;
		await this._playlistsService.verifyPlaylistOwner(playlistId, ownerUserId);

		// Add collaboration
		await this._collaborationsService.deleteCollaboration({playlistId, userId});

		// Response
		return ResponseHelper.buildSuccessResponse(h,
			ResponseHelper.RESPONSE_OK);
	}
}

export default PlaylistsHandler;
