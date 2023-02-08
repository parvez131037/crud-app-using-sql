const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud'
});

connection.connect((err) => {
  if (err) {
    console.error(`Error connecting to database: ${err.stack}`);
    return;
  }

  console.log(`Connected to database as id ${connection.threadId}`);
});


  
  app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error(`Error fetching users: ${error}`);
        return res.send(500);
      }
  
      return res.json(results);
    });
  });

  app.get('/users/:id', (req, res) => {
    const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error(`Error fetching user: ${error}`);
        return res.send(500);
      }
  
      return res.json(results[0]);
    });
  });

  app.post('/users/add', (req, res) => {
    const user = { name: req.body.name, email: req.body.email, age: req.body.age };
  
    const query = `INSERT INTO users SET ?`;
  
    connection.query(query, user, (error, results) => {
      if (error) {
        console.error(`Error creating user: ${error}`);
        return res.send(500);
      }
  
      return res.json({ id: results.insertId, ...user });
    });
  });

  app.put('/users/update/:id', (req, res) => {
    const user = { name: req.body.name, email: req.body.email, age:  req.body.age };
    const query = `UPDATE users SET ? WHERE id = ${req.params.id}`;
  
    connection.query(query, user, (error, results) => {
      if (error) {
        console.error(`Error updating user: ${error}`);
        return res.send(500);
      }
  
      return res.json({ id: req.params.id, ...user });
    });
  });

  app.delete('/users/delete/:id', (req, res) => {
    const query = `DELETE FROM users WHERE id = ${req.params.id}`;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error(`Error deleting user: ${error}`);
        return res.send(500);
      }
  
      return res.send(200);
    });
  });
  

app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});