import { server as _server } from '@hapi/hapi';
import notes from './api/notes/index.js';
import NotesService from './services/inMemory/NoteService.js';
 
const init = async () => {
	const notesService = new NotesService();
	const server = _server({
		port: 8080,
		host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
		routes: {
			cors: {
				origin: ['*'],
			},
		},
	});
 
	await server.register({
		plugin: notes,
		options: {
			service: notesService,
		},
	});
 
	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();
