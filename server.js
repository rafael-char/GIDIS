const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const apiRouter = require('./consultas/api.js'); 
const bodyParser = require('body-parser');
const app = express();

const port = 4150;

app.use('/api', apiRouter);
app.use(bodyParser.json());



app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});


