const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
const userRoute = require("./routes/userRoute");
const dbconfig = require("./config/dbconfig");
const port = process.env.PORT || 5000;

app.use('/api/user', userRoute);

app.listen(port, () => console.log(`Server running on port ${port}`));