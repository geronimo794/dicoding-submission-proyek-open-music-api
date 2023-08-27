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
class PlaylistsService {
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
		const rowsData = [];

		// Get from current self
		const query = {
			text: 'SELECT playlists.id, name, users.username AS username '+
					'FROM playlists ' +
					'LEFT JOIN users ' +
					'ON playlists.user_id = users.id ' +
					'WHERE playlists.user_id = $1',
			values: [userId],
		};
		const result = await this._pool.query(query);
		rowsData.push(...result.rows);

		// Get from collaborated
		const queryCollab = {
			text: 'SELECT playlists.id, name, users.username AS username '+
					'FROM collaborations ' +
					// Relation with playlist
					'LEFT JOIN playlists ' +
					'ON collaborations.playlist_id = playlists.id ' +
					// Relation with users
					'LEFT JOIN users ' +
					'ON playlists.user_id = users.id ' +
					'WHERE collaborations.user_id = $1',
			values: [userId],
		};
		const resultCollab = await this._pool.query(queryCollab);
		rowsData.push(...resultCollab.rows);

		return rowsData;
	}
	/**
	 * Delete song function by song id
	 * @param {*} id
	 */
	async deletePlaylistsById(id) {
		// Delete all the related playlist on playlist_songs
		const queryPlaylistSongs = {
			text: 'DELETE FROM playlist_songs WHERE playlist_id = $1',
			values: [id],
		};
		await this._pool.query(queryPlaylistSongs);

		// Delete the playlist
		const query = {
			text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
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
		if (!result.rowCount) {
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
		// Find the song first
		const querySong = {
			text: 'SELECT * FROM songs WHERE id = $1',
			values: [songId],
		};
		const resultSong = await this._pool.query(querySong);

		if (!resultSong.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}

		// Proceed create song
		const createdAt = new Date().toISOString();
		const id = 'playlist-song-' + nanoid(16);

		const query = {
			text: 'INSERT INTO '+
				'playlist_songs(id, playlist_id, song_id, created_at, updated_at) ' +
				'VALUES($1, $2, $3, $4, $4) RETURNING id',
			values: [id, playlistId, songId, createdAt],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
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
					'WHERE playlists.id = $1',
			values: [playlistId],
		};
		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}

		// Get first single data and assigne new field songs
		const singleData = result.rows[0];

		const querySong = {
			text: 'SELECT songs.id, songs.title, songs.performer ' +
				'FROM playlist_songs '+
				'LEFT JOIN songs ' +
				'ON playlist_songs.song_id = songs.id ' +
				'WHERE playlist_songs.playlist_id = $1',
			values: [playlistId],
		};
		const resultSong = await this._pool.query(querySong);
		singleData['songs'] = resultSong.rows;
		return singleData;
	}
	/**
	 * Delete song to playlist
	 * @param {*} playlistId
	 * @param {*} songId
	 */
	async deletePlaylistSong(playlistId, songId) {
		// Delete the playlist
		const query = {
			text: 'DELETE FROM playlist_songs '+
				'WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
			values: [playlistId, songId],
		};
		const result = await this._pool.query(query);
		if (!result.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
		return result.rows[0].id;
	}
	/**
	 * PLAYLIST SONG ACTIVITIES SERVICE
	 */
	/**
	 * Create playlist song activity
	 * @param {*} playlistId
	 * @param {*} songId
	 * @param {*} userId
	 * @param {*} action
	 * @return {string} playlist_song_activities_id
	 */
	async addPlaylistSongActivity(playlistId, songId, userId, action) {
		const createdAt = new Date().toISOString();
		const id = 'playlist-song-act-' + nanoid(16);

		const query = {
			text: 'INSERT INTO playlist_song_activities ' +
				'(id, playlist_id, song_id, user_id, action, created_at, updated_at) ' +
				'VALUES($1, $2, $3, $4, $5, $6, $6) RETURNING id',
			values: [id, playlistId, songId, userId, action, createdAt],
		};

		const result = await this._pool.query(query);

		if (!result.rowCount) {
			throw new InvariantError(ResponseHelper.RESPONSE_FAILED);
		}
		return result.rows[0].id;
	}
	/**
	 * Get data playlist song activities
	 * @param {*} playlistId
	 * @return {array} array of activities
	 */
	async getPlaylistSongActivities(playlistId) {
		// Create object response
		const response = {};

		// Get playlist first
		const queryPlaylist = {
			text: 'SELECT id FROM playlists WHERE id = $1',
			values: [playlistId],
		};

		const resultPlaylist = await this._pool.query(queryPlaylist);

		if (!resultPlaylist.rowCount) {
			throw new NotFoundError(ResponseHelper.RESPONSE_NOT_FOUND);
		}
		response['playlistId'] = resultPlaylist.rows[0].id;

		// Get activities data
		const queryActivities = {
			text: 'SELECT ' +
				'users.username, ' +
				'songs.title, ' +
				'playlist_song_activities.action, ' +
				'playlist_song_activities.created_at AS time ' +
				// From table
				'FROM playlist_song_activities ' +
				// Relation with user
				'LEFT JOIN users ' +
				'ON playlist_song_activities.user_id = users.id ' +
				// Relation with song
				'LEFT JOIN songs ' +
				'ON playlist_song_activities.song_id = songs.id ' +
				'WHERE playlist_song_activities.playlist_id = $1',
			values: [playlistId],
		};

		const resultActivities = await this._pool.query(queryActivities);
		response['activities'] = resultActivities.rows;
		return response;
	}
}

export default PlaylistsService;
