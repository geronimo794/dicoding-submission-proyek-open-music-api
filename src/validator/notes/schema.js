import { object, string, array } from 'joi';
 
const NotePayloadSchema = object({
	title: string().required(),
	body: string().required(),
	tags: array().items(string()).required(),
});
 
export default { NotePayloadSchema };
