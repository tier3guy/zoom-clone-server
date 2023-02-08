const express = require('express');
const app = express();

// Configs
const PORT = process.env.PORT || 8000;
require('dotenv').config();

// Middlewares
app.use(express.json());
app.use(require('./routes/routes.js'));

// Database connection
const connectToDatabase = require('./db/index.js');
connectToDatabase();

app.listen(PORT, () => {
        console.log(`>> Server is running @ http://localhost:${PORT}`);
    }
);
