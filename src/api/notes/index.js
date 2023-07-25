import NotesHandler from './handler.js';
import routes from './route.js';
 
export default {
	name: 'notes',
	version: '1.0.0',
	register: async (server, { service }) => {
		const notesHandler = new NotesHandler(service);
		server.route(routes(notesHandler));
	},
};
