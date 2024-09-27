const  express = require('express');
const app = express();
app.use(express.json());

require('dotenv').config(); //Access to the .env file
const logger = require("./middlewares/logger");
const {notFound, errorHandler} = require("./middlewares/notFound");
const connectToDb = require('./config/db')


//connect to database
connectToDb();

// costume middleware
app.use(logger);

// Routes
app.use('/api/auth', require('./routes/auth'))


//Error Handling middleware
app.use(notFound);
app.use(errorHandler);


//Running  the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Service is running in ${process.env.NODE_ENV} port ${PORT}`));