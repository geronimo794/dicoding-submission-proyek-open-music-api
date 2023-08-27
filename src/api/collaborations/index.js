import CollaborationsHandler from './handler.js';
import routes from './route.js';

export default {
	name: 'collaborations',
	version: '1.0.0',
	register: async (server,
		{collaborationsService, playlistsService, validator}) => {
		const collaborationHandler =
			new CollaborationsHandler(
				collaborationsService,
				playlistsService,
				validator);
		server.route(routes(collaborationHandler));
	},
};
