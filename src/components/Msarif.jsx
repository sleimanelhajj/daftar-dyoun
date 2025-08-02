import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  ListGroup,
  Row,
  Col,
  InputGroup,
  Nav,
} from "react-bootstrap";
import MsarifStats from "./MsarifStats";

const LBP_RATE = 89000;

function Msarif() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [activeTab, setActiveTab] = useState("view");

  const addExpense = (e) => {
    e.preventDefault();
    if (!amount || !desc) return;
    let usdAmount = parseFloat(amount);
    let lbpAmount = 0;
    if (currency === "LBP") {
      usdAmount = parseFloat(amount) / LBP_RATE;
      lbpAmount = parseFloat(amount);
    } else {
      lbpAmount = parseFloat(amount) * LBP_RATE;
    }
    setExpenses([
      ...expenses,
      {
        amount: parseFloat(amount),
        desc,
        date,
        currency,
        usdAmount,
        lbpAmount,
      },
    ]);
    setAmount("");
    setDesc("");
    setCurrency("USD");
    setDate(new Date().toISOString().slice(0, 10));
  };

  // Filter expenses by selected date
  const filteredExpenses = expenses.filter((exp) => exp.date === filterDate);

  const totalUSD = filteredExpenses.reduce((sum, exp) => sum + exp.usdAmount, 0);
  const totalLBP = filteredExpenses.reduce((sum, exp) => sum + exp.lbpAmount, 0);

  return (
    <Row className="justify-content-center mt-4">
      <Col xs={12} md={8} lg={6}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 text-primary text-center">
              Msarif (Expenses)
            </Card.Title>
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="justify-content-center mb-4"
            >
              <Nav.Item>
                <Nav.Link eventKey="view">View Expenses</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="add">Add New Expense</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="stats">Weekly Stats</Nav.Link>
              </Nav.Item>
            </Nav>
            {activeTab === "add" && (
              <Form onSubmit={addExpense}>
                <Row className="align-items-end">
                  <Col xs={12} md={3}>
                    <Form.Group controlId="expenseDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="expenseAmount">
                      <Form.Label>Amount</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          min="0"
                          placeholder="Enter amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                        <Form.Select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          style={{ maxWidth: 90 }}
                        >
                          <option value="USD">USD</option>
                          <option value="LBP">LBP</option>
                        </Form.Select>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId="expenseDesc">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. Lunch, Taxi"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={2} className="d-grid mt-3 mt-md-0">
                    <Button variant="primary" type="submit">
                      Add
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
            {activeTab === "view" && (
              <>
                <Form.Group as={Row} className="mb-3" controlId="filterDate">
                  <Form.Label column sm={4} className="fw-bold">
                    Show expenses for:
                  </Form.Label>
                  <Col sm={8}>
                    <Form.Control
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                    />
                  </Col>
                </Form.Group>
                <h5 className="mb-3">Expenses for {filterDate}</h5>
                <ListGroup variant="flush">
                  {filteredExpenses.length === 0 && (
                    <ListGroup.Item className="text-muted">
                      No expenses for this date.
                    </ListGroup.Item>
                  )}
                  {filteredExpenses.map((exp, idx) => (
                    <ListGroup.Item key={idx}>
                      <Row>
                        <Col xs={5}>{exp.desc}</Col>
                        <Col xs={3} className="text-end">
                          {exp.currency === "USD" ? (
                            <>
                              ${exp.amount.toFixed(2)}{" "}
                              <span className="text-secondary">
                                (LBP{" "}
                                {exp.lbpAmount.toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                })}
                                )
                              </span>
                            </>
                          ) : (
                            <>
                              LBP{" "}
                              {exp.amount.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}{" "}
                              <span className="text-secondary">
                                (${exp.usdAmount.toFixed(2)})
                              </span>
                            </>
                          )}
                        </Col>
                        <Col
                          xs={2}
                          className="text-end text-secondary"
                          style={{ fontSize: "0.85em" }}
                        >
                          {exp.date}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <div className="mt-3 text-end">
                  <strong>
                    Total: ${totalUSD.toFixed(2)} / LBP{" "}
                    {totalLBP.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </strong>
                </div>
              </>
            )}
            {activeTab === "stats" && (
              <MsarifStats expenses={expenses} filterDate={filterDate} />
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Msarif;
