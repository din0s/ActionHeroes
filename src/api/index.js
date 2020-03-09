const express = require('express')
require('dotenv').config()

const userRoutes = require('./routes/user');

const app = express()
const port = 4000

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/user', userRoutes);

/* Can't find the requested resourse */
app.use((req, res, next) => {
  const error = new Error('Resource not found');
  error.status = 404;
  next(error);
});

/* Any other error */
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// Start server
app.listen(port, () => console.log(`Example backend API listening on port ${port}!`))
