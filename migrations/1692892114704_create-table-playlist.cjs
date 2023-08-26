exports.up = (pgm) => {
	pgm.createTable('playlists', {
		// Id
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},

		// Main table
		name: {
			type: 'VARCHAR(200)',
			notNull: true,
		},
		user_id: {
			type: 'VARCHAR(50)',
			notNull: false,
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
};

exports.down = (pgm) => {
	pgm.dropTable('playlists');
};
