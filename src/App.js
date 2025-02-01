import './App.css';
import React,{ useEffect, useState } from 'react';



function App() {
  const[message,setMessage] = useState();

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/hello`)
    .then((res)=>res.text())
    .then(setMessage);
  },[]);


  return (
    <div>
      <h1>Hello Wolrd from Frontend</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
