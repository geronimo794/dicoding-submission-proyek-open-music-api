import pgPkg from 'pg';
import { nanoid } from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import mapAlbumDBToModel from '../../mapping/album.js';
import mapSongDBToModel from '../../mapping/song.js';

const { Pool } = pgPkg;

class AlbumsService {
	constructor() {
		this._pool = new Pool();
	}
	async addAlbum({ name, year }) {
		const id = nanoid(16);
		const createdAt = new Date().toISOString();
		const updatedAt = createdAt;

		const query = {
			text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
			values: [id, name, year, createdAt, updatedAt],
		};

		const result = await this._pool.query(query);

		if (!result.rows[0].id) {
			throw new InvariantError('Album gagal ditambahkan');
		}
		return result.rows[0].id;
	}
	async getAlbums() {
		const result = await this._pool.query('SELECT * FROM albums');
		return result.rows.map(mapAlbumDBToModel);
	}
	async getAlbumById(id) {
		const query = {
			text: 'SELECT * FROM albums WHERE id = $1',
			values: [id],
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError('Album tidak ditemukan');
		}

		const data = result.rows.map(mapAlbumDBToModel)[0];

		// Get song data
		const querySongs = {
			text: 'SELECT * FROM songs WHERE album_id = $1',
			values: [id],
		};
		const resultSongs = await this._pool.query(querySongs);
		data['songs'] = resultSongs.rows.map(mapSongDBToModel);

		return data;
	}
	async editAlbumById(id, { name, year }) {
		const updatedAt = new Date().toISOString();
		const query = {
			text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
			values: [name, year, updatedAt, id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
		}
	}
	async deleteAlbumById(id) {
		const query = {
			text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
			values: [id],
		};
		const result = await this._pool.query(query);
		if (!result.rows.length) {
			throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
		}
	}
}

export default AlbumsService;