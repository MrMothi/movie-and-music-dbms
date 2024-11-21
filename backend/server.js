const express = require('express');    //Express import for CRUD API
const oracledb = require('oracledb');   //oracle DB import for connection to oracle 12c database
const cors = require('cors');  //importing cors for cross origin resource sharing
const app = express();   //creating an express application
require('dotenv').config(); //importing the env library
const PORT = process.env.BACKEND_PORT;  //setting the server port to the environment variable
const bodyParser = require('body-parser');


//MIDDLEWARE=============================================================================
app.use(cors()); // enabling cors
app.use(express.json()); // getting express json reader functionality
app.use(bodyParser.json());

let oracleDBconnection;
//injecting the oracle database connection variable into the req object of the nodejs server
//this allows not having a global variable for the oracledb connection, and now other route handlers can just access this 
//by calling req.dbConnection
app.use((req, res, next) => { 
    req.oracleConnection = oracleDBconnection; 
    next(); 
});


//ORACLE12C CONNECTION AND DISCONNECT=============================================================================
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

app.post('/api/query', async (req, res) => {
    const { query } = req.body;
    console.log('Received query:', query);

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        // Execute the SQL query
        const result = await oracleDBconnection.execute(query);

        // Extract headers (column names) from the metadata
        const headers = result.metaData.map((col) => col.name);

        // Format rows as an array of objects with header-value pairs
        const rows = result.rows.map((row) => {
            return row.reduce((acc, value, index) => {
                acc[headers[index]] = value;
                return acc;
            }, {});
        });

        // Send the response with headers and rows
        res.json({ headers, rows });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Failed to execute query' });
    }
});



//CRUD/FETCH COMMANDS=============================================================================

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
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

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






//UPDATE/PUT------------------------------------------------------------------------------------
//7 functions 1 for each table

//will probably need to call a get request for the other data then change only the ones 
//which are provided by the user ie not null (simmilar to create at that point for the JSON)

//update customer  (requires customer ID)
app.put('/update/customer', async (req, res) => { 
    try {
        //destructuring the input req params
        const { custid, firstname, lastname, email, phonenumber, address } = req.body;

        //checking setting the input values to their current values in the db if they are left null by the user
        //first getting the current values
        const checkold = await req.oracleConnection.execute('SELECT * FROM customer WHERE customer_id = :custid', [custid]);

        // console.log("CHECKING CUSTOMER", checkold.rows); // debug
        const checkRows = checkold.rows;   //getting the rows of the result, since other stuff is uneccesary
        // console.log(checkRows[0][1]);  //gets the firstname DELETE THIS
        // res.json(checkRows);

        //checking and setting each value accordingly, 
        //custid always is present and remains the same
        //if user input is null, use old value
        //if user input is not null, then use their input
        let firstnamenew = firstname;
        let lastnamenew = lastname;
        let emailnew = email;
        let phonenumbernew = phonenumber;
        let addressnew = address;
        if (!firstname){
            firstnamenew = checkRows[0][1];
        }
        if (!lastname){
            lastnamenew = checkRows[0][2];
        }
        if (!email){
            emailnew = checkRows[0][3];
        }
        if (!phonenumber){
            phonenumbernew = checkRows[0][4];
        }
        if (!address){
            addressnew = checkRows[0][5];
        }
        
        // console.log(custid, firstnamenew, lastnamenew, emailnew, phonenumbernew, addressnew);      //for debug

        // running the sql command to update an entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'UPDATE customer SET first_name = :firstnamenew, last_name = :lastnamenew, email = :emailnew, phone_number = :phonenumbernew, address = :addressnew WHERE customer_id = :custid', 
            { 
                custid: custid,        //need to do this formatting due to some wierd casting of this integer into a string otherwise
                firstnamenew: firstnamenew,
                lastnamenew: lastnamenew,
                emailnew: emailnew,
                phonenumbernew: phonenumbernew,
                addressnew: addressnew
            },
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();
        console.log("Updated Row in Customer Table with ID: ", custid);
        res.status(201).json({message : "Customer Updated", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});


// Expected object for above, everything but custID can be null
// {
//     "custid": 21,
//     "firstname": "Benjamin",
//     "lastname": null,
//     "email": "email21",
//     "phonenumber": "000-000-0021",
//     "address": "address21"
//   }




//DELETE------------------------------------------------------------------------------------
// 7 functions 1 for each table, will take in the primary key for the row to delete it

//delete customer
app.delete('/delete/customer', async (req, res) => { 
    try {
        //destructuring the input req params
        const { custid } = req.body;
        // running the sql command to delete the entry from the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'DELETE FROM customer WHERE customer_id = :custid',
            [custid],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();

        console.log("Deleted row in customer table with ID: ", custid);
        res.status(201).json({message : "Deleted Customer", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});

// associated JSON
// { "custid":21 }



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



