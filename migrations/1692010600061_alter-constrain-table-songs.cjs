
exports.up = (pgm) => {
	pgm.addConstraint( 'songs', 'album_id_on_songs_table_fkey', {
		foreignKeys: {
			columns: 'album_id',
			references: 'albums(id)',
			onDelete: 'restrict',
			onUpdate: 'restrict',
		},
	});
};

exports.down = (pgm) => {
	pgm.dropConstraint( 'songs', 'album_id_on_songs_table_fkey');
};
