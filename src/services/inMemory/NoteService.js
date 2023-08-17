import {nanoid} from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
/**
 * Note service logical function
 * Save to memory
 */
class NotesService {
	/**
	 * Constructor to save notes
	 */
	constructor() {
		this._notes = [];
	}
	/**
	 * Add note function
	 * @param {*} param0
	 * @return {string|error}
	 */
	addNote({title, body, tags}) {
		const id = nanoid(16);
		const createdAt = new Date().toISOString();
		const updatedAt = createdAt;

		const newNote = {
			title, tags, body, id, createdAt, updatedAt,
		};

		this._notes.push(newNote);
		const isSuccess = this._notes.filter((note) => note.id === id).length > 0;

		if (!isSuccess) {
			throw new InvariantError('Catatan gagal ditambahkan');
		}

		return id;
	}
	/**
	 * Get note data from list
	 * @return {array}
	 */
	getNotes() {
		return this._notes;
	}
	/**
	 * Get single note by id
	 * @param {*} id
	 * @return {*} Single note
	 */
	getNoteById(id) {
		const note = this._notes.filter((n) => n.id === id)[0];
		if (!note) {
			throw new NotFoundError('Catatan tidak ditemukan');
		}
		return note;
	}
	/**
	 * Edit note by id
	 * @param {*} id
	 * @param {*} param1 object of note
	 */
	editNoteById(id, {title, body, tags}) {
		const index = this._notes.findIndex((note) => note.id === id);

		if (index === -1) {
			throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
		}

		const updatedAt = new Date().toISOString();

		this._notes[index] = {
			...this._notes[index],
			title,
			tags,
			body,
			updatedAt,
		};
	}
	/**
	 * Delete note by id
	 * @param {*} id
	 */
	deleteNoteById(id) {
		const index = this._notes.findIndex((note) => note.id === id);
		if (index === -1) {
			throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
		}
		this._notes.splice(index, 1);
	}
}

export default NotesService;
