import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);
 
const AlbumPayloadSchema = Joi.object({
	name: Joi.string().required(),
	year: Joi.date().format('YYYY').utc().required(),
});
 
export default AlbumPayloadSchema;
