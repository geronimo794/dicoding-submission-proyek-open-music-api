import ResponseHelper from '../../utils/ResponseHelper.js';
/**
 * Note Request Handler
 */
class NotesHandler {
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
	 * Add note handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async postNoteHandler(request, h) {
		this._validator.validateNotePayload(request.payload);

		const {title = 'untitled', body, tags} = request.payload;
		const noteId = await this._service.addNote({title, body, tags});

		return ResponseHelper.buildSuccessResponse(
			h,
			ResponseHelper.RESPONSE_CREATED,
			{noteId});
	}
	/**
	 * Get list note data handler
	 * @param {*} _
	 * @param {*} h
	 * @return {*} response
	 */
	async getNotesHandler(_, h) {
		const notes = await this._service.getNotes();

		return ResponseHelper.buildSuccessResponse(
			h,
			ResponseHelper.RESPONSE_OK,
			{notes});
	}
	/**
	 * Get single note data handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async getNoteByIdHandler(request, h) {
		const {id} = request.params;
		const note = await this._service.getNoteById(id);
		return ResponseHelper.buildSuccessResponse(
			h,
			ResponseHelper.RESPONSE_OK,
			{note});
	}
	/**
	 * Edit single note data handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async putNoteByIdHandler(request, h) {
		this._validator.validateNotePayload(request.payload);
		const {id} = request.params;

		await this._service.editNoteById(id, request.payload);
		return ResponseHelper.buildSuccessResponse(
			h,
			ResponseHelper.RESPONSE_UPDATED);
	}
	/**
	 * Delete single data handler
	 * @param {*} request
	 * @param {*} h
	 * @return {*} response
	 */
	async deleteNoteByIdHandler(request, h) {
		const {id} = request.params;
		await this._service.deleteNoteById(id);
		return ResponseHelper.buildSuccessResponse(
			h,
			ResponseHelper.RESPONSE_DELETED);
	}
}

export default NotesHandler;
