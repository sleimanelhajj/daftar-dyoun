/* eslint-env node */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dyounRouter = require('./routes/dyoun');
const msarifRouter = require('./routes/msarif');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://sleimanelhajj:snkc%40890@daftar-dyoun.ng3efn1.mongodb.net/?retryWrites=true&w=majority&appName=daftar-dyoun', {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
});

app.use('/api/dyoun', dyounRouter);
app.use('/api/msarif', msarifRouter);
app.use('/api/auth', authRouter);

const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));