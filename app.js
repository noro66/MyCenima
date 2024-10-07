const  express = require('express');
const app = express();
app.use(express.json());

require('dotenv').config(); //Access to the .env file
const logger = require("./middlewares/logger");
const {notFound, errorHandler} = require("./middlewares/notFound");
const connectToDb = require('./config/db')
const cors = require('cors');
app.use(cors({
    origin : "http://localhost:5173"
}));

//connect to database
connectToDb();

// costume middleware
app.use(logger);

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/film', require('./routes/film'))
app.use('/api/salle', require('./routes/salle'))
app.use('/api/seance', require('./routes/seance'))
app.use('/api/reservation', require('./routes/reservation'))



//Error Handling middleware
app.use(notFound);
app.use(errorHandler);


//Running  the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Service is running in ${process.env.NODE_ENV} port ${PORT}`));