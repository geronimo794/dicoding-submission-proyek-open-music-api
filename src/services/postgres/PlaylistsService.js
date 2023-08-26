import pgPkg from 'pg';
import {nanoid} from 'nanoid';
import InvariantError from '../../exceptions/InvariantError.js';
import AuthorizationError from '../../exceptions/AuthorizationError.js';
import NotFoundError from '../../exceptions/NotFoundError.js';
import ResponseHelper from '../../utils/ResponseHelper.js';
import mapPlaylistDBToModel from '../../mapping/playlist.js';

const {Pool} = pgPkg;

/**
 * Playlists service action
 */
class PlaylistssService {
	/**
	 * Constructor to get psql pool
	 */
	constructor() {
		this._pool = new Pool();
	}
	/**
	 * PLAYLIST SERVICE
	 */
	/**
	 * Add song function with query
	 * @param {*} param0 Object of song
	 * @return {object} Object of inserted id
	 */
	async addPlaylists({name, userId}) {
		const id = 'playlist-' + nanoid(16);
		const createdAt = new Date().toISOString();

		const query = {
			text: 'INSERT INTO playlists '+
				'VALUES($1, $2, $3, $4, $4) RETURNING id',
			values: [id, name, userId, createdAt],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new InvariantError(ResponseHelper.RESPONSE_FAILED);
		}
		return result.rows[0].id;
	}
	/**
	 * Get song by id
	 * @param {*} userId
	 * @return {object} Object of selected id
	 */
	async getPlaylistsByUserId(userId) {
		const query = {
			text: 'SELECT playlists.id, name, users.username AS username '+
					'FROM playlists ' +
					'LEFT JOIN users ' +
					'ON playlists.user_id = users.id ' +
					'WHERE user_id = $1',
			values: [userId],
		};
		console.log(query.text);
		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}

		return result.rows;
	}
	/**
	 * Delete song function by song id
	 * @param {*} id
	 */
	async deletePlaylistsById(id) {
		const query = {
			text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
			values: [id],
		};
		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
	}
	/**
	 * Verify playlist ownership by id and user_id
	 * @param {*} id
	 * @param {*} userId
	 */
	async verifyPlaylistOwner(id, userId) {
		const query = {
			text: 'SELECT user_id FROM playlists WHERE id = $1',
			values: [id],
		};
		const result = await this._pool.query(query);
		if (!result.rows.length) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
		const playlist = mapPlaylistDBToModel(result.rows[0]);
		if (playlist.userId !== userId) {
			throw new AuthorizationError(ResponseHelper.RESPONSE_UNAUTHORIZED);
		}
	}
	/**
	 * PLAYLIST SONG SERVICE
	 */
	/**
	 * Add song to playlist
	 * @param {*} playlistId
	 * @param {*} songId
	 */
	async addPlaylistSong(playlistId, songId) {
		const createdAt = new Date().toISOString();
		const id = 'playlist-song-' + nanoid(16);

		const query = {
			text: 'INSERT INTO '+
				'playlist_songs(id, playlist_id, song_id, created_at, updated_at) ' +
				'VALUES($1, $2, $3, $4, $4) RETURNING id',
			values: [id, playlistId, songId, createdAt],
		};

		const result = await this._pool.query(query);

		if (!result.rows[0].id) {
			throw new InvariantError(ResponseHelper.RESPONSE_FAILED);
		}
		return result.rows[0].id;
	}
	/**
	 * Get song from a playlist
	 * @param {*} playlistId
	 * @param {*} songId
	 */
	async getPlaylistSongByPlaylistId(playlistId) {
		const query = {
			text: 'SELECT playlists.id, name, users.username AS username '+
					'FROM playlists ' +
					'LEFT JOIN users ' +
					'ON playlists.user_id = users.id ' +
					'WHERE id = $1',
			values: [playlistId],
		};
		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}

		// Get first single data and assigne new field songs
		const singleData = result.rows[0];

		const querySong = {
			text: 'SELECT songs.id, songs.title, songs.title ' +
				'FROM playlist_songs '+
				'LEFT JOIN songs ' +
				'ON playlist_songs.song_id = songs.id ' +
				'WHERE playlist_songs.playlist_id = $1',
			values: [playlistId],
		};
		const resultSong = await this._pool.query(querySong);
		singleData['songs'] = resultSong;
		return singleData;
	}
	/**
	 * Delete song to playlist
	 * @param {*} playlistId
	 * @param {*} songId
	 */
	async deletePlaylistSong(playlistId, songId) {
		const query = {
			text: 'DELETE FROM playlist_songs '+
				'WHERE playlist_id = $1, song_id = $2 RETURNING id',
			values: [playlistId, songId],
		};
		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
		return result.rows[0].id;
	}
}

export default PlaylistssService;
