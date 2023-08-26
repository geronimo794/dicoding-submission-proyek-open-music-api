/* eslint-disable camelcase */
const mapPlaylistDBToModel = ({
	id,
	name,
	user_id,
}) => ({
	id,
	name,
	userId: user_id,
});

export default mapPlaylistDBToModel;
