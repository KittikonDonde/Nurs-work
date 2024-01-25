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

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet_name = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheet_name];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // ตัวอย่างการบันทึกข้อมูลลงในฐานข้อมูล
    data.forEach(row => {
      const [name, email] = row;
      db.query('INSERT INTO mytable (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) {
          console.error(err);
        }
      });
    });

    res.status(200).send('Data imported successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.put('/api/data/:id', (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  db.query('UPDATE mytable SET name = ?, email = ? WHERE id = ?', [name, email, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Data updated successfully');
    }
  });
});

app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM mytable', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).json(result);
    }
  });
});

app.post('/api/data', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO mytable (name, email) VALUES (?, ?)', [name, email], (err, result) => {
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

  db.query('DELETE FROM mytable WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Data deleted successfully');
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
