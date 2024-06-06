const express = require('express');
const router = express.Router();
const companyController = require('../Controller/company');

router.post('/companies', companyController.createCompany);
router.get('/companies', companyController.getCompanies);
router.get('/companies/:id', companyController.getCompanyById);
router.put('/companies/:id', companyController.updateCompany);
router.put('/companiesUpdated/:id', companyController.updateCompany);
router.delete('/companies/:id', companyController.deleteCompany);
router.get('/companiesNumber/:creditCardNumber', companyController.getCompanyByCreditCardNumber);

module.exports = router;
