const express = require('express');
const cors = require('cors');
const app = express();
// const jwt = require('jsonwebtoken');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zt47ric.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db('Endgame').collection('users');


  
    app.get("/college/:email", async(req, res) =>{
      console.log(req.params.email);
      const result = await usersCollection
      .find({email : req.params.email})
      .toArray()
      res.send(result)
  });



    app.get('/college', async(req, res) =>{
      const query = {};
      const options = {
        sort : {"seats" : -1}
      }
      const cursor = usersCollection.find(query, options);
      const result = await cursor.toArray();
      res.send(result);
  })


  app.post('/users', async(req, res) =>{
    const user = req.body;
    // console.log(user)
    const query = {email : user.email}
    const existingUser = await usersCollection.findOne(query)
    if(existingUser){
      return res.send({message : 'user already exists'})
    }
    const result = await usersCollection.insertOne(user)
    res.send(result)
});


  app.post("/add", async (req, res) => {
    const body = req.body;
    console.log(body);
    const result = await usersCollection.insertOne(body);
    if (result?.insertedId) {
      return res.status(200).send(result);
    } else {
      return res.status(404).send({
        message: "can not insert try again leter",
        status: false,
      });
    }
  });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) =>{
    res.send('Endgame Task')
})

app.listen(port, () =>{
    console.log(`Endgame Task on PORT : ${port}`)
})