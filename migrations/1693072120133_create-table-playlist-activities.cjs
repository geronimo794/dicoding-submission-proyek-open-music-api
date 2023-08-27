exports.up = (pgm) => {
	pgm.createType( 'activities_action', ['delete', 'add'] );

	pgm.createTable('playlist_song_activities', {
		// Id
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},

		// Main table
		playlist_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		song_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		user_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		action: {
			type: 'activities_action',
			notNull: true,
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

	// playlist_id FK
	pgm.addConstraint( 'playlist_song_activities',
		'playlist_id_on_playlist_song_activities_table_fkey', {
			foreignKeys: {
				columns: 'playlist_id',
				references: 'playlists(id)',
				onDelete: 'cascade',
				onUpdate: 'cascade',
			},
		},
	);


	// song_id FK
	pgm.addConstraint( 'playlist_song_activities',
		'song_id_on_playlist_song_activities_table_fkey', {
			foreignKeys: {
				columns: 'song_id',
				references: 'songs(id)',
				onDelete: 'cascade',
				onUpdate: 'cascade',
			},
		},
	);

	// user_id FK
	pgm.addConstraint( 'playlist_song_activities',
		'user_id_on__playlist_song_activities_table_fkey', {
			foreignKeys: {
				columns: 'user_id',
				references: 'users(id)',
				onDelete: 'cascade',
				onUpdate: 'cascade',
			},
		},
	);
};

exports.down = (pgm) => {
	// Delete user_id FK
	pgm.dropConstraint( 'user_song_activities',
		'user_id_on__playlist_song_activities_table_fkey');
	// Delete song_id FK
	pgm.dropConstraint( 'playlist_song_activities',
		'song_id_on_playlist_song_activities_table_fkey');
	// Delete playlist_id FK
	pgm.dropConstraint( 'playlist_song_activities',
		'playlist_id_on_playlist_song_activities_table_fkeys');
	// Delete main table
	pgm.dropTable('user_song_activities');
};
