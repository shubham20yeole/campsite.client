import React, { useState, useEffect, useCallback } from "react";
import {
  Navbar,
  Toast,
  Nav,
  Container,
  Row,
  Col,
  Form,
  FormControl,
  Button,
  InputGroup
} from "react-bootstrap";

export const MessageHandler = props => {
  const [show, setShow] = useState(true);

  return (
    <Col xs={6}>
      <Toast show={show} onClose={() => setShow(!show)}>
        <Toast.Header>
          <strong className="mr-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>{props.message}</Toast.Body>
      </Toast>
    </Col>
  );
};
