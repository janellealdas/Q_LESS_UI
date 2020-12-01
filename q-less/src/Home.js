import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Col,
  Row,
  Form,
  FormControl,
  Button,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import {
  getTransportCardDetails,
  getMRTLineStations,
  getStationsFromTo,
  getComputedFare,
  requestDiscount,
  swipeCard,
} from "./URLs";

const Home = (props) => {
  const [stateTransportCardDetails, setStateTransportCardDetails] = useState(
    []
  );
  const [stateError, setStateError] = useState("");

  const [stateMRTLineDropdownVal, setStateMRTLineDropdownVal] = useState([]);
  const [stateMRTSelected, setStateMRTSelected] = useState("");

  const [stateStationDropdownVal, setStateStationDropdownVal] = useState([]);
  const [stateFromSelected, setstateFromSelected] = useState("");
  const [stateToSelected, setStateToSelected] = useState("");

  const [stateComputedFare, setStateComputedFare] = useState([]);

  useEffect(() => {
    setStateTransportCardDetails(props.transportCardNumberDetails);
    setStateError(props.loginError);
    getMRTLineStation();
  }, [props.transportCardNumberDetails, props.loginError]);

  const getMRTLineStation = () => {
    let url = getMRTLineStations;
    fetch(url, { method: "get" })
      .then((result) => result.json())
      .then((data) => {
        setStateMRTLineDropdownVal(data);
      })
      .catch("Error");
  };

  const getTransCard = async () => {
    let url =
      getTransportCardDetails +
      "?transportCardNumber=" +
      stateTransportCardDetails[0].transportCardNumber;
    await fetch(url, { method: "get" })
      .then((result) => result.json())
      .then((data) => {
        setStateTransportCardDetails(data);
      })
      .catch("Error");
  };

  const onClickMRTDropdown = (e) => {
    setStateMRTSelected(e.target.value);
    let url = getStationsFromTo + "?mrtLineNumber=" + e.target.id;
    fetch(url, { method: "get" })
      .then((result) => result.json())
      .then((data) => {
        setStateStationDropdownVal(data);
      })
      .catch("Error");
  };

  const onClickFrom = (e) => {
    setstateFromSelected(e.target.value);
    if (stateToSelected.length > 0) {
      let url =
        getComputedFare +
        "?stationFrom=" +
        e.target.value +
        "&stationTo=" +
        stateToSelected;
      fetch(url, { method: "get" })
        .then((result) => result.json())
        .then((data) => {
          setStateComputedFare(data);
        })
        .catch("Error");
    }
  };

  const onClickTo = (e) => {
    setStateToSelected(e.target.value);
    if (stateFromSelected.length > 0) {
      let url =
        getComputedFare +
        "?stationFrom=" +
        stateFromSelected +
        "&stationTo=" +
        e.target.value;
      fetch(url, { method: "get" })
        .then((result) => result.json())
        .then((data) => {
          setStateComputedFare(data);
        })
        .catch("Error");
    }
  };

  const renderTransportCardDetails = (stateTransportCardDetails) => {
    return (
      <div className="display">
        {stateTransportCardDetails.map((details, index) => (
          <div key={index}>
            <div className="home-body">
              <Row className="rowHeight">
                <Col md={6}>
                  <div>
                    Transport Card Number: {details.transportCardNumber}
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    Card Type:{" "}
                    {details.isRegistered == true ? "Discounted" : "Regular"}
                  </div>
                </Col>
              </Row>
              <Row className="rowHeight">
                <Col md={6}>
                  <div>Balance: PHP {details.balance}</div>
                </Col>
                <Col md={6}>
                  <div>
                    <Button variant="outline-info" className="home-button">
                      Reload
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMRTLine = () => {
    return (
      <div className="display">
        <div className="home-body">
          <Row className="rowHeight">
            <Col md={6}>
              <div>
                <Row>
                  <Col md={3}>MRT Line</Col>
                  <Col md={2}>
                    <DropdownButton id="dropdown-button" title="">
                      {stateMRTLineDropdownVal.map((options, index) => (
                        <div key={index}>
                          <Dropdown.Item
                            as="button"
                            id={options.id}
                            value={options.mrtLines}
                            onClick={(e) => onClickMRTDropdown(e)}
                          >
                            {options.mrtLines}
                          </Dropdown.Item>
                        </div>
                      ))}
                    </DropdownButton>
                  </Col>
                  <Col md={4}>{stateMRTSelected}</Col>
                </Row>
              </div>
            </Col>
            <Col md={6}>
              {stateComputedFare.map((amount, index) => (
                <div key={index}>Computed Fare: PHP {amount.amount}</div>
              ))}
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  const renderStations = () => {
    return (
      <div className="display">
        <div className="home-body">
          <Row className="rowHeight">
            <Col md={6}>
              <Row>
                <Col md={3}>From</Col>
                <Col md={2}>
                  <DropdownButton id="dropdown-button" title="">
                    {stateStationDropdownVal.map((options, index) => (
                      <div key={index}>
                        <Dropdown.Item
                          as="button"
                          id={options.id}
                          value={options.stationName}
                          onClick={(e) => onClickFrom(e)}
                        >
                          {options.stationName}
                        </Dropdown.Item>
                      </div>
                    ))}
                  </DropdownButton>
                </Col>
                <Col md={4}>{stateFromSelected}</Col>
              </Row>
            </Col>
            <Col md={6}>
              <Row>
                <Col md={1}>To</Col>
                <Col md={2}>
                  <DropdownButton id="dropdown-button" title="">
                    {stateStationDropdownVal.map((options, index) => (
                      <div key={index}>
                        <Dropdown.Item
                          as="button"
                          id={options.id}
                          value={options.stationName}
                          onClick={(e) => onClickTo(e)}
                        >
                          {options.stationName}
                        </Dropdown.Item>
                      </div>
                    ))}
                  </DropdownButton>
                </Col>
                <Col md={4}>{stateToSelected}</Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  const renderSwipe = () => {
    return (
      <div className="swipeButton">
        <Button
          variant="outline-info"
          className="home-button"
          onClick={() => onClickSwipe()}
        >
          Swipe
        </Button>
      </div>
    );
  };

  const onClickSwipe = async () => {
    let url =
      swipeCard +
      "/?transportCardNumber=" +
      stateTransportCardDetails[0].transportCardNumber +
      "&fare=" +
      stateComputedFare[0].amount;
    await fetch(url, { method: "put" })
      .then((result) => result.json())
      .then((data) => {});
    await getTransCard().catch("Error");
  };

  const renderSwipeCard = () => {
    return stateComputedFare[0].amount <
      stateTransportCardDetails[0].balance ? (
      renderSwipe()
    ) : stateComputedFare[0].amount == undefined ? (
      ""
    ) : (
      <strong className="spanMessage">
        You don't have enough balance. Please reload sufficient amount to swipe.
      </strong>
    );
  };

  return (
    <div>
      <Col md={12}>
        <Row>
          <div className="display">
            <header className="home-header">
              <strong>Quick Line and Efficient Service System</strong>
            </header>
          </div>
        </Row>
        <Row>
          {stateError.length == 0
            ? renderTransportCardDetails(stateTransportCardDetails)
            : ""}
        </Row>
        <Row>{renderMRTLine(stateMRTLineDropdownVal)}</Row>
        <Row>{renderStations(stateStationDropdownVal)}</Row>
        <Row>
          {stateComputedFare.length > 0 &&
          stateTransportCardDetails.length > 0 &&
          stateError.length == 0
            ? renderSwipeCard()
            : null}
        </Row>
      </Col>
    </div>
  );
};

export default Home;
