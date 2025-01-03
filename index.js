const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aulunok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        await client.connect();

        const paintingCollection = client.db('paintingDB').collection('painting');
        const commentCollection = client.db('paintingDB').collection('paintingComment');

        app.get('/paintings', async(req, res) => {
            const cursor = paintingCollection.find();
            const result =await cursor.toArray();
            res.send(result)
        })

        app.post('/paintings', async(req, res) => {
            const newPainting = req.body;
            console.log(newPainting)
            const result = await paintingCollection.insertOne(newPainting);
            res.send(result);
        })


        // painting comment 
        app.get('/comments', async(req, res) => {
            const cursor = commentCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/comments', async(req, res) => {
            const newComment = req.body;
            console.log(newComment)
            const result = await commentCollection.insertOne(newComment);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('painting server is running')
})

app.listen(port, () => {
    console.log(`Painting server is running on port: ${port}`)
})