const { Router } = require('express');
const donationsController = require('../controllers/donationsController');
const validateKashierHash = require('../middlewares/validateKashierHash');
const createDonationSchema = require('../validations/donations/createDonationSchema');
const { validate, authenticate, authorizeTo, reqLogger } = require('../middlewares');

const router = Router();

router.post('/', authenticate ,validate(createDonationSchema), reqLogger, donationsController.createDonation);
router.post('/webhook', validateKashierHash, reqLogger, donationsController.handleWebhook);
router.get('/', authenticate, reqLogger, donationsController.listDonations);
router.get('/all', authenticate, authorizeTo('admin'), reqLogger, donationsController.listAllDonations);

module.exports = router;