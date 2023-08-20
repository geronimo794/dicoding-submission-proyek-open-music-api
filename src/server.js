import 'dotenv/config';
import {server as _server} from '@hapi/hapi';
import ClientError from './exceptions/ClientError.js';

// Albums API
import albums from './api/albums/index.js';
import AlbumsService from './services/postgres/AlbumsService.js';
import AlbumValidator from './validator/albums/index.js';

// Songs API
import songs from './api/songs/index.js';
import SongsService from './services/postgres/SongsService.js';
import SongValidator from './validator/songs/index.js';

// Users API
import users from './api/users/index.js';
import UsersService from './services/postgres/UsersService.js';
import UserValidator from './validator/users/index.js';


// Get response helper
import ResponseHelper from './utils/ResponseHelper.js';

const init = async () => {
	const albumsService = new AlbumsService();
	const songsService = new SongsService();
	const usersService = new UsersService();

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
		plugin: users,
		options: {
			service: usersService,
			validator: UserValidator,
		},
	},
	{
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
