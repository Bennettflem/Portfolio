const express = require('express');

const app = express();
const PORT = 80;

app.use(express.static('static'));
app.use(express.urlencoded({extended: true}));


const routes = require('./src/routes');
app.use(routes)


app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));