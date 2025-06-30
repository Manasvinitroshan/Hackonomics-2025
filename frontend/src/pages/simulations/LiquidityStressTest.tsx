// src/pages/LiquidityStressTest.tsx
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

export default function LiquidityStressTest() {
  // Inputs
  const [currentCash, setCurrentCash]     = useState('');
  const [liabilities, setLiabilities]     = useState('');
  const [monthlyBurn, setMonthlyBurn]     = useState('');
  const [swingPct, setSwingPct]           = useState('');
  const [horizonMonths, setHorizonMonths] = useState('');
  
  // Results
  const [balances, setBalances] = useState<{
    base: number[];
    mild: number[];
    severe: number[];
    extreme: number[];
    survival: Record<string, number | null>;
  } | null>(null);
  const chartRef = useRef<any>(null);
  
  const simulate = () => {
    const cash0      = parseFloat(currentCash);
    const liab      = parseFloat(liabilities);
    const burn      = parseFloat(monthlyBurn);
    const swing     = parseFloat(swingPct) / 100;
    const months    = parseInt(horizonMonths, 10);
    if ([cash0, liab, burn, swingPct, months].some(v => isNaN(v) || v < 0)) return;
  
    const scenarios = {
      base:      { shock: 0 },
      mild:      { shock: swing },
      severe:    { shock: 2 * swing },
      extreme:   { shock: 3 * swing }
    };
    const balances: Record<string, number[]> = {
      base: [], mild: [], severe: [], extreme: []
    };
    const survival: Record<string, number | null> = {
      base: null, mild: null, severe: null, extreme: null
    };
  
    Object.entries(scenarios).forEach(([key, { shock }]) => {
      let cash = cash0;
      const arr: number[] = [];
      for (let m = 1; m <= months; m++) {
        // liabilities grow by shock% per month
        const liabM = liab * Math.pow(1 + shock, m);
        // net outflow = burn + delta liabilities this month
        const prevLiab = liab * Math.pow(1 + shock, m - 1);
        const deltaLiab = liabM - prevLiab;
        cash = cash - burn - deltaLiab;
        arr.push(+cash.toFixed(2));
        if (survival[key] === null && cash <= 0) {
          survival[key] = m;
        }
      }
      balances[key] = arr;
    });
  
    setBalances({ 
      base: balances.base,
      mild: balances.mild,
      severe: balances.severe,
      extreme: balances.extreme,
      survival
    });
  };
  
  const exportToPDF = () => {
    if (!balances) return;
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    doc.setFont('helvetica','normal');
    doc.setFontSize(16);
    doc.text('Liquidity Stress Test Simulation', 40, 40);
    doc.setFontSize(12);
    doc.text(`Starting Cash: $${currentCash}`, 40, 70);
    doc.text(`Liabilities: $${liabilities}`, 40, 90);
    doc.text(`Monthly Burn: $${monthlyBurn}`, 40, 110);
    doc.text(`Stress Swing: ±${swingPct}%`, 40, 130);
    doc.text(`Horizon: ${horizonMonths} months`, 40, 150);

    ['base','mild','severe','extreme'].forEach((key, i) => {
      const label = key === 'base' ? 'Base' : key.charAt(0).toUpperCase() + key.slice(1);
      const surv = balances.survival[key] !== null
        ? `${balances.survival[key]} months`
        : '> horizon';
      doc.text(`${label} survival: ${surv}`, 40, 180 + i * 20);
    });

    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img,'PNG',40,260,520,300);
    }
    doc.save('liquidity_stress_test.pdf');
  };
  
  const exportToCSV = () => {
    if (!balances) return;
    const header = ['Month','Base','Mild','Severe','Extreme'];
    const rows = balances.base.map((_, i) => [
      (i+1).toString(),
      balances.base[i].toFixed(2),
      balances.mild[i].toFixed(2),
      balances.severe[i].toFixed(2),
      balances.extreme[i].toFixed(2)
    ]);
    const csv = [header, ...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='liquidity_stress_test.csv';
    a.click();
  };
  
  const labels = balances?.base.map((_,i)=>`M${i+1}`) || [];
  const data = {
    labels,
    datasets: [
      { label:'Base',     data:balances?.base   || [], borderColor:'#4f46e5', tension:0.1 },
      { label:'Mild Shock',data:balances?.mild  || [], borderColor:'#3730a3', tension:0.1 },
      { label:'Severe Shock',data:balances?.severe||[], borderColor:'#818cf8', tension:0.1 },
      { label:'Extreme Shock',data:balances?.extreme||[], borderColor:'#1f2937', tension:0.1 }
    ]
  };
  
  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth:800 }}>
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">💧 Cash Runway & Liquidity Stress Test</h2>
        <p className="login-subtext">
          Simulate runway & survival under stress shocks: liabilities growth vs burn.
        </p>
        <div className="login-form">
          {[
            ['Starting Cash ($)',     currentCash,   setCurrentCash],
            ['Liabilities ($)',       liabilities,   setLiabilities],
            ['Monthly Burn ($/mo)',   monthlyBurn,   setMonthlyBurn],
            ['Stress Swing (%)',      swingPct,      setSwingPct],
            ['Horizon (months)',      horizonMonths, setHorizonMonths]
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
  
        {balances && (
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
                    title:{display:true,text:'Liquidity under Stress Scenarios'}
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
