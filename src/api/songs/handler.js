
class SongsHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.postSongHandler = this.postSongHandler.bind(this);
		this.getSongsHandler = this.getSongsHandler.bind(this);
		this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
		this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
		this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
	}
	async postSongHandler(request, h) {
		try {
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
		} catch (error) {
			return error;
		}
	}
	async getSongsHandler(request, h) {
		try {

			const data = await this._service.getSongs(request.query.title, request.query.performer);

			const response = h.response({
				status: 'success',
				data: {
					songs: data,
				},
			});
			response.code(200);
			return response;
		} catch (error) {
			return error;
		}

	}
	async getSongByIdHandler(request) {
		try {
			const { id } = request.params;
			const data = await this._service.getSongById(id);
			return {
				status: 'success',
				data: {
					song: data,
				},
			};
		} catch (error) {
			return error;
		}
	}
	async putSongByIdHandler(request) {
		try {
			this._validator.validateSongPayload(request.payload);
			const { id } = request.params;

			await this._service.editSongById(id, request.payload);

			return {
				status: 'success',
				message: 'Lagu berhasil diperbarui',
			};
		} catch (error) {
			return error;		
		}
	}
	async deleteSongByIdHandler(request) {
		try {
			const { id } = request.params;
			await this._service.deleteSongById(id);
			return {
				status: 'success',
				message: 'Lagu berhasil dihapus',
			};
		} catch (error) {
			return error;
		}
	}
}

export default SongsHandler;
