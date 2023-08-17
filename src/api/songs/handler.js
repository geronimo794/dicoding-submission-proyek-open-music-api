
class SongsHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;
	}
	async postSongHandler(request, h) {
		this._validator.validateSongPayload(request.payload);

		const { title, year, genre, performer, duration, albumId } = request.payload;

		const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });

		const response = h.response({
			status: 'success',
			message: 'Lagu berhasil ditambahkan',
			data: {
				songId,
			},
		});
		response.code(201);
		return response;
	}
	async getSongsHandler(request, h) {
		const data = await this._service.getSongs(request.query.title, request.query.performer);

		const response = h.response({
			status: 'success',
			data: {
				songs: data,
			},
		});
		response.code(200);
		return response;
	}
	async getSongByIdHandler(request) {
		const { id } = request.params;
		const data = await this._service.getSongById(id);
		return {
			status: 'success',
			data: {
				song: data,
			},
		};
	}
	async putSongByIdHandler(request) {
		this._validator.validateSongPayload(request.payload);
		const { id } = request.params;

		await this._service.editSongById(id, request.payload);

		return {
			status: 'success',
			message: 'Lagu berhasil diperbarui',
		};
	}
	async deleteSongByIdHandler(request) {
		const { id } = request.params;
		await this._service.deleteSongById(id);
		return {
			status: 'success',
			message: 'Lagu berhasil dihapus',
		};
	}
}

export default SongsHandler;
