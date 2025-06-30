// src/pages/BreakEvenAnalysis.tsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '/Users/manassingh/LeanFoundr/frontend/src/styles/login.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BreakEvenAnalysis() {
  const [price, setPrice] = useState('');
  const [varCost, setVarCost] = useState('');
  const [fixed, setFixed] = useState('');
  const [swing, setSwing] = useState('');
  const chartRefLine = useRef<any>(null);
  const chartRefBar = useRef<any>(null);

  // Parse inputs
  const p = parseFloat(price);
  const v = parseFloat(varCost);
  const f = parseFloat(fixed);
  const s = parseFloat(swing) / 100;

  // Compute contribution margin & break-even base
  const cm = p - v;
  const beBase = cm > 0 ? f / cm : NaN;

  // Scenarios
  const pOpt = p * (1 + s), vOpt = v * (1 - s);
  const cmOpt = pOpt - vOpt;
  const beOpt = cmOpt > 0 ? f / cmOpt : NaN;

  const pPes = p * (1 - s), vPes = v * (1 + s);
  const cmPes = pPes - vPes;
  const bePes = cmPes > 0 ? f / cmPes : NaN;

  // Chart ranges
  const maxUnits = !isNaN(beBase) ? beBase * 1.5 : 10;
  const points = Array.from({ length: 10 }, (_, i) =>
    +(i * (maxUnits / 9)).toFixed(0)
  );
  const revenueLine = points.map(u => p * u);
  const costLine = points.map(u => v * u + f);

  const runAnalysis = () => {
    // triggers re-render
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text('Break-Even Analysis (Contribution Margin)', 40, 40);
    doc.setFontSize(12);
    doc.text(`Price/Unit: $${price}`, 40, 70);
    doc.text(`Var Cost/Unit: $${varCost}`, 250, 70);
    doc.text(`Fixed Costs: $${fixed}`, 40, 90);
    doc.text(`Swing: ±${swing}%`, 250, 90);
    doc.text(`CM (Base): $${cm.toFixed(2)}`, 40, 110);
    doc.text(`BE Units (Base): ${beBase.toFixed(2)}`, 250, 110);
    doc.text(`BE Units (Opt): ${beOpt.toFixed(2)}`, 40, 130);
    doc.text(`BE Units (Pes): ${bePes.toFixed(2)}`, 250, 130);

    // embed line chart
    const lineChart = chartRefLine.current;
    if (lineChart) {
      const img = lineChart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 150, 520, 250);
    }

    // embed bar chart
    const barChart = chartRefBar.current;
    if (barChart) {
      const img = barChart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 410, 520, 200);
    }

    doc.save('break_even_analysis.pdf');
  };

  const exportToCSV = () => {
    const header = [
      'Scenario',
      'Price',
      'Var Cost',
      'Fixed Costs',
      'CM',
      'BE Units'
    ];
    const rows = [
      ['Optimistic', pOpt.toFixed(2), vOpt.toFixed(2), f.toFixed(2), cmOpt.toFixed(2), beOpt.toFixed(2)],
      ['Base',       p.toFixed(2),  v.toFixed(2),  f.toFixed(2), cm.toFixed(2),  beBase.toFixed(2)],
      ['Pessimistic',pPes.toFixed(2),vPes.toFixed(2),f.toFixed(2), cmPes.toFixed(2), bePes.toFixed(2)]
    ];
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'break_even_analysis.csv';
    a.click();
  };

  const lineData = {
    labels: points,
    datasets: [
      {
        label: 'Total Revenue',
        data: revenueLine,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79,70,229,0.2)',
        fill: true,
        tension: 0.1
      },
      {
        label: 'Total Cost',
        data: costLine,
        borderColor: '#3730a3',
        backgroundColor: 'rgba(55,48,163,0.2)',
        fill: true,
        tension: 0.1
      }
    ]
  };

  const barData = {
    labels: ['Optimistic', 'Base', 'Pessimistic'],
    datasets: [
      {
        label: 'Break-Even Units',
        data: [beOpt, beBase, bePes],
        backgroundColor: ['#28a745', '#4f46e5', '#ffc107'],
        borderColor: ['#28a745', '#4f46e5', '#ffc107'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 800 }}>
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">💡 Break-Even Analysis</h2>
        <p className="login-subtext">
          Enter assumptions and swing to see break-even units under scenarios.
        </p>
        <div className="login-form">
          {[
            ['Price per Unit ($)', price, setPrice],
            ['Variable Cost per Unit ($)', varCost, setVarCost],
            ['Fixed Costs ($)', fixed, setFixed],
            ['Swing (%)', swing, setSwing]
          ].map(([ph, val, set], i) => (
            <input
              key={i}
              type="text"
              placeholder={ph}
              value={val as string}
              onChange={e => (set as any)(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: 'black',
                color: 'white',
                border: '1px solid #444',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          ))}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <button
              onClick={runAnalysis}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Run Analysis
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>Revenue vs. Cost</h4>
          <Line
            ref={chartRefLine}
            data={lineData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Revenue & Cost Lines' }
              }
            }}
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>Break-Even Units by Scenario</h4>
          <Bar
            ref={chartRefBar}
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: true, text: 'Break-Even Units' }
              }
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          marginTop: '20px'
        }}>
          <button
            onClick={exportToPDF}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Export to PDF
          </button>
          <button
            onClick={exportToCSV}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffc107',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper to trigger re-render, placed below component:
function runAnalysis() {
  // no-op; state updates in inputs / swings cause recalculation
}
