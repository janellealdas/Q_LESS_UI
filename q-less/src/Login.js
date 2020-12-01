import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Col, Row, Form, FormControl, Button } from "react-bootstrap";
import { getTransportCardDetails } from "./URLs";
import Home from "./Home";

const Login = () => {
  const [stateSearch, setStateSearch] = useState("");
  const [stateTransportCard, setStateTransportCard] = useState([]);
  const [stateError, setStateError] = useState("");

  const onClickSearch = () => {
    let url = getTransportCardDetails + "?transportCardNumber=" + stateSearch;
    fetch(url, { method: "get" })
      .then((result) => result.json())
      .then((data) => {
        setStateTransportCard(data);
        if (data.length == 0) {
          setStateError("Transaction card number does not exist.");
        } else {
          let today = new Date();
          let lastUsedCard = new Date(data[0].lastUsed);
          if (today.getFullYear() - lastUsedCard.getFullYear() > 5) {
            setStateError(
              "Your card is already expired. Please purchase a new one."
            );
          } else {
            setStateError("");
          }
        }
      })
      .catch("Error");
  };

  const onChangeSearch = (e) => {
    setStateSearch(e.target.value);
  };

  const renderWelcome = () => {
    return (
      <div>
        <Row>
          <Col md={12}>
            <header className="App-header">
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
          <Col md={12} className="cardNumber">
            <Form inline>
              <FormControl
                type="text"
                placeholder="Enter your Transaction Card Number"
                onChange={(e) => onChangeSearch(e)}
              />
              <Button variant="outline-info" onClick={() => onClickSearch()}>
                Search
              </Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <strong className="errorMessage">{stateError}</strong>
        </Row>
      </div>
    );
  };

  return (
    <div className="App">
      <Row>
        <Col md={4}>{renderWelcome()}</Col>
        <Col md={8}>
          <Home
            transportCardNumberDetails={stateTransportCard}
            loginError={stateError}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Login;
