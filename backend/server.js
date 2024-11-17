const express = require('express');    //Express import for CRUD API
const oracledb = require('oracledb');   //oracle DB import for connection to oracle 12c database
const cors = require('cors');  //importing cors for cross origin resource sharing
const app = express();   //creating an express application
require('dotenv').config(); //importing the env library
const PORT = process.env.BACKEND_PORT;  //setting the server port to the environment variable

app.use(cors()); // enabling cors
app.use(express.json()); // getting express json reader functionality

//default server backend page
app.get('/', (req, res) => {
    res.send('Movie and Music DBMS')
})


app.get('/get/product', (req, res) => { 
    res.json({ message: 'Hello from the backend!' }); 
});


//setting the port to which the server listens to for requests
app.listen(PORT, 
    () => { console.log(`listen to port ${PORT}`) }
)



///CRUD FUNCTIONS FOR THE SQL 

//CONNECT BACKEND WITH FRONT END

//MAKE SIMPLE FRONT END..



async function run() { 
    let connection; 
    try { 
        connection = await oracledb.getConnection({ 
            user: process.env.DB_USER, 
            password: process.env.DB_PASS, 
            connectString: process.env.DB_CONNECT_STRING
        }); console.log('Successfully connected to Oracle Database'); 
        // Execute a simple query 
        const result = await connection.execute('SELECT * FROM customer'); 
        console.log(result.rows); 
    } 
    catch (err) 
    { 
        console.error(err); 
    } 
    finally 
    { 
        if (connection) { 
            try { 
                await connection.close(); 
            } 
            catch (err) 
            { 
                console.error(err); 
            } 
        } 
    } 
} 



run();












