const  express = require('express');

require('dotenv').config(); //Access to the .env file
const logger = require("./middlewares/logger");
const {notFound, errorHandler} = require("./middlewares/notFound");
const connectToDb = require('./config/db')


//connect to database
connectToDb();
const app = express();
app.use(express.json());

//Running  the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Service is running in ${process.env.NODE_ENV} port ${PORT}`));