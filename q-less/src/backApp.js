import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Col, Row, Form, FormControl, Button} from 'react-bootstrap';
import {getTransportCardDetails} from"./URLs";
import Home from "./Home";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

const App = () => {

  const [stateSearch, setStateSearch] = useState("");

  const onClickSearch = () => {

      let transportCardNumberDetails;
      let url = getTransportCardDetails +'?transportCardNumber='+stateSearch;
      fetch(url, { method: "get" })
          .then((result) => result.json())
          .then((data) => {
            console.log(data)
           transportCardNumberDetails = data;       
          })
          .catch("Error");

      return transportCardNumberDetails;

  }

  const onChangeSearch =(e)=>{
    setStateSearch (e.target.value);
  }
  
  return (
<Router>
<div>
    <div className="App">
      <div className="App-header">
      <Row> 
        <Col md={12}>
          <header>
            <strong>Welcome to Q-LESS</strong>
          </header>
        </Col>  
      </Row>   
      <Row>
        <Col md={12}>
          <img src={logo} className="App-logo" alt="logo" /> 
        </Col>    
      </Row>  
      <Row>
        <Col md={12} className="cardNumber" >
          <Form inline>
            <FormControl
              type="text"
              placeholder="Enter your Transaction Card Number"
              onChange={(e) => onChangeSearch(e)}
            />
             <Link to={'home'}>
               <Button variant="outline-info" onClick={() => onClickSearch()}>Search</Button>
             </Link> 
          </Form>
        </Col>  
      </Row> 
      </div>
    </div>
  <Switch>
    <Route path="/home" exact component={Home}/>
  </Switch>
</div>
</Router>
  );
}

export default App;
