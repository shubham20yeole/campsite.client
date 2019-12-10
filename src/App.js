import React, { useState, useEffect, useCallback } from "react";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Form,
  FormControl,
  Button,
  Alert,
  InputGroup
} from "react-bootstrap";
import { api, dateToString } from "./api/api";
import _ from "lodash";
import {
  pulse,
  flash,
  bounceInLeft,
  bounceInRight,
  fadeInUp,
  rubberBand
} from "react-animations";
import Radium, { StyleRoot } from "radium";
import "./css/app.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Messages } from "./Messages";
import "react-datepicker/dist/react-datepicker.css";
import { forEach } from "react-bootstrap/cjs/ElementChildren";
const moment = require("moment");

const App = () => {
  const today = new Date();
  const oneMonthFromNow = today.setDate(today.getDate() + 7);

  const [availableDates, setAvailableDates] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(oneMonthFromNow);
  const [message, setMessage] = useState({});
  const fullNameText = React.createRef();
  const emailText = React.createRef();
  const tokenText = React.createRef();

  const styles = {
    startAnimate: {
      animation: "x 1s",
      animationName: Radium.keyframes(rubberBand, "rubberBand")
    },
    endAnimate: {
      animation: "x 1s",
      animationName: Radium.keyframes(rubberBand, "rubberBand")
    },
    calenderAnimate: {
      animation: "x 1s",
      animationName: Radium.keyframes(pulse, "pulse")
    }
  };

  useEffect(() => {
    api.getAllAvailabilities().then(response => {
      const dates = response.data;
      const formattedDates = formatDates(dates);
      setAvailableDates(formattedDates);
    });
  }, []);

  const fetchCampsiteVa = useCallback((startDate, endDate) => {
    setEndDate(endDate);
    api.requestDateRange(startDate, endDate).then(response => {
      const dates = response.data;
      const formattedDates = formatDates(dates);
      setAvailableDates(formattedDates);
    });
  }, []);

  const CampsitgeDatePicker = useCallback(() => {
    return (
      <StyleRoot>
        <div style={styles.calenderAnimate}>
          <div disabled={false}>
            <DatePicker
              includeDates={availableDates}
              inline
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
        </div>
      </StyleRoot>
    );
  });

  const DateRange = () => {
    return (
      <>
        <Container>
          <Row>
            <Col>
              <h4>Pick Start date</h4>
              <DatePicker
                selected={startDate}
                minDate={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                isClearable
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="yyyy-MM-dd"
              />
            </Col>
            <Col>
              <h4>Pick end date</h4>
              <DatePicker
                selected={endDate}
                onChange={date => fetchCampsiteVa(startDate, date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                isClearable
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="yyyy-MM-dd"
              />
            </Col>
          </Row>
        </Container>
      </>
    );
  };

  const formatDates = dates => {
    return _.map(dates, date => {
      const nDate = new Date(date);
      return nDate.setDate(nDate.getDate() + 1);
    });
  };

  const getDateRange = (start, end) => {
    const s = moment.isMoment(start) ? start : moment(start);
    const e = moment.isMoment(end) ? end : moment(end);
    return [...Array(1 + e.diff(s, "days")).keys()].map(n =>
      moment(s).add(n, "days")
    );
  };

  const momentToString = allDates => {
    return _.map(allDates, moment => ({
      bookingDate: `${moment.get("year")}-${moment.get("month") +
        1}-${moment.get("date")}`
    }));
  };

  const AlertMessages = () => (
    <Alert variant={message.type}>{message.message}</Alert>
  );

  const cancelReservation = () => {
    const token = tokenText.current.value;
    if (!token) {
      alert("Token required.");
      return;
    }
    api
      .cancelBooking(token)
      .then(() =>
        setMessage({
          message: `Booking with ${token} token was cancelled`,
          type: "success"
        })
      )
      .catch(data => {
        debugger;
        data &&
          data.response &&
          setMessage({
            message: `${token}: ${data.response.data.message}`,
            type: "danger"
          });
      });
  };

  const bookCampsite = () => {
    const fullname = fullNameText.current.value;
    const email = emailText.current.value;
    const from = startDate;
    const to = endDate;
    const allDates = getDateRange(from, to);
    const bookingDates = momentToString(allDates);
    const payLoad = {
      fullname,
      email,
      bookingDates
    };

    api
      .postBooking(payLoad)
      .then(response => {
        setMessage({
          message: `Booking was successful, here is your booking token if you want to update the reservation in future ${response.data.bookingId}`,
          type: "success"
        });
      })
      .catch(data => {
        setMessage({ message: data.response.data.message, type: "danger" });
      });
  };
  const UserForm = () => {
    return (
      <div>
        <Form>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Full Name:</Form.Label>
                <Form.Control
                  name="fullName"
                  placeholder="Full name"
                  required
                  ref={fullNameText}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  name="email"
                  placeholder="Email name"
                  required
                  ref={emailText}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Start Date:</Form.Label>
                <StyleRoot>
                  <div style={styles.startAnimate}>
                    <InputGroup.Text>{dateToString(startDate)}</InputGroup.Text>
                  </div>
                </StyleRoot>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>End Date:</Form.Label>
                <StyleRoot>
                  <div style={styles.endAnimate}>
                    <InputGroup.Text>{dateToString(endDate)}</InputGroup.Text>
                  </div>
                </StyleRoot>
              </Form.Group>
            </Col>
            <Button
              onClick={bookCampsite}
              variant="outline-primary"
              size="lg"
              block
            >
              Book the campsite
            </Button>
          </Form.Row>
        </Form>
      </div>
    );
  };

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Campsite booking</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link>
              RESR-API Code: https://github.com/shubham20yeole/campsite.api
            </Nav.Link>
            <Nav.Link>
              https://github.com/shubham20yeole/campsite.client
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <br />
      <br />

      <Container>
        <Row>
          <h6>
            This is POC for the API developed to reserve the campsite. For
            simplicity dates are assumed to be provided in YYYY-MM-DD format
          </h6>
        </Row>
        <Row>
          <AlertMessages />
        </Row>
        <Row>
          <h2>HTTP: GET Calls:</h2>
        </Row>
        <Row>
          <Col>
            <div>
              <p>
                Pick start and end date here you want to reserve the campsite
                for.{" "}
              </p>
            </div>
            <DateRange />
            <p>
              <br />
              Dates entered here will be used below to book the campsite.
            </p>
          </Col>
          <Col>
            <div>
              <p>
                This is just a calendar preview to show campsite availability.{" "}
                <br />
                <span>(Dates can not be selected here)</span>
              </p>
            </div>

            <CampsitgeDatePicker />
          </Col>
        </Row>
        <Row>
          <UserForm />
        </Row>
      </Container>
      <hr />
      <Container>
        <Row>
          <h3>Cancel campsite booking...</h3>
        </Row>
        <Row>
          <br />
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  Booking token =>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                ref={tokenText}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx"
              />
            </InputGroup>
          </Col>
          <Col>
            <Button variant="outline-danger" onClick={cancelReservation}>
              Cancel booking
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
