const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
  const usersCollection = client.db("archies").collection("users");
  const reviewsCollection = client.db("archies").collection("reviews");
  app.get('/services',(req,res) => {
    serviceCollection.find()
    .toArray((err, items) => {
      res.send(items)
      //  console.log('from database', items)
    })
  })
  app.post('/addService', (req,res) =>{
    const newService = req.body;
    // console.log('adding new service', newService)
    serviceCollection.insertOne(newService)
    .then(result => {
        // console.log('inserted count' , result.insertedCount )
        res.send(result.insertedCount> 0)
    })
})

app.get('/service/:_id', (req, res) => {
  const id = ObjectID(req.params.id);
  serviceCollection.find({ _id: id })
      .toArray((err, service) => {
          res.send(service[0])
      })
})
app.post('/addOrder', (req,res) =>{
  const order = req.body;
  console.log('adding new order', order)
  ordersCollection.insertOne(order)
  .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount> 0)
  })
})

app.get('/orders', (req, res) => {
  const email = req.query.email;
  usersCollection.find({ email: email })
      .toArray((err, user) => {
          const filter = {}
          if (user.length === 0) {
              filter.email = email;
          }
          ordersCollection.find(filter)
              .toArray((err, result) => {
                  res.send(result);
              })
      })
})

app.patch('/updateStatus/:id', (req, res) => {
  ordersCollection.updateOne({ _id: ObjectID(req.params.id) },
      {
          $set: { status: req.body.status }
      })
      .then(result => {
        console.log(result.modifiedCount)
          res.send(result.modifiedCount > 0);
      })
})
app.delete('/deleteServices/:id', (req, res) => {
  const id = ObjectID(req.params.id);
  serviceCollection.findOneAndDelete({ _id: id })
      .then(result => {
          res.send(result.deleteCount > 0)
      })
})
app.post('/addReview', (req, res) => {
  const review = req.body;
  reviewsCollection.insertOne(review)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
})

app.get('/reviews', (req, res) => {
  reviewsCollection.find({})
      .toArray((err, result) => {
        console.log(result)
          res.send(result)
      })
})
app.post('/addUser', (req, res) => {
  console.log(err)
  const user = req.body;
  console.log('adding new user', user)
  usersCollection.insertOne(user)
      .then(result => {
        
          res.send(result.insertedCount > 0)
      })
})

app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  usersCollection.find({ email: email })
      .toArray((err, result) => {
          res.send(result.length > 0)
      })
})
});


app.listen(process.env.PORT || port)