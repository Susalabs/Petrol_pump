const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');

const cooKiParser =require('cookie-parser');
const mongoose = require('./dbConnection/databaseConnection');
const app = express();




app.use(cooKiParser());
app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Adjust the limit as needed


// Enable CORS for all routes
var corsOptions = {
    origin: 'http://localhost:4200', // Specify your trusted domain
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

 const Invoice = require('./Router/Invoice');
 app.use('/Invoice', Invoice);

 const Company = require('./Router/company');
 app.use('/Company', Company);

app.get('/',(req,res) =>{

   
    res.json('working')
})

app.use((err, req, res, next) => {
    console.error("Error Stack:", err.stack);
    console.error("Error Status:", err.statusCode);
    console.error("Error Message:", err.message);
    res.status(err.statusCode || 500).json({
        error: err.message || 'An error occurred'
    });
});

const port = process.env.PORT || 3000;

app.listen(port,() => console.log(`Server is up and running at ${port}`));
