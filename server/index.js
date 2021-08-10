const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const apis = require('./routes/apis');
const fileUpload = require('express-fileupload');

//PORT
const port = process.env.PORT || 5000;

// Middlewares

app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', apis);
app.use(express.static("server"));
app.use('/images', express.static('images')); 

// Client App
app.use(express.static(__dirname + "/public/"));
app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});