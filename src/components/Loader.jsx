import React from "react";
import { Spinner } from "react-bootstrap";
import { useLoader } from "../context/LoaderContext";

export default function Loader() {
  const { loading } = useLoader();
  if (!loading) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(255,255,255,0.5)", zIndex: 9999, display: "flex",
      alignItems: "center", justifyContent: "center"
    }}>
      <Spinner animation="border" variant="primary" style={{ width: 60, height: 60 }} />
    </div>
  );
}