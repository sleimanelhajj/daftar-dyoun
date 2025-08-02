import React from "react";
import { Card, ListGroup } from "react-bootstrap";

function getWeekDates(selectedDate) {
  const date = new Date(selectedDate);
  const day = date.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d.toISOString().slice(0, 10));
  }
  return weekDates;
}

const MsarifStats = ({ expenses, filterDate }) => {
  // Get week dates for the selected filterDate
  const weekDates = getWeekDates(filterDate);

  // Filter expenses for the week
  const weekExpenses = expenses.filter(exp => weekDates.includes(exp.date));

  // Group by day
  const dailyTotals = weekDates.map(date => {
    const dayExpenses = weekExpenses.filter(exp => exp.date === date);
    const totalUSD = dayExpenses.reduce((sum, exp) => sum + exp.usdAmount, 0);
    const totalLBP = dayExpenses.reduce((sum, exp) => sum + exp.lbpAmount, 0);
    return { date, totalUSD, totalLBP };
  });

  const totalWeekUSD = dailyTotals.reduce((sum, d) => sum + d.totalUSD, 0);
  const totalWeekLBP = dailyTotals.reduce((sum, d) => sum + d.totalLBP, 0);
  const avgUSD = totalWeekUSD / 7;
  const avgLBP = totalWeekLBP / 7;

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-4 text-success text-center">
          Weekly Statistics
        </Card.Title>
        <ListGroup variant="flush">
          {dailyTotals.map((d) => (
            <ListGroup.Item key={d.date}>
              <strong>{d.date}:</strong>{" "}
              ${d.totalUSD.toFixed(2)} / LBP {d.totalLBP.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <hr />
        <div className="text-center">
          <strong>Total this week:</strong> ${totalWeekUSD.toFixed(2)} / LBP {totalWeekLBP.toLocaleString(undefined, { maximumFractionDigits: 0 })}<br />
          <strong>Average per day:</strong> ${avgUSD.toFixed(2)} / LBP {avgLBP.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MsarifStats;