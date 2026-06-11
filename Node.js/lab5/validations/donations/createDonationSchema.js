const joi = require("joi");

const createDonationSchema = joi.object({
    amount: joi.number().min(10).positive().required()
}).unknown(false);

module.exports = {
    body: createDonationSchema
}