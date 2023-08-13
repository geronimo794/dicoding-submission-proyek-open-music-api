import 'dotenv/config';
import { server as _server } from '@hapi/hapi';
// Notes API
import notes from './api/notes/index.js';
import NotesService from './services/postgres/NoteService.js';
import NotesValidator from './validator/notes/index.js';
// Albums API
import albums from './api/albums/index.js';
import AlbumService from './services/postgres/AlbumService.js';
import AlbumValidator from './validator/albums/index.js';


const init = async () => {
	const notesService = new NotesService();
	const albumsService = new AlbumService();
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
		plugin: notes,
		options: {
			service: notesService,
			validator: NotesValidator,
		},
	},
	{
		plugin: albums,
		options: {
			service: albumsService,
			validator: AlbumValidator,
		},
	}]);
 
	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();
