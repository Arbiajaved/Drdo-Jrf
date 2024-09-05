const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Update MySQL connection details
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Replace with your MySQL username
  password: 'MYSQLp@ssword',  // Replace with your MySQL password
  database: 'drdo'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the ARAB_DRDO database.');
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit', upload.fields([{ name: 'image_file' }, { name: 'document_file' }]), (req, res) => {
  const { name, email, phone, gender, dob, address, feedback, checkbox_option } = req.body;
  const image_file = req.files['image_file'] ? req.files['image_file'][0].filename : null;
  const document_file = req.files['document_file'] ? req.files['document_file'][0].filename : null;

  // Insert form data into the database
  const sql = 'INSERT INTO FormEntries (name, email, phone, gender, dob, address, feedback, image_file, document_file, checkbox_option) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, gender, dob, address, feedback, image_file, document_file, checkbox_option], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
      return;
    }
    console.log('Data inserted successfully:', result);
    res.send('Form submitted successfully!');
  });
});

// Start the server
app.listen(port, () => {
  console.log(Server running at http://localhost:${port});
});