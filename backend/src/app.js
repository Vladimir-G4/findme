const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const voterRecordRoute = require('./routes/voter-record');
const peopleSearchRoute = require('./routes/people-search');

const app = express();


app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


app.use('/api', voterRecordRoute);
app.use('/api', peopleSearchRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong! Please try again later.' });
});


const PORT = 3000; 
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});


process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  process.exit();
});
