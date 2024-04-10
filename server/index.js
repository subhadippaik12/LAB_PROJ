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
const addCategoryRouter = require('./routes/AddCategory.js'); 
const addItemRouter = require('./routes/AddItem.js'); 
const deleteItemRouter = require('./routes/deleteItem.js');
const deleteCategoryRouter = require('./routes/deleteCategory.js');
const connectMongo = require('./db');
connectMongo(process.env.MONGO_URL);

app.use(cors());
app.use(express.json());
app.use('/log/', userRouter);
app.use('/api/', displayRouter);
app.use('/order/', orderRouter);
app.use('/addcategory',addCategoryRouter); 
app.use('/supply', supplyRouter);
app.use('/price/', priceRouter);
app.use('/quantity/', qtyRouter);
app.use('/addItem/', addItemRouter);
app.use('/deleteItem', deleteItemRouter);
app.use('/deletecategory', deleteCategoryRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}...`);
});
