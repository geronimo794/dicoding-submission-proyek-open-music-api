exports.up = (pgm) => {
	pgm.addConstraint( 'playlists', 'user_id_on_playlists_table_fkey', {
		foreignKeys: {
			columns: 'user_id',
			references: 'users(id)',
			onDelete: 'restrict',
			onUpdate: 'restrict',
		},
	});
};

exports.down = (pgm) => {
	pgm.dropConstraint( 'users', 'user_id_on_playlists_table_fkey');
};
