const mongoose = require('mongoose');
const generateRandomInvoiceNumber = () => {
  const prefix = 'INV'; // You can change this prefix as per your requirement
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${randomNumber}`;
};


const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true
  },
  companyName: {
    type: String,
    required: true
  },
  
creditCardNo:{
  type: Number,
  required: true
},

  mobileNo: {
    type: String,
    required: true
  },
  vehicleNo: {
    type: String,
    required: true
  },
  invoiceDate: {
    type: Date,
    required: true
  },
  paymentMode: {
    type: String,
    required: false
  },
  additionalChargesAmount: {
    type: Number,
    required: false
  },
  cardNumber: {
    type: String
  },
  dieselAmount: {
    type: Number,
    required: false
  },
  dieselQuantity: {
    type: Number,
    required: false
  },
  dieselRate: {
    type: Number,
    required: false
  },
  petrolAmount: {
    type: Number,
    required: false
  },
  petrolQuantity: {
    type: Number,
    required: false
  },
  petrolRate: {
    type: Number,
    required: false
  },
  taxAmount: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  utrNumber: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

invoiceSchema.pre('save', function(next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = generateRandomInvoiceNumber();
  }
  next();
});
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
