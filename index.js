const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



// middle ware;
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('CAR IS RUNNING...........................')
});



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.g3vskme.mongodb.net/?retryWrites=true&w=majority`;

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

        const productCollection = client.db('toy-car').collection('products');
        const addToyCollection = client.db('toy-car').collection('addToy');


        // all data;
        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        });



        // category data;
        app.get('/products/:text', async (req, res) => {
            console.log(req.params.text)
            if (req.params.text == 'Jeep' ||
                req.params.text == 'Bus' ||
                req.params.text == 'Truck') {
                const result = await productCollection
                    .find({ category: req.params.text })
                    .toArray();
                return res.send(result);
            }
        });



        // view detail;
        app.get('/viewdetail/:id', async (req, res) => {
            console.log(req.params.id);
            const result = await productCollection
                .find({ _id: new ObjectId(req.params.id) })
                .toArray();
            return res.send(result);
        });



        // get-all toy data;
        app.get('/get-toy', async (req, res) => {
            const result = await addToyCollection.find().toArray();
            console.log(result);
            res.send(result);
        })




        // get-login my toy data;
        app.get('/my-toy', async (req, res) => {
            console.log(req.query.email)
            let query = {};
            if (req.query?.email) {
                query = { selleremail: req.query.email }
            }
            const result = await addToyCollection.find(query).toArray();
            res.send(result);
        });



        
        // post data;
        app.post('/add-toy', async (req, res) => {
            const addToy = req.body;
            console.log(addToy);
            const result = await addToyCollection.insertOne(addToy);
            res.send(result);
        });



        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addToyCollection.findOne(query);
            res.send(result);
        })




        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(user);

            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedUser = {
                $set: {
                    sellerName: user.sellerName,
                    photoURL: user.photoURL,
                    name: user.name,
                    selleremail: user.selleremail,
                    subcategory: user.subcategory,
                    price: user.price,
                    rating: user.rating,
                    adquantity: user.adquantity
                }
            }
            const result = await addToyCollection.updateOne(filter, updatedUser, options);
            res.send(result);

        })




        app.delete('/my-toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await addToyCollection.deleteOne(query);
            res.send(result);
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
    console.log(`SYSTEM IS RUNNING ON PORT:${port}`)
});