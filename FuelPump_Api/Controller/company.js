const Company = require('../Scema/company');

// Create a new company
const createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).send(company);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all companies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).send(companies);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a company by ID
const getCompanyById = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).send();
    }
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a company by ID
const updateCompany = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Fetch the current document
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).send({ error: 'Company not found' });
    }

    // Check if creditLimit is being updated
    if (updates.hasOwnProperty('creditLimit')) {
      updates.availableLimit = updates.creditLimit;
    }

    // Update the document with new values
    Object.assign(company, updates);
    await company.save({ runValidators: true });

    res.status(200).send(company);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = updateCompany;


// Delete a company by ID
const deleteCompany = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).send();
    }
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getCompanyByCreditCardNumber = async (req, res) => {
  const { creditCardNumber } = req.params;
  try {
    const company = await Company.findOne({ creditCardNumber });
    if (!company) {
      return res.status(404).send();
    }
    res.status(200).send(company);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getCompanyByCreditCardNumber,
};
