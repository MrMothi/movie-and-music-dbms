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


//OTHER FUNCTIONS=============================================================================
//SQL query input to result function
//Later might want to not allow any delete table queries, currently allowing for both view and table
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


//get external vendor table
app.get('/get/external-vendor', async (req, res) => { 
    try{
        const result = await req.oracleConnection.execute('SELECT * FROM external_vendor'); 
        // console.log("RESULT ROWS",result.rows);
        const resultRows = result.rows;   //getting the rows of the result, since other stuff is uneccesary
        res.json(resultRows);    //sending back the results in json format, using the res object json function (from express middleware)
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});


//get product table
app.get('/get/product', async (req, res) => { 
    try{
        const result = await req.oracleConnection.execute('SELECT * FROM product'); 
        // console.log("RESULT ROWS",result.rows);
        const resultRows = result.rows;   //getting the rows of the result, since other stuff is uneccesary
        res.json(resultRows);    //sending back the results in json format, using the res object json function (from express middleware)
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});



//get customer table
//original function
app.get('/get/customer', async (req, res) => { 
    try{
        // console.log(req.oracleConnection)
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


//get review table
app.get('/get/review', async (req, res) => { 
    try{
        const result = await req.oracleConnection.execute('SELECT * FROM review'); 
        // console.log("RESULT ROWS",result.rows);
        const resultRows = result.rows;   //getting the rows of the result, since other stuff is uneccesary
        res.json(resultRows);    //sending back the results in json format, using the res object json function (from express middleware)
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});


//get purchase table
app.get('/get/purchase', async (req, res) => { 
    try{
        const result = await req.oracleConnection.execute('SELECT * FROM purchase'); 
        // console.log("RESULT ROWS",result.rows);
        const resultRows = result.rows;   //getting the rows of the result, since other stuff is uneccesary
        res.json(resultRows);    //sending back the results in json format, using the res object json function (from express middleware)
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});


//get music table
app.get('/get/music', async (req, res) => { 
    try{
        const result = await req.oracleConnection.execute('SELECT * FROM music'); 
        // console.log("RESULT ROWS",result.rows);
        const resultRows = result.rows;   //getting the rows of the result, since other stuff is uneccesary
        res.json(resultRows);    //sending back the results in json format, using the res object json function (from express middleware)
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});


//get movie table
app.get('/get/movie', async (req, res) => { 
    try{
        const result = await req.oracleConnection.execute('SELECT * FROM movie'); 
        // console.log("RESULT ROWS",result.rows);
        const resultRows = result.rows;   //getting the rows of the result, since other stuff is uneccesary
        res.json(resultRows);    //sending back the results in json format, using the res object json function (from express middleware)
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});




//POST/CREATE------------------------------------------------------------------------------------
//7 Functions 1 for each table, which links to a form submit on the frontend

//Create new external_vendor
app.post('/create/external-vendor', async (req, res) => { 
    try {
        //destructuring the input req params
        const { vendorid, vendorname, vendornumber, contactemail } = req.body;
        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'INSERT INTO external_vendor (vendor_id, vendor_name, phone_number, contact_email) VALUES (:vendorid, :vendorname, :vendornumber, :contactemail )',
            [vendorid, vendorname, vendornumber, contactemail ],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("New row created in External Vendor Table with ID: ", vendorid);
        res.status(201).json({message : "External Vendor created", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});

// Expected object for above
//  {
//     "vendorid": 21,
//     "vendorname": "abc",
//     "vendornumber": "phone1",
//     "contactemail": "email1"
//   }


//Create new product
app.post('/create/product', async (req, res) => { 
    try {
        //destructuring the input req params
        const { productid, producttype, rating, price, vendorid } = req.body;
        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'INSERT INTO product (product_id, product_type, rating, price, vendor_id ) VALUES (:productid, :producttype, :rating, :price, :vendorid)',
            [ productid, producttype, rating, price, vendorid ],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("New row created in Product Table with ID: ", productid);
        res.status(201).json({message : "Product created", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});

// Expected object for above
//  {
//     "productid": 200,
//     "producttype": "movie",
//     "rating": 4.6,
//     "price": 99.99,
//     "vendorid": 21
//   }


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


//Create new review
app.post('/create/review', async (req, res) => { 
    try {
        //destructuring the input req params
        const { review_id, product_id, customer_id, creation_date, user_review, user_rating } = req.body;
        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            `INSERT INTO review (review_id, product_id, customer_id, creation_date, user_review, user_rating ) VALUES (:review_id, :product_id, :customer_id, TO_DATE(:creation_date, 'YYYY-MM-DD'), :user_review, :user_rating)`,
            [ review_id, product_id, customer_id, creation_date, user_review, user_rating ],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("New row created in Review Table with ID: ", review_id);
        res.status(201).json({message : "Review created", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});

// Expected object for above
//  {
//     "review_id": 200,
//     "product_id": 1,
//     "customer_id": 40,
//     "creation_date": "2024-08-01",
//     "user_review": "somereview",
//     "user_rating": 1.4
//   }


//Create new purchase
app.post('/create/purchase', async (req, res) => { 
    try {
        //destructuring the input req params
        const { purchase_id, product_id, customer_id, purchase_date, price } = req.body;
        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            `INSERT INTO purchase ( purchase_id, product_id, customer_id, purchase_date, price ) VALUES (:purchase_id, :product_id, :customer_id, TO_DATE(:purchase_date, 'YYYY-MM-DD'), :price)`,
            [ purchase_id, product_id, customer_id, purchase_date, price ],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("New row created in Purchase Table with ID: ", purchase_id);
        res.status(201).json({message : "Purchase created", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});

// Expected object for above
//  {
//     "purchase_id": 200,
//     "product_id": 2,
//     "customer_id": 10,
//     "purchase_date": "2024-08-01",
//     "price": 100.99
//   }


//Create new music
app.post('/create/music', async (req, res) => { 
    try {
        //destructuring the input req params
        const { product_id, title, genre, artist, features, album } = req.body;
        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            `INSERT INTO music ( product_id, title, genre, artist, features, album  ) VALUES (:product_id, :title, :genre, :artist, :features, :album )`,
            [ product_id, title, genre, artist, features, album ],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("New row created in Music Table with ID: ", product_id);
        res.status(201).json({message : "Music created", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});

// Expected object for above
//  {
//     "product_id": 200,
//     "title": "Some title",
//     "genre": "rock",
//     "artist": "some singer",
//     "features": "some other guy",
//     "album": "some album"
//   }


//Create new movie
app.post('/create/movie', async (req, res) => { 
    try {
        //destructuring the input req params
        const { product_id, title, genre, director } = req.body;
        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            `INSERT INTO movie ( product_id, title, genre, director ) VALUES (:product_id, :title, :genre, :director )`,
            [ product_id, title, genre, director ],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("New row created in Movie Table with ID: ", product_id);
        res.status(201).json({message : "Movie created", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});

// Expected object for above
//  {
//     "product_id": 200,
//     "title": "Some movie title",
//     "genre": "horror",
//     "director": "some director"
//   }




//UPDATE/PUT------------------------------------------------------------------------------------
//7 functions 1 for each table

//update external_vendor (requires vendor_id)
app.put('/update/external-vendor', async (req, res) => { 
    try {
        //destructuring the input req params
        const { vendorid, vendorname, vendornumber, contactemail } = req.body;

        //getting current row values
        const checkold = await req.oracleConnection.execute('SELECT * FROM external_vendor WHERE vendor_id = :vendorid', [vendorid]);
        const checkRows = checkold.rows; 

        //setting new values to any input values that are non null, otherwise setting the null values to previous row values
        let vendornamenew = vendorname;
        let vendornumbernew = vendornumber;
        let contactemailnew = contactemail;
        if (!vendorname){
            vendornamenew = checkRows[0][1];
        }
        if (!vendornumber){
            vendornumbernew = checkRows[0][2];
        }
        if (!contactemail){
            contactemailnew = checkRows[0][3];
        }

        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'UPDATE external_vendor SET vendor_id = :vendor_id, vendor_name = :vendor_namenew, phone_number = :vendor_numbernew, contact_email = :contact_emailnew WHERE vendor_id = :vendor_id',
            { 
                vendor_id: vendorid,        //need to do this formatting due to some wierd casting of this integer into a string otherwise
                vendor_namenew: vendornamenew,
                vendor_numbernew: vendornumbernew,
                contact_emailnew: contactemailnew,
            },
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("Updated row in External Vendor Table with ID: ", vendorid);
        res.status(201).json({message : "External Vendor Updated", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});

// Expected object for above
//  {
//     "vendorid": 21,
//     "vendorname": "abc",
//     "contactnumber": "phone1",
//     "contactemail": "email1"
//   }


//update product
app.put('/update/product', async (req, res) => { 
    try {
        //destructuring the input req params
        const { productid, producttype, rating, price, vendorid } = req.body;

        //getting current row values
        const checkold = await req.oracleConnection.execute('SELECT * FROM product WHERE product_id = :productid', [productid]);
        const checkRows = checkold.rows; 

        //setting new values to any input values that are non null, otherwise setting the null values to previous row values
        let producttypenew = producttype;
        let ratingnew = rating;
        let pricenew = price;
        let vendoridnew = vendorid;
        if (!producttype){
            producttypenew = checkRows[0][1];
        }
        if (!rating){
            ratingnew = checkRows[0][2];
        }
        if (!price){
            pricenew = checkRows[0][3];
        }
        if (!vendorid){
            vendoridnew = checkRows[0][3];
        }

        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'UPDATE product SET product_type = :product_typenew, rating = :rating_new, price = :price_new, vendor_id = :vendor_idnew WHERE product_id = :product_id',
            { 
                product_id: productid,        //need to do this formatting due to some wierd casting of this integer into a string otherwise
                product_typenew: producttypenew,
                rating_new: ratingnew,
                price_new: pricenew,
                vendor_idnew: vendoridnew
            },
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("Updated row in Product Table with ID: ", vendorid);
        res.status(201).json({message : "Product Updated", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});
// Expected object for above
//  {
//     "productid": 200,
//     "producttype": "movie",
//     "rating": 4.6,
//     "price": 99.99,
//     "vendorid": 21
//   }



//update product
app.put('/update/product', async (req, res) => { 
    try {
        //destructuring the input req params
        const { productid, producttype, rating, price, vendorid } = req.body;

        //getting current row values
        const checkold = await req.oracleConnection.execute('SELECT * FROM product WHERE product_id = :productid', [productid]);
        const checkRows = checkold.rows; 

        //setting new values to any input values that are non null, otherwise setting the null values to previous row values
        let producttypenew = producttype;
        let ratingnew = rating;
        let pricenew = price;
        let vendoridnew = vendorid;
        if (!producttype){
            producttypenew = checkRows[0][1];
        }
        if (!rating){
            ratingnew = checkRows[0][2];
        }
        if (!price){
            pricenew = checkRows[0][3];
        }
        if (!vendorid){
            vendoridnew = checkRows[0][3];
        }

        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'UPDATE product SET product_type = :product_typenew, rating = :rating_new, price = :price_new, vendor_id = :vendor_idnew WHERE product_id = :product_id',
            { 
                product_id: productid,        //need to do this formatting due to some wierd casting of this integer into a string otherwise
                product_typenew: producttypenew,
                rating_new: ratingnew,
                price_new: pricenew,
                vendor_idnew: vendoridnew
            },
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("Updated row in Product Table with ID: ", vendorid);
        res.status(201).json({message : "Product Updated", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});
// Expected object for above
//  {
//     "productid": 200,
//     "producttype": "movie",
//     "rating": 4.6,
//     "price": 99.99,
//     "vendorid": 21
//   }


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


//update review
app.put('/update/review', async (req, res) => { 
    try {
        //destructuring the input req params
        const { review_id, product_id, customer_id, creation_date, user_review, user_rating } = req.body;

        //getting current row values
        const checkold = await req.oracleConnection.execute('SELECT * FROM review WHERE review_id = :review_id', [review_id]);
        const checkRows = checkold.rows; 

        //setting new values to any input values that are non null, otherwise setting the null values to previous row values
        let product_id1 = product_id;
        let customer_id1 = customer_id;
        let creation_date1 = creation_date;
        let user_review1 = user_review;
        let user_rating1 = user_rating;
        if (!product_id){
            product_id1 = checkRows[0][1];
        }
        if (!customer_id){
            customer_id1 = checkRows[0][2];
        }
        if (!creation_date){
            creation_date1 = checkRows[0][3].toISOString().split('T')[0];  //sql returns a date object, so converting it back into a string and only taking the YYYY-MM-DD
        }
        if (!user_review){
            user_review1 = checkRows[0][4];
        }
        if (!user_rating){
            user_rating1 = checkRows[0][5];
        }

        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            // TO_DATE(:purchase_date, 'YYYY-MM-DD')
            `UPDATE review SET product_id = :product_id2, customer_id = :customer_id2, creation_date = TO_DATE(:creation_date2, 'YYYY-MM-DD'), user_review = :user_review2, user_rating = :user_rating2 WHERE review_id = :review_id`,
            { 
                review_id: review_id,
                product_id2: product_id1,        //need to do this formatting due to some wierd casting of this integer into a string otherwise
                customer_id2: customer_id1,
                creation_date2: creation_date1,
                user_review2: user_review1,
                user_rating2: user_rating1
            },
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("Updated row in Review Table with ID: ", review_id);
        res.status(201).json({message : "Review Updated", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});
// Expected object for above
//  {
//     "review_id": 200,
//     "product_id": 1,
//     "customer_id": 40,
//     "creation_date": "2024-08-01",
//     "user_review": "somereview",
//     "user_rating": 1.4
//   }



//update purchase
app.put('/update/purchase', async (req, res) => { 
    try {
        //destructuring the input req params
        const { purchase_id, product_id, customer_id, purchase_date, price } = req.body;

        //getting current row values
        const checkold = await req.oracleConnection.execute('SELECT * FROM purchase WHERE purchase_id = :purchase_id', [purchase_id]);
        const checkRows = checkold.rows; 

        //setting new values to any input values that are non null, otherwise setting the null values to previous row values
        let product_id1 = product_id;
        let customer_id1 = customer_id;
        let purchase_date1 = purchase_date;
        let price1 = price;
        if (!product_id){
            product_id1 = checkRows[0][1];
        }
        if (!customer_id){
            customer_id1 = checkRows[0][2];
        }
        if (!purchase_date){
            purchase_date1 = checkRows[0][3].toISOString().split('T')[0];  //sql returns a date object, so converting it back into a string and only taking the YYYY-MM-DD
        }
        if (!price){
            price1 = checkRows[0][4];
        }

        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            // TO_DATE(:purchase_date, 'YYYY-MM-DD')
            `UPDATE purchase SET product_id = :product_id2, customer_id = :customer_id2, purchase_date = TO_DATE(:purchase_date2, 'YYYY-MM-DD'), price = :price2 WHERE purchase_id = :purchase_id`,
            { 
                purchase_id: purchase_id,
                product_id2: product_id1,        //need to do this formatting due to some wierd casting of this integer into a string otherwise
                customer_id2: customer_id1,
                purchase_date2: purchase_date1,
                price2: price1,
            },
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("Updated row in Purchase Table with ID: ", purchase_id);
        res.status(201).json({message : "Purchase Updated", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});
// Expected object for above
//  {
//     "purchase_id": 200,
//     "product_id": 2,
//     "customer_id": 10,
//     "purchase_date": "2024-08-01",
//     "price": 100.99
//   }



//update music
app.put('/update/music', async (req, res) => { 
    try {
        //destructuring the input req params
        const { product_id, title, genre, artist, features, album } = req.body;

        //getting current row values
        const checkold = await req.oracleConnection.execute('SELECT * FROM music WHERE product_id = :product_id', [product_id]);
        const checkRows = checkold.rows; 

        //setting new values to any input values that are non null, otherwise setting the null values to previous row values
        let product_id1 = product_id;
        let title1 = title;
        let genre1 = genre;
        let artist1 = artist;
        let features1 = features;
        let album1 = album;
        if (!title){
            title1 = checkRows[0][1];
        }
        if (!genre){
            genre1 = checkRows[0][2];
        }
        if (!artist){
            artist1 = checkRows[0][3];
        }
        if (!features){
            features1 = checkRows[0][4];
        }
        if (!album){
            album1 = checkRows[0][5];
        }

        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            // TO_DATE(:purchase_date, 'YYYY-MM-DD')
            `UPDATE music SET title = :title2, genre = :genre2, artist = :artist2, features = :features2, album = :album2 WHERE product_id = :product_id`,
            { 
                product_id: product_id,
                title2: title1,
                genre2: genre1,        //need to do this formatting due to some wierd casting of this integer into a string otherwise
                artist2: artist1,
                features2: features1,
                album2: album1,

            },
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("Updated row in Music Table with ID: ", product_id);
        res.status(201).json({message : "Music Updated", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});
// Expected object for above
//  {
//     "product_id": 200,
//     "title": "Some title",
//     "genre": "rock",
//     "artist": "some singer",
//     "features": "some other guy",
//     "album": "some album"
//   }



//update movie
app.put('/update/movie', async (req, res) => { 
    try {
        //destructuring the input req params
        const { product_id, title, genre, director } = req.body;

        //getting current row values
        const checkold = await req.oracleConnection.execute('SELECT * FROM movie WHERE product_id = :product_id', [product_id]);
        const checkRows = checkold.rows; 

        //setting new values to any input values that are non null, otherwise setting the null values to previous row values
        let product_id1 = product_id;
        let title1 = title;
        let genre1 = genre;
        let director1 = director;
        if (!title){
            title1 = checkRows[0][1];
        }
        if (!genre){
            genre1 = checkRows[0][2];
        }
        if (!director){
            director1 = checkRows[0][3];
        }

        // running the sql command to add a entry to the table and immediately commit it
        const result = await req.oracleConnection.execute(
            // TO_DATE(:purchase_date, 'YYYY-MM-DD')
            `UPDATE movie SET title = :title2, genre = :genre2, director = :director2 WHERE product_id = :product_id`,
            { 
                product_id: product_id,
                title2: title1,
                genre2: genre1,        //need to do this formatting due to some wierd casting of this integer into a string otherwise
                director2: director1

            },
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();   //force committing the DB incase it hasnt already

        console.log("Updated row in Movie Table with ID: ", product_id);
        res.status(201).json({message : "Movie Updated", result});    //sending back success message
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});
// Expected object for above
//  {
//     "product_id": 200,
//     "title": "Some movie title",
//     "genre": "horror",
//     "director": "some director"
//   }




//DELETE------------------------------------------------------------------------------------
// 7 functions 1 for each table, will take in the primary key for the row to delete it

//delete external vendor====
app.delete('/delete/external-vendor', async (req, res) => { 
    try {
        //destructuring the input req params
        const { vendor_id } = req.body;
        // running the sql command to delete the entry from the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'DELETE FROM external_vendor WHERE vendor_id = :vendor_id',
            [vendor_id],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();

        //Return respective message if any row was deleted or not
        //no rows deleted, ie not a id within the table
        if(result.rowsAffected == 0){
            console.log("No row has ID: ", vendor_id);
            res.status(201).json({message : "No row with given ID in External Vendor table", result}); 
        }
        //if a row was deleted, then give the proper response
        else{
            console.log("Deleted row in external vendor table with ID: ", vendor_id);
            res.status(201).json({message : "Deleted External Vendor", result});    //sending back success message
        }
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});

// associated JSON
// { "vendor_id":21 }


//delete product
app.delete('/delete/product', async (req, res) => { 
    try {
        //destructuring the input req params
        const { product_id } = req.body;
        // running the sql command to delete the entry from the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'DELETE FROM product WHERE product_id = :product_id',
            [product_id],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();

        //Return respective message if any row was deleted or not
        //no rows deleted, ie not a id within the table
        if(result.rowsAffected == 0){
            console.log("No row has ID: ", product_id);
            res.status(201).json({message : "No row with given ID in Product table", result}); 
        }
        //if a row was deleted, then give the proper response
        else{
            console.log("Deleted row in product table with ID: ", product_id);
            res.status(201).json({message : "Deleted Product", result});    //sending back success message
        }
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});
// associated JSON
// { "product_id":21 }


//delete customer
app.delete('/delete/customer', async (req, res) => { 
    try {
        //destructuring the input req params
        const { cust_id } = req.body;
        console.log(req.body);
        // running the sql command to delete the entry from the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'DELETE FROM customer WHERE customer_id = :cust_id',
            [cust_id],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();


        //Return respective message if any row was deleted or not
        //no rows deleted, ie not a id within the table
        if(result.rowsAffected == 0){
            console.log("No row has ID: ", cust_id);
            res.status(201).json({message : "No row with given ID in Customer table", result}); 
        }
        //if a row was deleted, then give the proper response
        else{
            console.log("Deleted row in customer table with ID: ", cust_id);
            res.status(201).json({message : "Deleted Customer", result});    //sending back success message
        }
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});

// associated JSON
// { "cust_id":21 }


//delete review
app.delete('/delete/review', async (req, res) => { 
    try {
        //destructuring the input req params
        const { review_id } = req.body;
        // running the sql command to delete the entry from the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'DELETE FROM review WHERE review_id = :review_id',
            [review_id],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();

        //Return respective message if any row was deleted or not
        //no rows deleted, ie not a id within the table
        if(result.rowsAffected == 0){
            console.log("No row has ID: ", review_id);
            res.status(201).json({message : "No row with given ID in Review table", result}); 
        }
        //if a row was deleted, then give the proper response
        else{
            console.log("Deleted row in review table with ID: ", review_id);
            res.status(201).json({message : "Deleted Review", result});    //sending back success message
        }
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});
// associated JSON
// { "review_id":21 }


//delete purchase
app.delete('/delete/purchase', async (req, res) => { 
    try {
        //destructuring the input req params
        const { purchase_id } = req.body;
        // running the sql command to delete the entry from the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'DELETE FROM purchase WHERE purchase_id = :purchase_id',
            [purchase_id],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();

        //Return respective message if any row was deleted or not
        //no rows deleted, ie not a id within the table
        if(result.rowsAffected == 0){
            console.log("No row has ID: ", purchase_id);
            res.status(201).json({message : "No row with given ID in Purchase table", result}); 
        }
        //if a row was deleted, then give the proper response
        else{
            console.log("Deleted row in purchase table with ID: ", purchase_id);
            res.status(201).json({message : "Deleted Purchase", result});    //sending back success message
        }
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});
// associated JSON
// { "purchase_id":21 }


//delete music
//Maybe add a 2ndary delete here aswell to delete the associated product row
app.delete('/delete/music', async (req, res) => { 
    try {
        //destructuring the input req params
        const { product_id } = req.body;
        // running the sql command to delete the entry from the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'DELETE FROM music WHERE product_id = :product_id',
            [product_id],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();

        //Return respective message if any row was deleted or not
        //no rows deleted, ie not a id within the table
        if(result.rowsAffected == 0){
            console.log("No row has ID: ", product_id);
            res.status(201).json({message : "No row with given ID in Music table", result}); 
        }
        //if a row was deleted, then give the proper response
        else{
            console.log("Deleted row in music table with ID: ", product_id);
            res.status(201).json({message : "Deleted Music", result});    //sending back success message
        }
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});
// associated JSON
// { "product_id":21 }


//delete movie
//Maybe add a 2ndary delete here aswell to delete the associated product row
app.delete('/delete/movie', async (req, res) => { 
    try {
        //destructuring the input req params
        const { product_id } = req.body;
        // running the sql command to delete the entry from the table and immediately commit it
        const result = await req.oracleConnection.execute(
            'DELETE FROM movie WHERE product_id = :product_id',
            [product_id],
            { autocommit: true } 
        ); 
        await req.oracleConnection.commit();

        //Return respective message if any row was deleted or not
        //no rows deleted, ie not a id within the table
        if(result.rowsAffected == 0){
            console.log("No row has ID: ", product_id);
            res.status(201).json({message : "No row with given ID in Movie table", result}); 
        }
        //if a row was deleted, then give the proper response
        else{
            console.log("Deleted row in movie table with ID: ", product_id);
            res.status(201).json({message : "Deleted Movie", result});    //sending back success message
        }
    } 
    catch (error) {
        res.status(500).json({ error : error.message }); //returning a formatted error if required   
    }
});
// associated JSON
// { "product_id":21 }


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



