import { Button, Col, Container, Row } from "react-bootstrap";
import React from "react";

export const CodebaseLinks = () => {
  const openGitCode = url => {
    window.open(url, "_blank");
  };

  return (
    <Container>
      <Row>
        <h3>Codebase...</h3>
      </Row>
      <Row>
        <br />
      </Row>
      <Row>
        <Col>
          <Button
            variant="info"
            onClick={url =>
              openGitCode("https://github.com/shubham20yeole/campsite.api")
            }
          >
            REST-API code
          </Button>
        </Col>
        <Col>
          <Button
            variant="info"
            onClick={url =>
              openGitCode("https://github.com/shubham20yeole/campsite.client")
            }
          >
            Client code
          </Button>
        </Col>
        <Col>
          <Button
            variant="info"
            onClick={url =>
              openGitCode("http://campsiteapi.herokuapp.com/swagger-ui.html")
            }
          >
            Swagger api docs
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
