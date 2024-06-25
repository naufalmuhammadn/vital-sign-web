const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const { db } = require('./utils/db.js')

const errorHandlerMiddleware = require('./middleware/errorHandler.js')
const notFoundMiddleware = require('./middleware/notFound.js')

const patientRoute = require('./routes/patientRoute.js')

require('dotenv').config()

const app = express()

app.use(cors())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.json())

app.use('/api/v1/patient', patientRoute)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    db(process.env.MONGODB_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();