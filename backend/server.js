const express = require('express');    //Express import for CRUD API
const oracledb = require('oracledb');   //oracle DB import for connection to oracle 12c database
const cors = require('cors');  //importing cors for cross origin resource sharing
const app = express();   //creating an express application
require('dotenv').config(); //importing the env library
const PORT = process.env.BACKEND_PORT;  //setting the server port to the environment variable

//MIDDLEWARE=============================================================================
app.use(cors()); // enabling cors
app.use(express.json()); // getting express json reader functionality

let oracleDBconnection;
//injecting the oracle database connection variable into the req object of the nodejs server
//this allows not having a global variable for the oracledb connection, and now other route handlers can just access this 
//by calling req.dbConnection
app.use((req, res, next) => { 
    req.oracleConnection = oracleDBconnection; 
    next(); 
});


//ORACLE CONNECTION AND DISCONNECT=============================================================================
//not implementing the process pool strategy for database connections since there will only be 1 server instance running for a single frontend
async function initOracleConnection() { 
     
    try { 
        oracleDBconnection = await oracledb.getConnection({ 
            user: process.env.DB_USER, 
            password: process.env.DB_PASS, 
            connectString: process.env.DB_CONNECT_STRING
        }); console.log('Successfully connected to Oracle Database');
        // app.use((req, res, next) => { 
        //     req.oracleConnection = oracleDBconnection; 
        //     next(); 
        // });
        
        app.locals.oracleConnection = oracleDBconnection

        // Execute a simple query 
        // const result = await req.oracleConnection.execute('SELECT * FROM customer'); 
        // console.log(result.rows); 
    } 
    catch (error)     //for any errors in conecting to the DB
    { 
        console.error(error);
        process.exit(1); 
    } 
}


//function for closing the oracleDB connection
async function closeOracleConnection() {
    // if()
    try {
        console.log("Attempting to close oracle DB connection")
        await app.locals.oracleConnection.close();
        console.log("Closed oracle DB connection");
        process.exit(0);
    }
    catch (error) {
        console.error('Cannot close oracle DB connection', error);
        process.exit(1);
    }
}



//listening for any force quit cntl-c for the server, if there is any, then closes database conncetion
process.once('SIGTERM', closeOracleConnection).once('SIGINT', closeOracleConnection);


//default server backend page
app.get('/', (req, res) => {
    res.send('Movie and Music DBMS')
})


//FETCH COMMANDS=============================================================================

//READ/GET------------------------------------------------------------------------------------
//7 functions, 1 for each table a generic select all/*
//get product table
app.get('/get/customer', async (req, res) => { 
    try{
        console.log(req.oracleConnection)
        const result = await req.oracleConnection.execute('SELECT * FROM customer'); 
        // const result = await app.locals.oracleConnection.execute('SELECT * FROM customer');    //if using app locals variable
        console.log("RESULT ROWS",result.rows); // can comment out later
        const resultRows = result.rows;   //getting the rows of the result, since other stuff is uneccesary
        res.json(resultRows);    //sending back the results in json format, using the res object json function (from express middleware)
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});



//POST/CREATE------------------------------------------------------------------------------------
//7 Functions 1 for each table, which links to a form submit on the frontend
//Create new customer
app.post('/create/customer', async (req, res) => { 
    try {
        //destructuring the input req params
        const { custid, firstname, lastname, email, phonenumber, address } = req.body;
        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'INSERT INTO customer (customer_id, first_name, last_name, email, phone_number, address) VALUES (:custid, :firstname, :lastname, :email, :phonenumber, :address)',
            [custid, firstname, lastname, email, phonenumber, address],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();

        console.log("New row created in Customer Table with ID: ", custid);
        res.status(201).json({message : "Customer created", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});


// Expected object for above
//  {
//     "custid": 21,
//     "firstname": "first1",
//     "lastname": "last1",
//     "email": "email1",
//     "phonenumber": "phone1",
//     "address": "address"
//   }



//BACKEND LISTENER=============================================================================
//setting the port to which the server listens to for requests
initOracleConnection().then( () => {
    app.listen(PORT, () => { 
        console.log(`listen to port ${PORT}`);
        // initOracleConnection();   //starting up the connection between backend and oracleDB
    });
});








/*
BEYOND THIS POINT IS OLD CODE OR NOTES WE DONT NEED=============================================================================
*/


// ///CRUD FUNCTIONS FOR THE SQL
// async function run() { 
//     let connection; 
//     try { 
//         connection = await oracledb.getConnection({ 
//             user: process.env.DB_USER, 
//             password: process.env.DB_PASS, 
//             connectString: process.env.DB_CONNECT_STRING
//         }); console.log('Successfully connected to Oracle Database'); 
//         // Execute a simple query 
//         const result = await connection.execute('SELECT * FROM customer'); 
//         console.log(result.rows); 
//     } 
//     catch (err) 
//     { 
//         console.error(err); 
//     } 
//     finally 
//     { 
//         if (connection) { 
//             try { 
//                 await connection.close(); 
//             } 
//             catch (err) 
//             { 
//                 console.error(err); 
//             } 
//         } 
//     } 
// } 
// run();












