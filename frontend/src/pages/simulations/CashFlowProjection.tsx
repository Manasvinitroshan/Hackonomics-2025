// src/pages/CashFlowProjectionSimulation.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CashFlowProjectionSimulation() {
  const [opInflow0, setOpInflow0]             = useState('');
  const [opInflowGrowth, setOpInflowGrowth]   = useState('');
  const [opOutflow0, setOpOutflow0]           = useState('');
  const [opOutflowGrowth, setOpOutflowGrowth] = useState('');
  const [invest0, setInvest0]                 = useState('');
  const [investGrowth, setInvestGrowth]       = useState('');
  const [finance0, setFinance0]               = useState('');
  const [financeGrowth, setFinanceGrowth]     = useState('');
  const [years, setYears]                     = useState('');

  const [baseNet, setBaseNet] = useState<number[]>([]);
  const [optNet, setOptNet]   = useState<number[]>([]);
  const [pesNet, setPesNet]   = useState<number[]>([]);

  const chartRef = useRef<any>(null);

  // 1) Compute net cash flow series
  const simulate = () => {
    const opIn0 = parseFloat(opInflow0);
    const opIg  = parseFloat(opInflowGrowth)   / 100;
    const opOut0= parseFloat(opOutflow0);
    const opOg  = parseFloat(opOutflowGrowth)  / 100;
    const inv0  = parseFloat(invest0);
    const ig    = parseFloat(investGrowth)     / 100;
    const fin0  = parseFloat(finance0);
    const fg    = parseFloat(financeGrowth)    / 100;
    const n     = parseInt(years, 10);
    if ([opIn0, opIg, opOut0, opOg, inv0, ig, fin0, fg, n].some(v => isNaN(v) || v < 0)) return;

    const base: number[] = [];
    const opt: number[]  = [];
    const pes: number[]  = [];

    for (let i = 1; i <= n; i++) {
      const inflow   = opIn0   * Math.pow(1 + opIg, i);
      const outflow  = opOut0  * Math.pow(1 + opOg, i);
      const invest   = inv0    * Math.pow(1 + ig,    i);
      const finance  = fin0    * Math.pow(1 + fg,    i);

      base.push(+((inflow - outflow - invest + finance).toFixed(2)));

      // optimistic: stronger inflow/invest, weaker outflow
      const inflowO  = opIn0   * Math.pow(1 + opIg * 1.2, i);
      const outflowO = opOut0  * Math.pow(1 + opOg * 0.8, i);
      const investO  = inv0    * Math.pow(1 + ig    * 1.2, i);
      const financeO = fin0    * Math.pow(1 + fg    * 1.2, i);
      opt.push(+((inflowO - outflowO - investO + financeO).toFixed(2)));

      // pessimistic: weaker inflow/invest, stronger outflow
      const inflowP  = opIn0   * Math.pow(1 + opIg * 0.8, i);
      const outflowP = opOut0  * Math.pow(1 + opOg * 1.2, i);
      const investP  = inv0    * Math.pow(1 + ig    * 0.8, i);
      const financeP = fin0    * Math.pow(1 + fg    * 0.8, i);
      pes.push(+((inflowP - outflowP - investP + financeP).toFixed(2)));
    }

    setBaseNet(base);
    setOptNet(opt);
    setPesNet(pes);
  };

  // 2) After chart renders, upload chart + metadata
  useEffect(() => {
    if (baseNet.length === 0) return;
    const timer = setTimeout(async () => {
      try {
        const img = chartRef.current?.toBase64Image();
        if (!img) throw new Error('Chart image not ready');

        await axios.post('/api/simulations', {
          userId:         'anonymous',
          simulationType: 'CashFlowProjection',
          parameters: {
            opInflow0, opInflowGrowth,
            opOutflow0, opOutflowGrowth,
            invest0, investGrowth,
            finance0, financeGrowth,
            years
          },
          results: { baseNet, optNet, pesNet },
          chartImage: img
        });
        console.log('Cash flow simulation saved');
      } catch (err) {
        console.error('Upload failed', err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [
    baseNet, optNet, pesNet,
    opInflow0, opInflowGrowth,
    opOutflow0, opOutflowGrowth,
    invest0, investGrowth,
    finance0, financeGrowth,
    years
  ]);

  // PDF export
  const exportToPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text('Cash Flow Projection', 40, 40);
    doc.setFontSize(12);
    doc.text(`Operating Inflow: $${opInflow0}`, 40, 70);
    doc.text(`Inflow Growth: ${opInflowGrowth}%`, 40, 90);
    doc.text(`Operating Outflow: $${opOutflow0}`, 40, 110);
    doc.text(`Outflow Growth: ${opOutflowGrowth}%`, 40, 130);
    doc.text(`Investing CF: $${invest0}`, 40, 150);
    doc.text(`Invest Growth: ${investGrowth}%`, 40, 170);
    doc.text(`Financing CF: $${finance0}`, 40, 190);
    doc.text(`Finance Growth: ${financeGrowth}%`, 40, 210);
    doc.text(`Time Horizon: ${years} yrs`, 40, 230);

    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 250, 500, 300);
    }
    doc.save('cash_flow_projection.pdf');
  };

  // CSV export
  const exportToCSV = () => {
    const header = ['Year','Base Net','Optimistic Net','Pessimistic Net'];
    const rows = baseNet.map((_, i) => [
      `Year ${i+1}`,
      baseNet[i].toString(),
      optNet[i].toString(),
      pesNet[i].toString()
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cash_flow_projection.csv';
    link.click();
  };

  const chartData = {
    labels: baseNet.map((_, i) => `Year ${i+1}`),
    datasets: [
      { label: 'Base Case',           data: baseNet, borderColor: '#4f46e5', tension: 0.1 },
      { label: 'Optimistic (↑)',       data: optNet,   borderColor: '#3730a3', tension: 0.1 },
      { label: 'Pessimistic (↓)',      data: pesNet,   borderColor: '#818cf8', tension: 0.1 }
    ]
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">💵 Cash Flow Projection</h2>
        <p className="login-subtext">
          CFO‐level cash flow modeling: project operating, investing & financing cash flows over time.
        </p>

        <div className="login-form">
          {[
            ['Operating Inflow ($)', opInflow0, setOpInflow0],
            ['Inflow Growth (%)',   opInflowGrowth, setOpInflowGrowth],
            ['Operating Outflow ($)', opOutflow0, setOpOutflow0],
            ['Outflow Growth (%)',  opOutflowGrowth, setOpOutflowGrowth],
            ['Investing CF ($)',     invest0, setInvest0],
            ['Invest Growth (%)',    investGrowth, setInvestGrowth],
            ['Financing CF ($)',     finance0, setFinance0],
            ['Finance Growth (%)',   financeGrowth, setFinanceGrowth],
            ['Time Horizon (yrs)',   years, setYears]
          ].map(([ph, val, setter], idx) => (
            <input
              key={idx}
              type="text"
              placeholder={ph}
              value={val as string}
              onChange={e => (setter as any)(e.target.value)}
              style={{
                color: 'white',
                backgroundColor: 'black',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #444',
                borderRadius: '4px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          ))}

          <button
            onClick={simulate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            Run Projection
          </button>
        </div>

        {baseNet.length > 0 && (
          <>
            <h4 style={{ margin: '1.5rem 0 0.5rem', fontWeight: 600 }}>💡 Net Cash Flow Results</h4>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.875rem' }}>
              {baseNet.map((_, i) => (
                <li key={i}>
                  Year {i+1}: Base <strong>${baseNet[i].toLocaleString()}</strong>,{' '}
                  Opt <strong>${optNet[i].toLocaleString()}</strong>,{' '}
                  Pes <strong>${pesNet[i].toLocaleString()}</strong>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '20px' }}>
              <h4>Cash Flow Scenarios</h4>
              <Line
                ref={chartRef}
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Net Cash Flow Over Time' }
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
                  backgroundColor: '#4f46e5',
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
                  backgroundColor: '#4f46e5',
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
