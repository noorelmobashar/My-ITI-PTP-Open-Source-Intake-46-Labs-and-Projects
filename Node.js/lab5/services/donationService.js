// createDonation(amount, userId) — persists a new donation with status pending.
// updateDonation(id, data) — updates a donation by id and returns the updated document.
// createPaymentLink(donation) — calls the Kashier Payment Sessions API and returns the parsed response.

const Donation = require('../models/donations');
const sendEmail = require('./emailService');
const axios = require('axios');

require('dotenv').config();

const createDonation = async (amount, userId) => {
    const donation = new Donation({ amount, user: userId });
    await donation.save();
    return donation;
}

const updateDonation = async (id, data) => {
    const donation = await Donation.findByIdAndUpdate(id, data, { new: true });
    return donation;
}

const createPaymentLink = async (donation) => {
const response = await axios.post("https://test-api.kashier.io/v3/payment/sessions", {

        maxFailureAttempts: 3,
        paymentType: "credit",
        amount: donation.amount.toString(),
        currency: "EGP",
        order: donation._id,
        merchantRedirect: "https://example.com/redirect",
        display: "en",
        type: "one-time",
        allowedMethods: "card,wallet",
        redirectMethod: null,
        iframeBackgroundColor: "#FFFFFF",
        metaData: {
            customKey: "customValue",
            displayNotes: { "key": "value" }
        },
        merchantId: process.env.KASHIER_MERCHANT_ID,
        failureRedirect: false,
        brandColor: "#33e7ffff",
        defaultMethod: "card",
        description: "Payment for order ORD123456",
        manualCapture: false,
        saveCard: null,
        retrieveSavedCard: true,
        interactionSource: "ECOMMERCE",
        enable3DS: true,
        serverWebhook: process.env.KASHIER_WEBHOOK_URL
    }, {
        headers: {
            "Authorization": process.env.KASHIER_SECRET_KEY,
            "api-key": process.env.KASHIER_API_KEY
        }
    });
    console.log(response.data);
    return response.data;
}

const listMyDonations = async (userId) => {
    const donations = await Donation.find({ user: userId }).sort({ createdAt: -1 });
    return donations;
}

const listAllDonations = async () => {
    const donations = await Donation.find().sort({ createdAt: -1 });
    return donations;
}

module.exports = {
    createDonation,
    updateDonation,
    createPaymentLink,
    listMyDonations,
    listAllDonations
};