const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
app.use(express.static('src'))

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
let jsonParser = bodyParser.json();

// Create index route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/src/index.html'));
});

// Create DB
app.get('/createdb', (req, res) => {
  let sql = 'CREATE DATABASE nodemysql';
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      res.send('Database created');
      console.log(res);
    }
  });
});

// Create connection
const db = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : '',
  database: 'nodemysql'
});

// Connect
db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log('MySql connected...');
  }
});

// Create Table
app.get('/createholotable', (req, res) => {
  let sql = 'CREATE TABLE holo (id int AUTO_INCREMENT, name VARCHAR(255), date VARCHAR(255), author VARCHAR(255), comments VARCHAR(255), PRIMARY KEY(id))';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send('Holo table created...')
  });
});

// Insert post 1
app.get('/addpost1', (req, res) => {
  let post = {
    title: 'Post one',
    body: 'This is post number one'
  };
  let sql = 'INSERT INTO posts SET ?';
  let query = db.query(sql, post, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Post 1 added.')
  });
});

// Insert post 2
app.get('/addpost2', (req, res) => {
  let post = {
    title: 'Post two',
    body: 'This is post number two'
  };
  let sql = 'INSERT INTO posts SET ?';
  let query = db.query(sql, post, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Post 2 added.')
  });
});

// Select posts
app.get('/getposts', (req, res) => {
    let sql = 'SELECT * FROM posts';
    let query = db.query(sql, (err, results) => {
    if(err) throw err;
    console.log(results);
    res.send('Posts fetched...')
  });
});

// Select single post
app.get('/getpost/:id', (req, res) => {
  let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Post fetched...')
  });
});

// Update post
app.get('/updatepost/:id', (req, res) => {
  let newTitle = 'Updated Title';
  let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Post updated...')
  });
});

// Delete post
app.get('/deletepost/:id', (req, res) => {
  let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Post deleted...')
  });
});

// Post request - holo
app.post('/submit', urlencodedParser, (req, res) => {
  console.log(req.body);
  let update = req.body;
  let sql = 'INSERT INTO holo SET ?';
  let query = db.query(sql, update, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.send('Database Updated')
  });
});

// Get request - holo
app.get('/getholodata/:id', (req, res) => {
    let sql = `SELECT * FROM holo WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
    if(err) throw err;
    console.log(results);
    console.log(JSON.stringify(results, null, 2));
    //res.send(results);
    res.send(JSON.stringify(results, null, 2));
  });
});

// Get all holo data
app.get('/getholodata/', (req, res) => {
  let sql = 'SELECT * FROM holo';
  let query = db.query(sql, (err, results) => {
  if(err) throw err;
  console.log(results);
  res.send(JSON.stringify(results, null, 2));
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});
