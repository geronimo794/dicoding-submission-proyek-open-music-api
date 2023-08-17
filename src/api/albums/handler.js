import ResponseHelper from '../../utils/ResponseHelper.js';

class AlbumsHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;
	}
	async postAlbumHandler(request, h) {
		this._validator.validateAlbumPayload(request.payload);

		const { name, year } = request.payload;
		const albumId = await this._service.addAlbum({ name, year });

		return ResponseHelper.buildSuccessResponse(h, ResponseHelper.RESPONSE_CREATED, {albumId});
	}
	async getAlbumsHandler(_, h) {
		const albums = await this._service.getAlbums();

		return ResponseHelper.buildSuccessResponse(h, ResponseHelper.RESPONSE_OK, {albums: albums,});
	}
	async getAlbumByIdHandler(request, h) {
		const { id } = request.params;
		const data = await this._service.getAlbumById(id);
		
		return ResponseHelper.buildSuccessResponse(h, ResponseHelper.RESPONSE_OK, {album: data});
	}
	async putAlbumByIdHandler(request, h) {
		this._validator.validateAlbumPayload(request.payload);
		const { id } = request.params;

		await this._service.editAlbumById(id, request.payload);

		return ResponseHelper.buildSuccessResponse(h, ResponseHelper.RESPONSE_UPDATED);
	}
	async deleteAlbumByIdHandler(request, h) {
		const { id } = request.params;
		await this._service.deleteAlbumById(id);

		return ResponseHelper.buildSuccessResponse(h, ResponseHelper.RESPONSE_DELETED);
	}
}

export default AlbumsHandler;
