import BaseJoi from 'joi';
import JoiDate from '@joi/date';

const Joi = BaseJoi.extend(JoiDate);

const SongPayloadSchema = Joi.object({
	title: Joi.string().required(),
	year: Joi.date().format('YYYY').utc().required(),
	genre: Joi.string().required(),
	performer: Joi.string().required(),
	duration: Joi.number(),
	albumId: Joi.string(),
});

export default SongPayloadSchema;
