import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Fade, Zoom } from "react-awesome-reveal";

export default function Home() {
  return (
    <Container className="text-center mt-5">
      <Fade cascade>
        <h1 style={{ fontWeight: 700, fontSize: "3rem", color: "#0d6efd" }}>
          Welcome to Daftar Dyoun
        </h1>
        <p style={{ fontSize: "1.3rem", color: "#444" }}>
          Track your debts and expenses easily, securely, and beautifully.
        </p>
      </Fade>
      <Zoom>
        <Row className="justify-content-center mt-4">
          <Col xs={12} md={4} className="mb-3">
            <div className="p-4 shadow rounded bg-white">
              <h3 className="text-success mb-3">💸 Dyoun</h3>
              <p>Manage who owes you and who you owe, all in one place.</p>
              <Button href="/dyoun" variant="outline-success">
                Go to Dyoun
              </Button>
            </div>
          </Col>
          <Col xs={12} md={4} className="mb-3">
            <div className="p-4 shadow rounded bg-white">
              <h3 className="text-primary mb-3">📊 Msarif</h3>
              <p>Track your expenses and see where your money goes.</p>
              <Button href="/msarif" variant="outline-primary">
                Go to Msarif
              </Button>
            </div>
          </Col>
        </Row>
      </Zoom>
      <Fade delay={500}>
        <div className="mt-5" style={{ color: "#888" }}>
          <em>Made with ❤️ for your financial peace of mind.</em>
        </div>
      </Fade>
    </Container>
  );
}