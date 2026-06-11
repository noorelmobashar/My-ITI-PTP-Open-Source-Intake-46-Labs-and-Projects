const Donation = require('../models/donations');
const donationService = require("../services/donationService");
const sendEmail = require("../services/emailService");

const createDonation = async (req, res) => {
    try {
        const donation = await donationService.createDonation(req.body.amount, req.user.id);
        const paymentLinkData = await donationService.createPaymentLink(donation);
        await donationService.updateDonation(donation._id, { providerSessionId: paymentLinkData._id, link: paymentLinkData.sessionUrl });
        await sendEmail('createdDonation.ejs', { amount: donation.amount, link: paymentLinkData.sessionUrl }, req.user.email, 'Your Donation Link');
        res.status(201).json({ 
            message: 'Donation created successfully',
            data: 
            {
                donation,
                sessionUrl: paymentLinkData.sessionUrl
             }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create donation', error: error.message });
    }
}

const handleWebhook = async (req, res) => {
    try {
        const { data } = req.body;
        const merchantOrderId = data?.merchantOrderId;
        const status = data?.status;

        if (!merchantOrderId || !status) {
            return res.status(400).json({ message: 'Invalid webhook data' });
        }

        const donation = await Donation.findById(merchantOrderId).populate('user');

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (status === 'SUCCESS') {
            await donationService.updateDonation(merchantOrderId, { status: 'completed' });
            await sendEmail('completedDonation.ejs', { name: donation.user.name, amount: data.amount, transactionId: merchantOrderId }, donation.user.email, 'Donation Successfully Processed');
        } else {
            await donationService.updateDonation(merchantOrderId, { status: 'failed' });
            await sendEmail('failedDonation.ejs', { donorName: donation.user.name, amount: data.amount, transactionId: merchantOrderId }, donation.user.email, 'Donation Failed');
        }

        res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to process webhook', error: error.message });
    }
}

const listDonations = async (req, res) => {
    try {
        const donations = await donationService.listMyDonations(req.user.id);
        res.status(200).json({ 
            status: 'success',
            data: { donations }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch donations', error: error.message });
    }
}

const listAllDonations = async (req, res) => {
    try {
        const donations = await donationService.listAllDonations();
        const populatedDonations = await Promise.all(
            donations.map(async (donation) => {
                if (donation && typeof donation.populate === 'function') {
                    await donation.populate({ path: 'user', select: 'name email' });
                }

                return donation;
            })
        );
        
        res.status(200).json({ 
            status: 'success',
            data: { donations: populatedDonations }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch donations', error: error.message });
    }
}
module.exports = {
    createDonation,
    handleWebhook,
    listDonations,
    listAllDonations
};