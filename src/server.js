import 'dotenv/config';
import { server as _server } from '@hapi/hapi';
import notes from './api/notes/index.js';
import NotesService from './services/postgres/NoteService.js';
import NotesValidator from './validator/notes/index.js';

const init = async () => {
	const notesService = new NotesService();
	const server = _server({
		port: process.env.PORT,
		host: process.env.HOST,
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
			validator: NotesValidator,
		},
	});
 
	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();
