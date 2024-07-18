const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization, testid, userid',
  credentials: true
}));
app.use(morgan("common"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

app.get("/", function(req, res, next) {
  res.status(200).json({ message: `GradeIT OMR Technologies` });
});

app.get("/healthz", function(req, res) {
  res.send("I am happy and healthy\n");
});

module.exports = app;
