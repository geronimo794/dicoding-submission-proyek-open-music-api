/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
	pgm.createTable('songs', {
		// Id
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},

		// Main table
		title: {
			type: 'VARCHAR(200)',
			notNull: true,
		},
		year: {
			type: 'INT',
			notNull: true,
		},
		genre: {
			type: 'INT',
			notNull: true,
		},
		performer: {
			type: 'VARCHAR(100)',
			notNull: true,
		},
		duration: {
			type: 'INT',
			notNull: false,
		},
		album_id: {
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

exports.down = pgm => {
	pgm.dropTable('songs');
};
