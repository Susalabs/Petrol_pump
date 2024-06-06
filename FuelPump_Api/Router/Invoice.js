const express = require('express');
const router = express.Router();
const invoiceController = require('../Controller/Invoice'); // Adjust the path to your controller

// Route to create a new invoice
router.post('/invoices', invoiceController.createInvoice);

// Route to get all invoices
router.get('/invoices', invoiceController.getAllInvoices);

// Route to get a single invoice by ID
router.get('/invoices/:id', invoiceController.getInvoiceById);
router.get('/invoicesCreditCardNumber/:creditCardNo', invoiceController.findInvoicesByCreditCardNo);

// Route to update an invoice by ID
router.put('/invoices/:id', invoiceController.updateInvoiceById);

// Route to delete an invoice by ID
router.delete('/invoices/:id', invoiceController.deleteInvoiceById);

module.exports = router;
