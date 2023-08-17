import 'dotenv/config';
import {server as _server} from '@hapi/hapi';
// Albums API
import albums from './api/albums/index.js';
import AlbumService from './services/postgres/AlbumService.js';
import AlbumValidator from './validator/albums/index.js';
// Songs API
import songs from './api/songs/index.js';
import SongService from './services/postgres/SongService.js';
import SongValidator from './validator/songs/index.js';

import ClientError from './exceptions/ClientError.js';
// Get response helper
import ResponseHelper from './utils/ResponseHelper.js';

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
		// Get context from request
		const {response} = request;
		if (response instanceof Error) {
			// Jika error diluar error server, seperti route 404
			// Tetap dihandle oleh hapi
			if (!response.isServer) {
				return h.continue;
			}

			// Jika error adalah client error
			if (response instanceof ClientError) {
				return ResponseHelper.buildErrorResponse(h, response.message);
			}

			// Penanganan server jika error diluar client
			return ResponseHelper.buildErrorResponse(h,
				response.RESPONSE_INTERNAL_ERROR);
		}

		// Jika tidak ada error maka akan melanjutkan response
		return h.continue;
	});

	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
