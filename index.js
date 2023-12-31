const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kqcyimm.mongodb.net/?retryWrites=true&w=majority`;

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

        const database = client.db("ManagerDb");
        const taskCollection = database.collection("tasks");


        // task related api

        app.get('/tasks', async(req, res) =>{
            const user = req.query.user;
            const query = {user: user};
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/tasks/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        app.post('/tasks', async(req, res) =>{
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })

        app.patch('/tasks/:id', async(req, res) =>{
            const task = req.body;
            const id = req.params.id;
            const filter = {_id : new ObjectId(id)};
            const updateDoc = {
                $set: {
                    title: task.title,
                    deadline: task.deadline,
                    priority: task.priority,
                    description: task.description
                }
            };

            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/tasks/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })



























        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Task manager is running fast');
})

app.listen(port, () => {
    console.log(`Task manager running on port: ${port}`);
})
