
exports.up = (pgm) => {
	pgm.createTable('collaborations', {
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
		user_id: {
			type: 'VARCHAR(50)',
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
	pgm.addConstraint( 'collaborations',
		'playlist_id_on_collaborations_table_fkey', {
			foreignKeys: {
				columns: 'playlist_id',
				references: 'playlists(id)',
				onDelete: 'cascade',
				onUpdate: 'cascade',
			},
		},
	);
	// user_id FK
	pgm.addConstraint( 'collaborations',
		'user_id_on_collaborations_table_fkey', {
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
	pgm.dropConstraint( 'collaborations',
		'user_id_on_collaborations_table_fkey');

	// Delete playlist_id FK
	pgm.dropConstraint( 'collaborations',
		'playlist_id_on_collaborations_table_fkey');

	// Delete main table
	pgm.dropTable('collaborations');
};
