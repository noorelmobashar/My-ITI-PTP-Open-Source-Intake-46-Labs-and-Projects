const crypto = require('crypto');
const queryString = require('query-string');
const _ = require('underscore');
const APIError = require('../utils/APIError');

const validateKashierHash = (req, res, next) => {
    const { data } = req.body;
    const signatureKeys = data?.signatureKeys;

    if (!Array.isArray(signatureKeys)) {
        throw new APIError('Invalid webhook payload: signatureKeys missing', 400);
    }

    const objectSignaturePayload = _.pick(data, signatureKeys);
    const signaturePayload = queryString.stringify(objectSignaturePayload);
    const signature = crypto
        .createHmac('sha256', process.env.KASHIER_API_KEY)
        .update(signaturePayload)
        .digest('hex');
    const kashierSignature = req.header('x-kashier-signature');
    if (kashierSignature !== signature) {
        throw new APIError('Invalid signature', 401);
    }

    next();
}

module.exports = validateKashierHash;