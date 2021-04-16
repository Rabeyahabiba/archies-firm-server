const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 6030;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zroly.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("archies").collection("services");
  const ordersCollection = client.db("archies").collection("orders");
  app.get('/services',(req,res) => {
    serviceCollection.find()
    .toArray((err, items) => {
      res.send(items)
       console.log('from database', items)
    })
  })
  app.post('/addService', (req,res) =>{
    const newService = req.body;
    console.log('adding new service', newService)
    serviceCollection.insertOne(newService)
    .then(result => {
        // console.log('inserted count' , result.insertedCount )
        res.send(result.insertedCount> 0)
    })
})
app.post('/addOrder', (req,res) =>{
  const order = req.body;
  console.log('adding new order', order)
  ordersCollection.insertOne(order)
  .then(result => {
      res.send(result.insertedCount> 0)
  })
})
});

app.listen(process.env.PORT || port)