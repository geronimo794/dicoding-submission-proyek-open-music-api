exports.up = (pgm) => {
	pgm.createTable('playlist_songs', {
		// Id
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},

		// Main table
		playlist_id: {
			type: 'VARCHAR(50)',
			notNull: true,
			unique: true,
		},
		song_id: {
			type: 'VARCHAR(50)',
			notNull: true,
			unique: true,
		},

		// Timestamp
		created_at: {
			type: 'TEXT',
			notNull: true,
		},
		updated_at: {
			type: 'TEXT',
			notNull: true,
		},
	});

	// Playlist ID FK
	pgm.addConstraint( 'playlist_songs',
		'playlist_id_on_playlist_songs_table_fkey', {
			foreignKeys: {
				columns: 'playlist_id',
				references: 'playlists(id)',
				onDelete: 'restrict',
				onUpdate: 'restrict',
			},
		},
	);

	// Song ID FK
	pgm.addConstraint( 'playlist_songs', 'song_id_on_playlist_songs_table_fkey', {
		foreignKeys: {
			columns: 'song_id',
			references: 'songs(id)',
			onDelete: 'restrict',
			onUpdate: 'restrict',
		},
	});
};

exports.down = (pgm) => {
	pgm.dropConstraint( 'playlist_songs', 'song_id_on_playlist_songs_table_fkey');
	pgm.dropConstraint( 'playlist_songs',
		'playlist_id_on_playlist_songs_table_fkey');
	pgm.dropTable('playlist_songs');
};
