import ClientError from '../../exceptions/ClientError.js';

class AlbumsHandler {
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.postAlbumHandler = this.postAlbumHandler.bind(this);
		this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
		this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
		this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
		this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
	}
	async postAlbumHandler(request, h) {
		try {
			this._validator.validateAlbumPayload(request.payload);

			const { name, year } = request.payload;

			const noteId = await this._service.addAlbum({ name, year });

			const response = h.response({
				status: 'success',
				message: 'Catatan berhasil ditambahkan',
				data: {
					noteId,
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
	async getAlbumsHandler() {
		const notes = await this._service.getAlbums();
		return {
			status: 'success',
			data: {
				notes,
			},
		};
	}
	async getAlbumByIdHandler(request, h) {
		try {
			const { id } = request.params;
			const note = await this._service.getAlbumById(id);
			return {
				status: 'success',
				data: {
					note,
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
	async putAlbumByIdHandler(request, h) {
		try {
			this._validator.validateAlbumPayload(request.payload);
			const { id } = request.params;

			await this._service.editAlbumById(id, request.payload);

			return {
				status: 'success',
				message: 'Catatan berhasil diperbarui',
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
	async deleteAlbumByIdHandler(request, h) {
		try {
			const { id } = request.params;
			await this._service.deleteAlbumById(id);
			return {
				status: 'success',
				message: 'Catatan berhasil dihapus',
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

export default AlbumsHandler;