import React, { useState, useEffect, useCallback } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
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
import { MessageHandler } from "./MessageHandler";
export const Messages = props => {
  const uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  const ToastMessages =
    props.messages &&
    props.messages.map(message => (
      <ErrorBoundary key={uuidv4()}>
        <MessageHandler key={uuidv4()} message={message} />
      </ErrorBoundary>
    ));

  return (
    <div key={uuidv4()}>
      <Row>{ToastMessages}</Row>
    </div>
  );
};
