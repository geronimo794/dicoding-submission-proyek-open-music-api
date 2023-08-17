import pgPkg from 'pg';
import { nanoid } from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import mapNoteDBToModel from '../../mapping/note.js';
import ResponseHelper from '../../utils/ResponseHelper.js';

const { Pool } = pgPkg;

class NotesService {
	constructor() {
		this._pool = new Pool();
	}
	async addNote({ title, body, tags }) {
		const id = nanoid(16);
		const createdAt = new Date().toISOString();
		const updatedAt = createdAt;

		const query = {
			text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
			values: [id, title, body, tags, createdAt, updatedAt],
		};

		const result = await this._pool.query(query);

		if (!result.rows[0].id) {
			throw new InvariantError(ResponseHelper.RESPONSE_FAILED);
		}
		return result.rows[0].id;
	}
	async getNotes() {
		const result = await this._pool.query('SELECT * FROM notes');
		return result.rows.map(mapNoteDBToModel);
	}
	async getNoteById(id) {
		const query = {
			text: 'SELECT * FROM notes WHERE id = $1',
			values: [id],
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}

		return result.rows.map(mapNoteDBToModel)[0];
	}
	async editNoteById(id, { title, body, tags }) {
		const updatedAt = new Date().toISOString();
		const query = {
			text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
			values: [title, body, tags, updatedAt, id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
	}
	async deleteNoteById(id) {
		const query = {
			text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
			values: [id],
		};
		const result = await this._pool.query(query);
		if (!result.rows.length) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
	}
}

export default NotesService;