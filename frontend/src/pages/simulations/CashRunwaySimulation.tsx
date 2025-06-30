// src/pages/CashRunwaySimulation.tsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
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
import '/Users/manassingh/LeanFoundr/frontend/src/styles/login.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CashRunwaySimulation() {
  // Inputs
  const [cashBalance, setCashBalance]   = useState('');
  const [fixedBurn, setFixedBurn]       = useState('');
  const [variableBurn, setVariableBurn] = useState('');
  const [revenue, setRevenue]           = useState('');
  const [growthRate, setGrowthRate]     = useState('');
  const [swingPct, setSwingPct]         = useState('');
  const [horizonMonths, setHorizonMonths] = useState('');

  // Results
  const [runwayBase, setRunwayBase] = useState<number[]>([]);
  const [runwayOpt, setRunwayOpt]   = useState<number[]>([]);
  const [runwayPes, setRunwayPes]   = useState<number[]>([]);
  const chartRef = useRef<any>(null);

  const simulate = () => {
    const cb = parseFloat(cashBalance);
    const fb = parseFloat(fixedBurn);
    const vb = parseFloat(variableBurn);
    const rev0 = parseFloat(revenue);
    const g = parseFloat(growthRate) / 100;
    const s = parseFloat(swingPct) / 100;
    const months = parseInt(horizonMonths, 10);
    if ([cb, fb, vb, rev0, g, s, months].some(v => isNaN(v) || v < 0)) return;

    const base: number[] = [];
    const opt:  number[] = [];
    const pes:  number[] = [];

    let cashB = cb, cashO = cb, cashP = cb;
    for (let m = 1; m <= months; m++) {
      // revenue inflow
      const revM = rev0 * Math.pow(1+g, m/12);
      // base burn = fixed + variable
      const burnB = fb + vb;
      // optimistic: 10% lower burn, 10% higher rev growth
      const burnO = fb * (1 - s) + vb * (1 - s);
      const revO = rev0 * Math.pow(1+g*(1+s), m/12);
      // pessimistic: 10% higher burn, 10% lower rev growth
      const burnP = fb * (1 + s) + vb * (1 + s);
      const revP = rev0 * Math.pow(1+g*(1-s), m/12);

      cashB = cashB + revM - burnB;
      cashO = cashO + revO - burnO;
      cashP = cashP + revP - burnP;

      base.push(+cashB.toFixed(2));
      opt.push(+cashO.toFixed(2));
      pes.push(+cashP.toFixed(2));
    }

    setRunwayBase(base);
    setRunwayOpt(opt);
    setRunwayPes(pes);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    doc.setFont('helvetica','normal');
    doc.setFontSize(16);
    doc.text('Cash Runway / Burn-Rate Simulation', 40, 40);
    doc.setFontSize(12);
    doc.text(`Starting Cash: $${cashBalance}`, 40, 70);
    doc.text(`Fixed Burn: $${fixedBurn}/mo`, 40, 90);
    doc.text(`Variable Burn: $${variableBurn}/mo`, 40, 110);
    doc.text(`Revenue Start: $${revenue}/mo`, 40, 130);
    doc.text(`Growth Rate: ${growthRate}%/yr`, 40, 150);
    doc.text(`Swing: ±${swingPct}%`, 40, 170);
    doc.text(`Horizon: ${horizonMonths} mo`, 40, 190);

    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 210, 520, 300);
    }

    doc.save('cash_runway_simulation.pdf');
  };

  const exportToCSV = () => {
    const header = ['Month','Cash Base','Cash Optimistic','Cash Pessimistic'];
    const rows = runwayBase.map((_,i) => [
      (i+1).toString(),
      runwayBase[i].toFixed(2),
      runwayOpt[i].toFixed(2),
      runwayPes[i].toFixed(2)
    ]);
    const csv = [header, ...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='cash_runway_simulation.csv';
    a.click();
  };

  const labels = runwayBase.map((_,i) => `M${i+1}`);
  const data = {
    labels,
    datasets: [
      { label:'Base Cash',           data:runwayBase, borderColor:'#4f46e5', tension:0.1 },
      { label:'Optimistic Cash',    data:runwayOpt,   borderColor:'#3730a3', tension:0.1 },
      { label:'Pessimistic Cash',   data:runwayPes,   borderColor:'#818cf8', tension:0.1 },
    ]
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth:800 }}>
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">💵 Cash Runway / Burn-Rate Simulation</h2>
        <p className="login-subtext">
          CFO‐level projection of runway under varying burn & revenue scenarios.
        </p>
        <div className="login-form">
          {[
            ['Starting Cash ($)', cashBalance, setCashBalance],
            ['Fixed Burn ($/mo)', fixedBurn, setFixedBurn],
            ['Variable Burn ($/mo)', variableBurn, setVariableBurn],
            ['Initial Revenue ($/mo)', revenue, setRevenue],
            ['Annual Growth Rate (%)', growthRate, setGrowthRate],
            ['Swing (%)', swingPct, setSwingPct],
            ['Horizon (months)', horizonMonths, setHorizonMonths]
          ].map(([ph,val,set],i)=>(
            <input key={i}
              type="text"
              placeholder={ph}
              value={val as string}
              onChange={e=>(set as any)(e.target.value)}
              style={{
                width:'100%',
                padding:'10px',
                marginBottom:'10px',
                backgroundColor:'black',
                color:'white',
                border:'1px solid #444',
                borderRadius:'4px',
                boxSizing:'border-box'
              }}
            />
          ))}

          <div style={{ textAlign:'center', marginBottom:'20px' }}>
            <button onClick={simulate}
              style={{
                padding:'10px 20px',
                backgroundColor:'#4f46e5',
                color:'white',
                border:'none',
                borderRadius:'4px',
                cursor:'pointer'
              }}
            >
              Run Simulation
            </button>
          </div>
        </div>

        {runwayBase.length > 0 && (
          <>
            <div style={{ marginTop:'20px' }}>
              <h4>Cash Balance Over Time</h4>
              <Line
                ref={chartRef}
                data={data}
                options={{
                  responsive:true,
                  plugins:{
                    legend:{position:'top'},
                    title:{display:true,text:'Cash Runway Scenarios'}
                  }
                }}
              />
            </div>
            <div style={{
              display:'flex',
              justifyContent:'flex-end',
              gap:'10px',
              marginTop:'20px'
            }}>
              <button onClick={exportToPDF}
                style={{
                  padding:'8px 16px',
                  backgroundColor:'#28a745',
                  color:'white',
                  border:'none',
                  borderRadius:'4px',
                  cursor:'pointer'
                }}
              >
                Export to PDF
              </button>
              <button onClick={exportToCSV}
                style={{
                  padding:'8px 16px',
                  backgroundColor:'#ffc107',
                  color:'white',
                  border:'none',
                  borderRadius:'4px',
                  cursor:'pointer'
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
