express = require('express');
const app = express();
const cors = require('cors');
const { query } = require('express');
require('dotenv').config();
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

//a-12
//UWpHBVMDij68zJcc

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3xwumf6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        await client.connect();
        const servicesCollection = client.db('a-12').collection('services');
        const bookingCollection = client.db('a-12').collection('booking');
        const userCollection = client.db('a-12').collection('users');

        //get api
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        //get single product :
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);

        });

        // my own booking service:
        app.get('/myservice', async (req, res) => {
            const email = req.query.email;
            // console.log(email);
            const query = { email: email };
            const cursor = await bookingCollection.find(query);
            const result = await cursor.toArray();
            return res.send(result);
        })

        //users
        app.get('/users', async (req, res) => {
            const query = {};
            const result = await userCollection.find(query).toArray();
            res.send(result);
        });

        // get user
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            //   console.log(email);
            const result = await userCollection.findOne({ email: email });
            res.send(result);

        });

        //Is admin
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const result = await userCollection.findOne({ email: email })
            const isAdmin = result.role === 'admin';
            res.send({ admin: isAdmin });
        })



        //service  post api :
        app.post('/service', async (req, res) => {
            const service = req.body;
            // console.log(booking);
            const serviceAdd = await servicesCollection.insertOne(service);
            return res.send({ success: true, serviceAdd });

        });

        // booking post api :
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            // console.log(booking);
            const booked = await bookingCollection.insertOne(booking);
            return res.send({ success: true, booked });

        })

        // add service api :
        // app.post('/addservice', async (req, res) => {
        //     const service = req.body;
        //     console.log(service);
        //     const addService = await servicesCollection.insertOne(service);
        //     res.send(addService);
        // })

        // post user review:
        app.post('/review/:email',async(req,res)=>{
             const email = req.params.email;
             console.log(email);
        })

        //put api
        // app.put('/user/:email', async (req, res) => {
        //     const email = req.params.email;
        //     // console.log(email);
        //     const user = req.body;
        //     // console.log(user);

        //     const filter = { email: email };
        //     const option = { upsert: true };
        //     const updateDoc = {
        //         $set: user,
        //     }
        //     const result = await userCollection.updateOne(filter, option, updateDoc);
        //     res.send(result);

        // });

        //make user:
        // app.put('user',async (req,res)=>{
        //     const user = req.body;
        // })

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const user = req.body;
            console.log(user);
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send({ result,message:true });

        })

        //make admin
        app.put('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const requstAccount = await userCollection.findOne({ email: email })
            if (requstAccount.role === 'admin') {
                const filter = { email: email };
                const updateDoc = {
                    $set: { role: 'admin' },
                };
                const result = await userCollection.updateOne(filter, updateDoc);
                res.send({ result });
            } else {
                console.log('you are not admin');
                res.status(403).send({ message: 'forbidden' });
            }
        })

        //is Admin


        //Service delete api:
        app.delete('/deleteService/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = servicesCollection.deleteOne(query);
            return res.send({ result, success: true });

        })

        //Booking delete api : 
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = bookingCollection.deleteOne(query);
            return res.send({ result, success: true });

        })


    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {

    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})