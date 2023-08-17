import 'dotenv/config';
import { server as _server } from '@hapi/hapi';
// Albums API
import albums from './api/albums/index.js';
import AlbumService from './services/postgres/AlbumService.js';
import AlbumValidator from './validator/albums/index.js';
// Songs API
import songs from './api/songs/index.js';
import SongService from './services/postgres/SongService.js';
import SongValidator from './validator/songs/index.js';

import ClientError from './exceptions/ClientError.js';


const init = async () => {
	const albumsService = new AlbumService();
	const songsService = new SongService();
	const server = _server({
		port: process.env.PORT,
		host: process.env.HOST,
		routes: {
			cors: {
				origin: ['*'],
			},
		},
	});
 
	await server.register([{
		plugin: albums,
		options: {
			service: albumsService,
			validator: AlbumValidator,
		},
	},
	{
		plugin: songs,
		options: {
			service: songsService,
			validator: SongValidator,
		},
	}]);

	
	server.ext('onPreResponse', (request, h) => {
		// mendapatkan konteks response dari request
		const { response } = request;
		if (response instanceof Error) {

			// penanganan client error secara internal.
			if (response instanceof ClientError) {
				const newResponse = h.response({
					status: 'fail',
					message: response.message,
				});
				newResponse.code(response.statusCode);
				return newResponse;
			}
			// mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
			if (!response.isServer) {
				return h.continue;
			}
			// penanganan server error sesuai kebutuhan
			const newResponse = h.response({
				status: 'error',
				message: 'terjadi kegagalan pada server kami',
			});
			newResponse.code(500);
			return newResponse;
		}
		// jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
		return h.continue;
	});
	
	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();
