import PlaylistsHandler from './handler.js';
import routes from './route.js';

export default {
	name: 'playlists',
	version: '1.0.0',
	register: async (server,
		{playlistsService, collaborationsService, validator}) => {
		const playlistHandler =
			new PlaylistsHandler(playlistsService, collaborationsService, validator);
		server.route(routes(playlistHandler));
	},
};
