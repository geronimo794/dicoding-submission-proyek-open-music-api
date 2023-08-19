

exports.up = (pgm) => {
	pgm.createTable('users', {
		// Id
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},

		// Main Table
		username: {
			type: 'VARCHAR(50)',
			unique: true,
			notNull: true,
		},
		password: {
			type: 'TEXT',
			notNull: true,
		},
		fullname: {
			type: 'TEXT',
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
};

exports.down = (pgm) => {
	pgm.dropTable('users');
};
