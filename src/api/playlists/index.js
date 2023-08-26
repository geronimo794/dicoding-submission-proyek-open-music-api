import PlaylistsHandler from './handler.js';
import routes from './route.js';

export default {
	name: 'playlists',
	version: '1.0.0',
	register: async (server, {service, validator}) => {
		const playlistHandler = new PlaylistsHandler(service, validator);
		server.route(routes(playlistHandler));
	},
};
