const express = require('express');
const app = express();

const cors = require('cors');
require('dotenv').config();

const userRouter = require('./routes/CreateUser.js');
const displayRouter = require('./routes/DisplayData.js');
const supplyRouter = require('./routes/SupplyData.js');
const orderRouter = require('./routes/OrderData.js');
const priceRouter = require('./routes/ChangePrice.js');
const qtyRouter = require('./routes/increaseQuantity.js');
const connectMongo = require('./db');
connectMongo(process.env.MONGO_URL);

app.use(cors());
app.use(express.json());
app.use('/log/', userRouter);
app.use('/api/', displayRouter);
app.use('/order/', orderRouter);
app.use('/supply', supplyRouter);
app.use('/price/', priceRouter);
app.use('/quantity/', qtyRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}...`);
});
