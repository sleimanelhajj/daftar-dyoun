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

function Dyoun() {
  const [debts, setDebts] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("theyOweMe"); // "theyOweMe" or "iOweThem"
  const [currency, setCurrency] = useState("USD");
  const [dyounDate, setDyounDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [activeTab, setActiveTab] = useState("view");
  const [editIdx, setEditIdx] = useState(null);
  const [addToExisting, setAddToExisting] = useState(false);

  const resetForm = () => {
    setName("");
    setAmount("");
    setType("theyOweMe");
    setCurrency("USD");
    setDyounDate(new Date().toISOString().slice(0, 10));
    setEditIdx(null);
    setAddToExisting(false);
  };

  const addDebt = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    const debtObj = {
      name,
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
          d =>
            d.name.trim().toLowerCase() === name.trim().toLowerCase() &&
            d.type === type &&
            d.currency === currency
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
    setAmount("");
    setType(debt.type);
    setCurrency(debt.currency || "USD");
    setDyounDate(debt.date || new Date().toISOString().slice(0, 10));
    setEditIdx(idx);
    setActiveTab("add");
    setAddToExisting(false);
  };

  // Calculate summary
  const totalTheyOweMe = debts
    .filter(d => d.type === "theyOweMe" && d.currency === "USD")
    .reduce((sum, d) => sum + d.amount, 0);
  const totalTheyOweMeLBP = debts
    .filter(d => d.type === "theyOweMe" && d.currency === "LBP")
    .reduce((sum, d) => sum + d.amount, 0);
  const totalIOweThem = debts
    .filter(d => d.type === "iOweThem" && d.currency === "USD")
    .reduce((sum, d) => sum + d.amount, 0);
  const totalIOweThemLBP = debts
    .filter(d => d.type === "iOweThem" && d.currency === "LBP")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <Row className="justify-content-center mt-4">
      <Col xs={12} md={8} lg={6}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-4 text-primary text-center">
              Dyoun (Money Owed)
            </Card.Title>
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={(k) => { setActiveTab(k); resetForm(); }}
              className="justify-content-center mb-4"
            >
              <Nav.Item>
                <Nav.Link eventKey="view">View Debts</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="add">{editIdx !== null ? "Edit Debt" : "Add New Debt"}</Nav.Link>
              </Nav.Item>
            </Nav>
            {activeTab === "add" && (
              <Form onSubmit={addDebt}>
                <Row className="align-items-end">
                  <Col xs={12} md={4}>
                    <Form.Group controlId="debtName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="debtAmount">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={2}>
                    <Form.Group controlId="debtCurrency">
                      <Form.Label>Currency</Form.Label>
                      <Form.Select
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                      >
                        <option value="USD">USD</option>
                        <option value="LBP">LBP</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="debtDate">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={dyounDate}
                        onChange={e => setDyounDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="align-items-end mt-2">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="debtType">
                      <Form.Label>Type</Form.Label>
                      <Form.Select
                        value={type}
                        onChange={e => setType(e.target.value)}
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
                      onChange={e => setAddToExisting(e.target.checked)}
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
                        <Col xs={4}>{debt.name}</Col>
                        <Col xs={3} className={debt.type === "theyOweMe" ? "text-success" : "text-danger"}>
                          {debt.type === "theyOweMe" ? "+" : "-"}
                          {debt.currency === "USD" ? "$" : "LBP "}
                          {debt.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </Col>
                        <Col xs={3} className="text-secondary" style={{ fontSize: "0.9em" }}>
                          {debt.date}
                        </Col>
                        <Col xs={2} className="text-end">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleEdit(debt, idx)}
                            className="me-1"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(idx)}
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
                    Total Owed To Me: <span className="text-success">${totalTheyOweMe.toFixed(2)}</span> / <span className="text-success">LBP {totalTheyOweMeLBP.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span><br />
                    Total I Owe: <span className="text-danger">${totalIOweThem.toFixed(2)}</span> / <span className="text-danger">LBP {totalIOweThemLBP.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </strong>
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