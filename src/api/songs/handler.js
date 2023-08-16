import ClientError from '../../exceptions/ClientError.js';

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
			if (error instanceof ClientError) {
				const response = h.response({
					status: 'fail',
					message: error.message,
				});
				response.code(error.statusCode);
				return response;
			}

			// Server ERROR!
			const response = h.response({
				status: 'error',
				message: 'Maaf, terjadi kegagalan pada server kami.',
			});
			response.code(500);
			console.error(error);
			return response;
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
			if (error instanceof ClientError) {
				const response = h.response({
					status: 'fail',
					message: error.message,
				});
				response.code(error.statusCode);
				return response;
			}

			// Server ERROR!
			const response = h.response({
				status: 'error',
				message: 'Maaf, terjadi kegagalan pada server kami.',
			});
			response.code(500);
			console.error(error);
			return response;
		}

	}
	async getSongByIdHandler(request, h) {
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
			if (error instanceof ClientError) {
				const response = h.response({
					status: 'fail',
					message: error.message,
				});
				response.code(error.statusCode);
				return response;
			}

			// Server ERROR!
			const response = h.response({
				status: 'error',
				message: 'Maaf, terjadi kegagalan pada server kami.',
			});
			response.code(500);
			console.error(error);
			return response;
		}
	}
	async putSongByIdHandler(request, h) {
		try {
			this._validator.validateSongPayload(request.payload);
			const { id } = request.params;

			await this._service.editSongById(id, request.payload);

			return {
				status: 'success',
				message: 'Lagu berhasil diperbarui',
			};
		} catch (error) {
			if (error instanceof ClientError) {
				const response = h.response({
					status: 'fail',
					message: error.message,
				});
				response.code(error.statusCode);
				return response;
			}
			// Server ERROR!
			const response = h.response({
				status: 'error',
				message: 'Maaf, terjadi kegagalan pada server kami.',
			});
			response.code(500);
			console.error(error);
			return response;
		
		}
	}
	async deleteSongByIdHandler(request, h) {
		try {
			const { id } = request.params;
			await this._service.deleteSongById(id);
			return {
				status: 'success',
				message: 'Lagu berhasil dihapus',
			};
		} catch (error) {
			if (error instanceof ClientError) {
				const response = h.response({
					status: 'fail',
					message: error.message,
				});
				response.code(error.statusCode);
				return response;
			}
			
			// Server ERROR!
			const response = h.response({
				status: 'error',
				message: 'Maaf, terjadi kegagalan pada server kami.',
			});
			response.code(500);
			console.error(error);
			return response;
		}
	}
}

export default SongsHandler;
