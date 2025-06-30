// src/pages/IRR_MIRR_Simulation.tsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '/Users/manassingh/LeanFoundr/frontend/src/styles/login.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Newton‐Raphson IRR
function computeIRR(cashFlows: number[], guess = 0.1): number {
  let rate = guess;
  for (let i = 0; i < 100; i++) {
    let f = 0, fDer = 0;
    cashFlows.forEach((cf, t) => {
      f += cf / Math.pow(1 + rate, t);
      if (t > 0) fDer += -t * cf / Math.pow(1 + rate, t + 1);
    });
    const newRate = rate - f / fDer;
    if (Math.abs(newRate - rate) < 1e-8) break;
    rate = newRate;
  }
  return rate;
}

// MIRR per standard formula
function computeMIRR(
  cashFlows: number[],
  financeRate: number,
  reinvestRate: number
): number {
  const n = cashFlows.length - 1;
  let pvNeg = 0;
  let fvPos = 0;
  cashFlows.forEach((cf, t) => {
    if (cf < 0) pvNeg += cf / Math.pow(1 + financeRate, t);
    if (cf > 0) fvPos += cf * Math.pow(1 + reinvestRate, n - t);
  });
  // MIRR = ( fvPos / -pvNeg )^(1/n) - 1
  if (pvNeg === 0) return NaN;
  return Math.pow(fvPos / -pvNeg, 1 / n) - 1;
}

export default function IRR_MIRR_Simulation() {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [cashFlowsInput, setCashFlowsInput]       = useState('');
  const [financeRate, setFinanceRate]             = useState('');
  const [reinvestRate, setReinvestRate]           = useState('');
  const [irr, setIrr]                             = useState<number | null>(null);
  const [mirr, setMirr]                           = useState<number | null>(null);
  const chartRef = useRef<any>(null);

  const simulate = () => {
    const inv   = parseFloat(initialInvestment);
    const cfArr = cashFlowsInput
      .split(',')
      .map(s => parseFloat(s.trim()))
      .filter(v => !isNaN(v));
    const finR = parseFloat(financeRate)   / 100;
    const reinR= parseFloat(reinvestRate)  / 100;
    if (
      isNaN(inv) ||
      cfArr.length === 0 ||
      isNaN(finR) ||
      isNaN(reinR)
    ) return;

    const flows = [-inv, ...cfArr];
    const irrVal  = computeIRR(flows);
    const mirrVal = computeMIRR(flows, finR, reinR);
    setIrr(irrVal);
    setMirr(mirrVal);
  };

  const exportToPDF = () => {
    if (irr === null || mirr === null) return;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text('IRR / Modified IRR (MIRR) Comparison', 40, 40);
    doc.setFontSize(12);
    doc.text(`Initial Investment: $${initialInvestment}`, 40, 70);
    doc.text(`Cash Flows: ${cashFlowsInput}`, 40, 90);
    doc.text(`Finance Rate: ${financeRate}%`, 40, 110);
    doc.text(`Reinvest Rate: ${reinvestRate}%`, 40, 130);
    doc.text(`IRR: ${(irr * 100).toFixed(2)}%`, 40, 160);
    doc.text(`MIRR: ${(mirr * 100).toFixed(2)}%`, 200, 160);

    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 190, 520, 300);
    }
    doc.save('irr_mirr_comparison.pdf');
  };

  const exportToCSV = () => {
    if (irr === null || mirr === null) return;
    const header = ['Metric', 'Value'];
    const rows = [
      ['IRR (%)',  (irr * 100).toFixed(2)],
      ['MIRR (%)', (mirr * 100).toFixed(2)]
    ];
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'irr_mirr_comparison.csv';
    a.click();
  };

  const chartData = {
    labels: ['IRR', 'MIRR'],
    datasets: [
      {
        label: 'Rate (%)',
        data: [
          irr !== null ? +(irr * 100).toFixed(2) : 0,
          mirr !== null ? +(mirr * 100).toFixed(2) : 0
        ],
        backgroundColor: ['#4f46e5', '#3730a3'],
        borderColor: ['#4f46e5', '#3730a3'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 800 }}>
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">📈 IRR / MIRR Comparison Simulation</h2>
        <p className="login-subtext">
          Input your investment and cash flows, then compare IRR vs. MIRR under CFO-grade assumptions.
        </p>
        <div className="login-form">
          {[
            ['Initial Investment ($)', initialInvestment, setInitialInvestment],
            ['Cash Flows (comma-sep)', cashFlowsInput, setCashFlowsInput],
            ['Finance Rate (%)', financeRate, setFinanceRate],
            ['Reinvest Rate (%)', reinvestRate, setReinvestRate]
          ].map(([ph, val, set], i) => (
            <input key={i}
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
            <button onClick={simulate}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Run Simulation
            </button>
          </div>
        </div>

        {(irr !== null && mirr !== null) && (
          <>
            <div style={{ marginTop: '20px' }}>
              <h4>IRR vs MIRR</h4>
              <Bar
                ref={chartRef}
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'IRR vs MIRR Comparison' }
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
              <button onClick={exportToPDF}
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
              <button onClick={exportToCSV}
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
          </>
        )}
      </div>
    </div>
  );
}
