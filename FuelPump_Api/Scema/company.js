const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generateCreditCardNumber = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

const CompanySchema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  creditLimit: {
    type: Number,
    required: true,
    min: 0,
  },
  availableLimit: {
    type: Number,
    required: false,
  },
  expiryDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > Date.now(); // Assuming expiry date should be in the future
      },
      message: 'Expiry date must be in the future'
    }
  },
  creditCardNumber: {
    type: String,
    required: true,
    unique: true,
    default: generateCreditCardNumber,
  }
}, { timestamps: true });

// Pre-save hook to update availableLimit based on changes in creditLimit
CompanySchema.pre('save', function(next) {
  // Check if creditLimit has been modified
  if (this.isModified('creditLimit')) {
    // Update availableLimit accordingly
    this.availableLimit = this.creditLimit;
  }
  next();
});

// Create a model from the schema
const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;
