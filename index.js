// Stolen from COMP1537
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
const fs = require('fs');

app.use('/lab0', express.static(path.join(__dirname, '/COMP4537/lab0')));
app.use('/lab1', express.static(path.join(__dirname, '/COMP4537/lab1')));

// Define a route for GET requests to the root URL
app.get('/', (req, res) => {
    let doc = fs.readFileSync('./index.html', 'utf8');
    res.send(doc);
});

app.get('/COMP4537/lab0/', (req, res) => {
    let doc = fs.readFileSync('./COMP4537/lab0/index.html', 'utf8');
    res.send(doc);
});

app.get('/COMP4537/lab1/', (req, res) => {
    let doc = fs.readFileSync('./COMP4537/lab1/index.html', 'utf8');
    res.send(doc);
});

// Start the server
let port = 3000;
app.listen(port, () => {
  console.log(`HEEEEEELP HELP MEEEEEEEEE http://localhost:${port}`);
}); 