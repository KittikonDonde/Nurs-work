const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// กำหนด multer instance
const upload = multer();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ใส่รหัสผ่านของ MySQL ที่ถูกต้อง
  database: 'mydatabase',
});

db.connect();
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // คำสั่ง SQL เพื่อค้นหาผู้ใช้จากฐานข้อมูล
  const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
  // ทำการ query ฐานข้อมูล
  db.query(sql, [username, password], (err, result) => {
      if (err) {
          // กรณีเกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล
          console.error(err);
          res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else {
          // ตรวจสอบว่ามีผู้ใช้งานที่ตรงกับข้อมูลที่รับมาหรือไม่
          if (result.length > 0) {
            
              res.json({ success: true, message: 'Login successful', user: result[0] });
          } else {
              res.status(401).json({ success: false, message: 'Invalid username or password' });
          }
      }
  });
});



app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM nd0102 ORDER BY id DESC;', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).json(result);
    }
  });
});

app.post('/api/data/create', (req, res) => {
  const { monthYear, a, b } = req.body;
  db.query('INSERT INTO nd0102 (monthYear, a, b) VALUES (?, ?, ?)', [monthYear, a, b], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(201).send('Data inserted successfully');
    }
  });
});

app.delete('/api/data/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM nd0102 WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Data deleted successfully');
    }
  });
});

app.put('/api/data/edit/:id', (req, res) => {
  const id = req.params.id;
  const { monthYear, a, b } = req.body;

  db.query('UPDATE nd0102 SET monthYear = ?, a = ?, b = ? WHERE id = ?', [monthYear, a, b, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Data updated successfully');
    }
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
