const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const morgan = require("morgan");
const path = require('path');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization, testid, userid, numquestions',
  credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/images', express.static(path.join(__dirname, '../images')));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

app.get('/', function(req, res) {
  res.status(200).json({ message: 'GradeIT OMR Technologies' });
});

app.get('/healthz', function(req, res) {
  res.send('I am happy and healthy\n');
});

module.exports = app;
