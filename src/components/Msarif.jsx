import React, { useState, useEffect } from "react";
import { useLoader } from "../context/LoaderContext"; // <-- Add this import
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
const API_URL = "http://localhost:5000/api/msarif"; // Change if deploying

function Msarif() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [filterDate, setFilterDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [activeTab, setActiveTab] = useState("view");
  const [editIdx, setEditIdx] = useState(null);
  const { setLoading } = useLoader(); // <-- Add this

  // Fetch expenses from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true); // <-- Show loader
    fetch(API_URL, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(() => setExpenses([]))
      .finally(() => setLoading(false)); // <-- Hide loader
  }, []);

  const resetForm = () => {
    setAmount("");
    setDesc("");
    setCurrency("USD");
    setDate(new Date().toISOString().slice(0, 10));
    setEditIdx(null);
  };

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
    const expenseObj = {
      amount: parseFloat(amount),
      desc,
      date,
      currency,
      usdAmount,
      lbpAmount,
    };

    let updated;
    if (editIdx !== null) {
      // Edit mode
      updated = [...expenses];
      updated[editIdx] = expenseObj;
    } else {
      // Add mode
      updated = [...expenses, expenseObj];
    }
    setExpenses(updated);
    resetForm();
    setActiveTab("view");
  };

  const handleDelete = (idx) => {
    setExpenses(expenses.filter((_, i) => i !== idx));
  };

  const handleEdit = (exp, idx) => {
    setAmount(exp.amount);
    setDesc(exp.desc);
    setCurrency(exp.currency);
    setDate(exp.date);
    setEditIdx(idx);
    setActiveTab("add");
  };

  // "Update All" button handler
  const handleUpdateAll = async () => {
    const token = localStorage.getItem("token");
    setLoading(true); // <-- Show loader
    await fetch(`${API_URL}/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(expenses),
    });
    setLoading(false); // <-- Hide loader
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
              Msarif
            </Card.Title>
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={(k) => { setActiveTab(k); resetForm(); }}
              className="justify-content-center mb-4"
            >
              <Nav.Item>
                <Nav.Link eventKey="view">View Expenses</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="add">{editIdx !== null ? "Edit Expense" : "Add New Expense"}</Nav.Link>
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
                      {editIdx !== null ? "Update" : "Add"}
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
                        <Col xs={2} className="text-end">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleEdit(exp, expenses.findIndex(e => e === exp))}
                            className="me-1"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(expenses.findIndex(e => e === exp))}
                          >
                            Delete
                          </Button>
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
                <div className="mt-3 text-end">
                  <Button variant="success" onClick={handleUpdateAll}>
                    Update All (Sync to Server)
                  </Button>
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
