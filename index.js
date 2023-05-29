const express = require("express")
const cors = require("cors")
require('dotenv').config
const app = express()
const port = process.env.PORT || 5000

// middleware 
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send('boss is sitting')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://bistroBoss:SoRdz7tIU1uFJaFl@cluster0.dgqtjig.mongodb.net/?retryWrites=true&w=majority`;

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

        const menuCollection = client.db("bistroDB").collection("menu");
        const cartsCollection = client.db("bistroDB").collection("carts");

        app.get("/menu", async (req, res) => {
            const result = await menuCollection.find().toArray()
            res.send(result)
        })

        // carts collection
        app.get('/carts', async (req, res) => {
            const result = await cartsCollection.find().toArray()
            res.send(result)
        })

        app.get('/carts', async (req, res) => {
            const email = req.query.email
            console.log(email);
            if (!email) {
                res.send([])
            }
            const query = { email: email }
            console.log(query);
            const result = await cartsCollection.find(query).toArray()
            res.send(result)


        })
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            console.log(query);
            const result = await cartsCollection.deleteOne(query)
            res.send(result)
        })

        app.post("/carts", async (req, res) => {
            const item = req.body
            const result = await cartsCollection.insertOne(item)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log("boss is sitting on port", port);
})