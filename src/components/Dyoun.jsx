import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  ListGroup,
  Row,
  Col,
  InputGroup,
  Nav,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

const API_URL = "http://localhost:5000/api/dyoun";

function Dyoun() {
  const [debts, setDebts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // <-- Add phone state
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("theyOweMe"); // "theyOweMe" or "iOweThem"
  const [currency, setCurrency] = useState("USD");
  const [dyounDate, setDyounDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [activeTab, setActiveTab] = useState("view");
  const [editIdx, setEditIdx] = useState(null);
  const [addToExisting, setAddToExisting] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setDebts(data))
      .catch(() => setDebts([]));
  }, []);

  const resetForm = () => {
    setName("");
    setPhone(""); // <-- Reset phone
    setAmount("");
    setType("theyOweMe");
    setCurrency("USD");
    setDyounDate(new Date().toISOString().slice(0, 10));
    setEditIdx(null);
    setAddToExisting(false);
  };

  const addDebt = (e) => {
    e.preventDefault();
    if (!name || !amount || !phone) return;
    const debtObj = {
      name,
      phone, // <-- Save phone
      amount: parseFloat(amount),
      type,
      currency,
      date: dyounDate,
    };

    if (editIdx !== null) {
      // Edit mode
      if (addToExisting) {
        // Find entry with same name, type, and currency
        const idx = debts.findIndex(
          (d) =>
            d.name.trim().toLowerCase() === name.trim().toLowerCase() &&
            d.type === type &&
            d.currency === currency &&
            d.phone === phone // <-- Match phone too
        );
        if (idx !== -1) {
          // Add to existing
          const updated = [...debts];
          updated[idx] = {
            ...updated[idx],
            amount: updated[idx].amount + parseFloat(amount),
            date: dyounDate, // update date to latest
          };
          setDebts(updated);
        } else {
          // No matching entry, add new
          setDebts([...debts, debtObj]);
        }
      } else {
        // Replace as usual
        const updated = [...debts];
        updated[editIdx] = debtObj;
        setDebts(updated);
      }
    } else {
      // Add mode
      setDebts([...debts, debtObj]);
    }
    resetForm();
    setActiveTab("view");
  };

  const handleDelete = (idx) => {
    setDebts(debts.filter((_, i) => i !== idx));
  };

  const handleEdit = (debt, idx) => {
    setName(debt.name);
    setPhone(debt.phone || ""); // <-- Set phone
    setAmount("");
    setType(debt.type);
    setCurrency(debt.currency || "USD");
    setDyounDate(debt.date || new Date().toISOString().slice(0, 10));
    setEditIdx(idx);
    setActiveTab("add");
    setAddToExisting(false);
  };

  const handleUpdateAll = async () => {
    await fetch(`${API_URL}/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(debts),
    });
    alert("All debts updated on server!");
  };

  // Calculate summary
  const totalTheyOweMe = debts
    .filter((d) => d.type === "theyOweMe" && d.currency === "USD")
    .reduce((sum, d) => sum + d.amount, 0);
  const totalTheyOweMeLBP = debts
    .filter((d) => d.type === "theyOweMe" && d.currency === "LBP")
    .reduce((sum, d) => sum + d.amount, 0);
  const totalIOweThem = debts
    .filter((d) => d.type === "iOweThem" && d.currency === "USD")
    .reduce((sum, d) => sum + d.amount, 0);
  const totalIOweThemLBP = debts
    .filter((d) => d.type === "iOweThem" && d.currency === "LBP")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <Row className="justify-content-center mt-4">
      <Col xs={12} md={8} lg={6}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 text-primary text-center">
              Dyoun
            </Card.Title>
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={(k) => {
                setActiveTab(k);
                resetForm();
              }}
              className="justify-content-center mb-4"
            >
              <Nav.Item>
                <Nav.Link eventKey="view">View Debts</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="add">
                  {editIdx !== null ? "Edit Debt" : "Add New Debt"}
                </Nav.Link>
              </Nav.Item>
            </Nav>
            {activeTab === "add" && (
              <Form onSubmit={addDebt}>
                <Row className="align-items-end">
                  <Col xs={12} md={5}>
                    <Form.Group controlId="debtName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId="debtPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="e.g. 96170123456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="debtDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={dyounDate}
                        onChange={(e) => setDyounDate(e.target.value)}
                        required
                        className="w-100" // <-- Bootstrap full width
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId="debtAmount">
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
                </Row>
                <Row className="align-items-end mt-2">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="debtType">
                      <Form.Label>Type</Form.Label>
                      <Form.Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="theyOweMe">They owe me</option>
                        <option value="iOweThem">I owe them</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6} className="d-grid mt-3 mt-md-0">
                    <Button variant="primary" type="submit">
                      {editIdx !== null ? "Update" : "Add"}
                    </Button>
                  </Col>
                </Row>
                {editIdx !== null && (
                  <Form.Group controlId="addToExisting" className="mt-2">
                    <Form.Check
                      type="checkbox"
                      label="Add to existing amount"
                      checked={addToExisting}
                      onChange={(e) => setAddToExisting(e.target.checked)}
                    />
                  </Form.Group>
                )}
              </Form>
            )}
            {activeTab === "view" && (
              <>
                <h5 className="mb-3">Debts Summary</h5>
                <ListGroup variant="flush">
                  {debts.length === 0 && (
                    <ListGroup.Item className="text-muted">
                      No debts recorded.
                    </ListGroup.Item>
                  )}
                  {debts.map((debt, idx) => (
                    <ListGroup.Item key={idx}>
                      <Row>
                        <Col xs={3}>{debt.name}</Col>
                        <Col xs={3}>{debt.phone}</Col>
                        <Col
                          xs={2}
                          className={
                            debt.type === "theyOweMe"
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {debt.type === "theyOweMe" ? "+" : "-"}
                          {debt.currency === "USD" ? "$" : "LBP "}
                          {debt.amount.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </Col>
                        <Col
                          xs={2}
                          className="text-secondary"
                          style={{ fontSize: "0.9em" }}
                        >
                          {debt.date}
                        </Col>
                        <Col xs={2} className="text-end">
                          <DropdownButton
                            id={`dropdown-actions-${idx}`}
                            title="Actions"
                            variant="secondary"
                            size="sm"
                            align="end"
                          >
                            <Dropdown.Item
                              onClick={() => handleEdit(debt, idx)}
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleDelete(idx)}
                              className="text-danger"
                            >
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                const msg = encodeURIComponent(
                                  `Hi ${
                                    debt.name
                                  }, this is a reminder that you ${
                                    debt.type === "theyOweMe"
                                      ? "owe me"
                                      : "I owe you"
                                  } ${debt.currency === "USD" ? "$" : "LBP "}${
                                    debt.amount
                                  }.`
                                );
                                window.open(
                                  `https://wa.me/${debt.phone}?text=${msg}`,
                                  "_blank"
                                );
                              }}
                              className="text-success"
                            >
                              Reminder
                            </Dropdown.Item>
                          </DropdownButton>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <div className="mt-3 text-end">
                  <strong>
                    Total Owed To Me:{" "}
                    <span className="text-success">
                      ${totalTheyOweMe.toFixed(2)}
                    </span>{" "}
                    /{" "}
                    <span className="text-success">
                      LBP{" "}
                      {totalTheyOweMeLBP.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <br />
                    Total I Owe:{" "}
                    <span className="text-danger">
                      ${totalIOweThem.toFixed(2)}
                    </span>{" "}
                    /{" "}
                    <span className="text-danger">
                      LBP{" "}
                      {totalIOweThemLBP.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </strong>
                </div>
                <div className="mt-3 text-end">
                  <Button variant="success" onClick={handleUpdateAll}>
                    Update All (Sync to Server)
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Dyoun;
