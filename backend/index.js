const express = require('express'); 
const mongoose = require('mongoose'); 
const cors = require('cors');
const dotenv = require('dotenv'); 
const connectDB = require('./config/db');

dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 5000; 

//middleware 
app.use(cors()); 
app.use(express.json()); 

//basic/default route 
app.get('/', (req, res) => {
    res.send('API is running...');
  });
//import routes 

//Mongodb 
connectDB(); 