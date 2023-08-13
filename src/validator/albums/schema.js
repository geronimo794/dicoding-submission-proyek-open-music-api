import Joi from 'joi';

 
const AlbumPayloadSchema = Joi.object({
	name: Joi.string().required(),
	year: Joi.date().format('YYYY').utc().required(),
});
 
export default AlbumPayloadSchema;
