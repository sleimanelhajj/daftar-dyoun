import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSignup = async (e) => {
  e.preventDefault();
  if (password !== confirm) {
    setError("Passwords do not match");
    return;
  }
  setError("");
  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Signup failed");
      return;
    }
    navigate("/login");
  } catch (err) {
    setError("Network error");
  }
};

  return (
    <Card className="mx-auto mt-5" style={{ maxWidth: 400 }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center">Sign Up</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3" controlId="signupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Enter email"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="signupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="signupConfirm">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              placeholder="Confirm password"
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            Sign Up
          </Button>
        </Form>
        <div className="mt-3 text-center">
          <a href="/login">Already have an account? Login</a>
        </div>
      </Card.Body>
    </Card>
  );
}