// src/pages/MonteCarloSimulation.tsx
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

export default function MonteCarloSimulation() {
  // Inputs
  const [iterations, setIterations]           = useState('');
  const [initialRevenue, setInitialRevenue]   = useState('');
  const [revMean, setRevMean]                 = useState('');
  const [revStdDev, setRevStdDev]             = useState('');
  const [initialCost, setInitialCost]         = useState('');
  const [costMean, setCostMean]               = useState('');
  const [costStdDev, setCostStdDev]           = useState('');
  const [horizon, setHorizon]                 = useState('');
  const [discountRate, setDiscountRate]       = useState('');

  // Results
  const [npvs, setNpvs]                       = useState<number[]>([]);
  const [percentiles, setPercentiles]         = useState<{p5:number,p50:number,p95:number}|null>(null);

  const chartRef = useRef<any>(null);

  const simulate = () => {
    const it = parseInt(iterations, 10);
    const rev0 = parseFloat(initialRevenue);
    const μr = parseFloat(revMean)/100;
    const σr = parseFloat(revStdDev)/100;
    const c0 = parseFloat(initialCost);
    const μc = parseFloat(costMean)/100;
    const σc = parseFloat(costStdDev)/100;
    const yrs = parseInt(horizon,10);
    const dr  = parseFloat(discountRate)/100;

    if ([it,rev0,μr,σr,c0,μc,σc,yrs,dr].some(v=>isNaN(v)||v<=0)) return;

    const sims: number[] = [];
    for (let i=0;i<it;i++){
      let npv = 0;
      for (let y=1;y<=yrs;y++){
        const growthR = μr + (Math.random()*2-1)*σr;
        const growthC = μc + (Math.random()*2-1)*σc;
        const revY = rev0 * Math.pow(1+growthR,y);
        const costY= c0   * Math.pow(1+growthC,y);
        const cfY = revY - costY;
        npv += cfY / Math.pow(1+dr,y);
      }
      sims.push(+npv.toFixed(2));
    }

    sims.sort((a,b)=>a-b);
    const p5  = sims[Math.floor(0.05*it)];
    const p50 = sims[Math.floor(0.50*it)];
    const p95 = sims[Math.floor(0.95*it)];
    setNpvs(sims);
    setPercentiles({p5,p50,p95});
  };

  // Histogram bins
  const bins = 20;
  const data = () => {
    if (!npvs.length) return { labels:[], datasets:[] };
    const min = Math.min(...npvs);
    const max = Math.max(...npvs);
    const width = (max - min)/bins;
    const counts = Array(bins).fill(0);
    npvs.forEach(v=>{
      const idx = Math.min(bins-1, Math.floor((v-min)/width));
      counts[idx]++;
    });
    const labels = counts.map((_,i)=>{
      const start = (min + i*width).toFixed(0);
      const end = (min + (i+1)*width).toFixed(0);
      return `${start}–${end}`;
    });
    return {
      labels,
      datasets:[{
        label:'NPV Distribution',
        data:counts,
        backgroundColor:'rgba(75,192,192,0.5)',
        borderColor:'rgba(75,192,192,1)',
        borderWidth:1
      }]
    };
  };

  const exportToPDF = () => {
    const doc = new jsPDF({unit:'pt',format:'a4'});
    doc.setFont('helvetica','normal');
    doc.setFontSize(16);
    doc.text('Monte Carlo NPV Simulation',40,40);
    doc.setFontSize(12);
    doc.text(`Iterations: ${iterations}`,40,70);
    doc.text(`Rev Mean/StdDev: ${revMean}% / ${revStdDev}%`,40,90);
    doc.text(`Cost Mean/StdDev: ${costMean}% / ${costStdDev}%`,40,110);
    doc.text(`Horizon: ${horizon} yrs`,40,130);
    doc.text(`Discount Rate: ${discountRate}%`,40,150);
    if (percentiles) {
      doc.text(`5th pct NPV: $${percentiles.p5}`,40,170);
      doc.text(`Median NPV: $${percentiles.p50}`,200,170);
      doc.text(`95th pct NPV: $${percentiles.p95}`,380,170);
    }
    const chart = chartRef.current;
    if(chart){
      const img = chart.toBase64Image();
      doc.addImage(img,'PNG',40,190,520,300);
    }
    doc.save('monte_carlo_npv.pdf');
  };

  const exportToCSV = () => {
    const header = ['Iteration','NPV'];
    const rows = npvs.map((v,i)=>[ (i+1).toString(), v.toFixed(2) ]);
    const csv = [header, ...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'monte_carlo_npv.csv';
    a.click();
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{maxWidth:800}}>
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">🎲 Monte Carlo NPV Simulation</h2>
        <p className="login-subtext">
          Simulate discounted net cash over a horizon for CFO‐level risk analysis.
        </p>

        <div className="login-form">
          {[
            ['Iterations', iterations, setIterations],
            ['Initial Revenue ($)', initialRevenue, setInitialRevenue],
            ['Rev Growth Mean (%)', revMean, setRevMean],
            ['Rev Growth StdDev (%)', revStdDev, setRevStdDev],
            ['Initial Cost ($)', initialCost, setInitialCost],
            ['Cost Growth Mean (%)', costMean, setCostMean],
            ['Cost Growth StdDev (%)', costStdDev, setCostStdDev],
            ['Horizon (yrs)', horizon, setHorizon],
            ['Discount Rate (%)', discountRate, setDiscountRate]
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

          <div style={{textAlign:'center',marginBottom:'20px'}}>
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

        {npvs.length > 0 && (
          <>
            <div style={{marginTop:'20px'}}>
              <h4>NPV Distribution</h4>
              <Bar
                ref={chartRef}
                data={data()}
                options={{
                  responsive:true,
                  plugins:{
                    legend:{position:'top'},
                    title:{display:true,text:'NPV Histogram'}
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
