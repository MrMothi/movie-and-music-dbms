import React, {useEffect, useState} from 'react';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"

function App() {

  //testing backend frontend connection with temp function to grab product table
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await fetch('/get/product')
        if (!response.ok) { 
          throw new Error('Network response was not ok'); 
        } 
        const result = await response.json();
        setData(result);   //if valid response then set the use state
        console.log(data);
      }
      catch (error) {
        console.log(error);
      }
      finally {
        console.log("successfully fetched the backend text")
      }
    };

    fetchData();

  }, []);



  return (
    <div>
      <p>{data.message}abc</p>
    </div>
  );
}

export default App;
