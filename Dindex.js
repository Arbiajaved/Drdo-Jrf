const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// MySQL Connection Setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // Replace with your MySQL username
  password: 'MYSQLp@ssword',  // Replace with your MySQL password
  database: 'drdo',
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);  // Exit app if DB connection fails
  }
  console.log('✅ Connected to MySQL database.');
});

// Routes

// Serve the form page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post(
  '/submit',
  upload.fields([
    { name: 'image_file', maxCount: 1 },
    { name: 'document_file', maxCount: 1 },
  ]),
  (req, res) => {
    try {
      // Destructure expected fields from body
      const {
        name,
        email,
        phone,
        gender,
        dob,
        address,
        feedback,
        checkbox_option,
      } = req.body;

      // Validate required fields (basic example)
      if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Name, email, and phone are required.' });
      }

      // Handle files
      const image_file = req.files?.image_file?.[0]?.filename || null;
      const document_file = req.files?.document_file?.[0]?.filename || null;

      // Prepare SQL query & data
      const sql = `
        INSERT INTO FormEntries 
          (name, email, phone, gender, dob, address, feedback, image_file, document_file, checkbox_option)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        name,
        email,
        phone,
        gender || null,
        dob || null,
        address || null,
        feedback || null,
        image_file,
        document_file,
        checkbox_option === 'on' || checkbox_option === 'true' ? 1 : 0,
      ];

      // Insert into DB
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('❌ Error inserting into DB:', err);
          return res.status(500).json({ error: 'Database error occurred.' });
        }
        res.status(200).json({ message: 'Form submitted successfully!', id: result.insertId });
      });
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});




    
