import React, { useState } from "react";

const QueryForm = () => {
  const [query, setQuery] = useState("");
  const [queryJson, setQueryJson] = useState(null); // State to store the query results as JSON
  const [error, setError] = useState(null); // State to store any errors

  const handleInputChange = (event) => {
    setQuery(event.target.value); // Update query state as the user types
  };

  const handleAutoFill = (newQuery) => {
    setQuery(newQuery); // Auto-fill the query when the button is pressed
  };

  const handleSubmit = async (event) => {
    console.log('Query:', query);
    event.preventDefault(); // Prevent form reload
  
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }), // Send the query to the backend
      });

      if (response.ok) {
        const data = await response.json();
        setQueryJson(data); // Store the query result in state
        setError(null); // Clear any previous errors
      } else {
        setError(`Failed to execute query: ${response.statusText}`);
        setQueryJson(null); // Clear previous results on error
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while executing the query.');
      setQueryJson(null); // Clear previous results on error
    }
 
  };

  return (
    <div>

      <button onClick={() => handleAutoFill(`UPDATE PRODUCT
SET rating = (SELECT REVIEW_NUMBERS.rating_average
              FROM REVIEW_NUMBERS
              WHERE PRODUCT.product_id = REVIEW_NUMBERS.product_id)`)}
      >Update the blah blah</button>

      <button onClick={() => handleAutoFill(`SELECT 
    P.product_id,
    P.product_type,
    TO_CHAR(P.price, 'L999G999D99') AS price,
    CASE 
        WHEN MU.title IS NOT NULL THEN MU.title
        ELSE MV.title
    END AS title,
    CASE 
        WHEN MU.title IS NOT NULL THEN MU.genre
        ELSE MV.genre
    END AS genre,
    CASE 
        WHEN MU.title IS NOT NULL THEN MU.artist
        ELSE NULL
    END AS artist,
    CASE 
        WHEN MU.title IS NULL THEN MV.director
        ELSE NULL
    END AS director
FROM PRODUCT P
LEFT JOIN MUSIC MU ON P.product_id = MU.product_id
LEFT JOIN MOVIE MV ON P.product_id = MV.product_id
WHERE P.price >= 10 AND P.price <= 30
ORDER BY product_type`)}
      >Get all cheap products</button>

      <button onClick={() => handleAutoFill(`SELECT
    C.first_name,
    P.purchase_date,
    PR.product_type,
    CASE
        WHEN MU.title IS NOT NULL THEN MU.title
        ELSE MO.title
    END AS title
FROM
    PURCHASE P
JOIN
    CUSTOMER C ON P.customer_id = C.customer_id
JOIN
    PRODUCT PR ON P.product_id = PR.product_id
LEFT JOIN
    MUSIC MU ON PR.product_id = MU.product_id
LEFT JOIN
    MOVIE MO ON PR.product_id = MO.product_id`)}
      >Get detailed information for all purchases</button>

      <button onClick={() => handleAutoFill(`SELECT 
    R.product_id,
    P.product_type,
    CASE 
        WHEN MU.title IS NOT NULL THEN MU.title
        ELSE MV.title
    END AS title,
    R.user_rating,
    R.user_review,
    R.creation_date
FROM REVIEW R
JOIN PRODUCT P ON R.product_id = P.product_id
LEFT JOIN MUSIC MU ON P.product_id = MU.product_id
LEFT JOIN MOVIE MV ON P.product_id = MV.product_id
WHERE R.user_rating >= 3.0
ORDER BY R.product_id, R.user_rating DESC`)}
      >Get all movies above a 3 star rating</button>

      <button onClick={() => handleAutoFill(`CREATE VIEW purchase_numbers_with_name AS
SELECT P.product_id, P.product_type, P.price, P.vendor_id, 
       CASE 
           WHEN PC.purchase_count IS NULL THEN 0 
           ELSE PC.purchase_count 
       END AS purchase_count,
       CASE 
           WHEN MU.title IS NOT NULL THEN MU.title
           ELSE MV.title
       END AS title
FROM PRODUCT P
LEFT JOIN (
    SELECT product_id, COUNT(*) AS purchase_count
    FROM PURCHASE
    GROUP BY product_id
) PC ON P.product_id = PC.product_id
LEFT JOIN MUSIC MU ON P.product_id = MU.product_id
LEFT JOIN MOVIE MV ON P.product_id = MV.product_id
ORDER BY P.product_id`)}
      >Create View: Purchase Numbers with Name</button>
      
      <button onClick={() => handleAutoFill(`CREATE VIEW review_numbers AS
SELECT P.product_id, P.product_type, P.price, P.vendor_id,
       CASE 
           WHEN R.review_count IS NULL THEN 0 
           ELSE R.review_count 
       END AS review_count,
       CASE 
           WHEN R.user_rating IS NULL THEN NULL 
           ELSE R.user_rating 
       END AS rating_average,
       CASE 
           WHEN MU.title IS NOT NULL THEN MU.title
           ELSE MV.title
       END AS title
FROM PRODUCT P
LEFT JOIN (
    SELECT product_id, COUNT(*) AS review_count, CAST(AVG(user_rating) AS DECIMAL(10,2)) AS user_rating
    FROM REVIEW
    GROUP BY product_id
) R ON P.product_id = R.product_id
LEFT JOIN MUSIC MU ON P.product_id = MU.product_id
LEFT JOIN MOVIE MV ON P.product_id = MV.product_id
ORDER BY P.product_id `)}
      >Create View: Create View: Review Numbers</button>

      <button onClick={() => handleAutoFill(`CREATE VIEW detailed_reviews AS
SELECT 
    R.product_id,
    P.product_type,
    CASE 
        WHEN MU.title IS NOT NULL THEN MU.title
        ELSE MV.title
    END AS title,
    R.user_rating,
    R.user_review,
    R.creation_date,
    C.customer_id,
    C.first_name,
    C.last_name,
    C.email
FROM REVIEW R
JOIN CUSTOMER C ON R.customer_id = C.customer_id
JOIN PRODUCT P ON R.product_id = P.product_id
LEFT JOIN MUSIC MU ON P.product_id = MU.product_id
LEFT JOIN MOVIE MV ON P.product_id = MV.product_id
ORDER BY  R.product_id, R.user_rating DESC`)}
      >Create View: Detailed Reviews</button>

      <button onClick={() => handleAutoFill(`SELECT
    MIN(rating) AS Minimum_Rating,
    MAX(rating) AS Maximum_Rating,
    CAST(AVG(rating) AS DECIMAL(10, 2)) AS Average_Rating,
    CAST(VARIANCE(rating) AS DECIMAL(10, 2)) AS Variance,
    CAST(STDDEV(rating) AS DECIMAL(10, 2)) AS Standard_Deviation
FROM product 
`)}
      >Get combined review stats for all products</button>

      <button onClick={() => handleAutoFill(`SELECT 
    product_id, 
    CAST (MIN(user_rating) AS DECIMAL(10,2)) AS minimum_Rating, 
    CAST(MAX(user_rating) AS DECIMAL(10,2)) AS maximum_Rating, 
    CAST(AVG(user_rating) AS DECIMAL(10,2)) AS average_rating,
    CAST(VARIANCE(user_rating) AS DECIMAL(10,2)) AS variance, 
    CAST(STDDEV(user_rating) AS DECIMAL(10,2)) AS std_dev
FROM review
GROUP BY product_id`)}
      >Get individual review stats for each product</button>

      <button onClick={() => handleAutoFill(`SELECT * FROM 
    (SELECT * FROM MOVIE MV
    MINUS
    SELECT * FROM MOVIE MV WHERE genre = 'Sci-Fi')
ORDER BY product_id`)}
      >Get all non sci fi movies</button>

      <button onClick={() => handleAutoFill(`SELECT * FROM 
    (SELECT * FROM MUSIC MU WHERE genre = 'Pop'
    UNION ALL
    SELECT * FROM MUSIC MU WHERE genre = 'Rock'
    UNION ALL 
    SELECT * FROM MUSIC MU WHERE genre = 'Hip Hop')
ORDER BY product_id`)}
      >Get music with the genres of pop, rock and hiphop</button>

      <button onClick={() => handleAutoFill(`SELECT genre, SUM(purchase_count) AS total_purchases FROM
    (SELECT * FROM MOVIE MV
    LEFT JOIN PRODUCT P ON MV.product_id = P.product_id
    LEFT JOIN (
        SELECT product_id, COUNT(*) AS purchase_count
        FROM PURCHASE
        GROUP BY product_id
    ) PR ON MV.product_id = PR.product_id
    WHERE PR.purchase_count IS NOT NULL
    ORDER BY MV.genre)
GROUP BY genre
ORDER BY total_purchases DESC`)}
      >Get a list of movie genres ranked by purchase count</button>

      <button onClick={() => handleAutoFill(`SELECT
    P.product_id,
    P.product_type,
    CASE
        WHEN MU.title IS NOT NULL THEN MU.title
        ELSE MV.title
    END AS title,
    SUM(PR.price) AS total_revenue
FROM 
    PURCHASE PR
JOIN PRODUCT P ON P.product_id = PR.product_id
LEFT JOIN MUSIC MU ON P.product_id = MU.product_id
LEFT JOIN MOVIE MV ON P.product_id = MV.product_id
GROUP BY
    P.product_id, P.product_type, MU.title, MV.title
HAVING SUM(PR.price) > 5
ORDER BY total_revenue DESC`)}
      >Get total revenue of each product</button>
      {/* Query Input Form */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="queryInput">Enter your query:</label>
        <textarea
          id="queryInput"
          value={query}
          onChange={handleInputChange}
          placeholder="Type your query here..."
          rows="4"
          required
        />
        <button type="submit">Submit</button>
      </form>

      {/* Display Submitted Query */}
      <p>Your query: {query}</p>

      {/* Display Error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Query Results */}
      {queryJson && (
        <div>
        <h4>Query Results:</h4>

        {/* Render the table if headers and rows exist */}
        {queryJson.headers && queryJson.rows && (
          <table border="1">
            <thead>
              <tr>
                {queryJson.headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryJson.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {queryJson.headers.map((header, colIndex) => (
                    <td key={colIndex}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Optionally display the raw JSON */}
        <pre>{JSON.stringify(queryJson, null, 2)}</pre>
      </div>
      )}
    </div>
  );
};

export default QueryForm;
