import { NotePayloadSchema } from './schema';
import {InvariantError} from '../../exceptions/InvariantError.js';

const NotesValidator = {
	validateNotePayload: (payload) => {
		const validationResult = NotePayloadSchema.validate(payload);
		if (validationResult.error) {
			// throw new Error(validationResult.error.message);
			throw new InvariantError(validationResult.error.message);

		}
	},
};
 
export default NotesValidator;
