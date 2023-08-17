/* eslint-disable camelcase */
const mapNoteDBToModel = ({
	id,
	title,
	body,
	tags,
	created_at,
	updated_at,
}) => ({
	id,
	title,
	body,
	tags,
	createdAt: created_at,
	updatedAt: updated_at,
});

export default mapNoteDBToModel;
