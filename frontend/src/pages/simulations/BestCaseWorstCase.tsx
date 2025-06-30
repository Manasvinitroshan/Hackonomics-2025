// src/pages/BestWorstScenarioAnalysis.tsx
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BestWorstScenarioAnalysis() {
  // Inputs
  const [revenue, setRevenue]             = useState('');
  const [costs, setCosts]                 = useState('');
  const [growthBest, setGrowthBest]       = useState('');
  const [growthWorst, setGrowthWorst]     = useState('');
  const [marginBest, setMarginBest]       = useState('');
  const [marginWorst, setMarginWorst]     = useState('');
  const [horizon, setHorizon]             = useState('');
  const [discountRate, setDiscountRate]   = useState('');

  // Results
  const [bestNom,  setBestNom ] = useState<number[]>([]);
  const [bestDisc, setBestDisc] = useState<number[]>([]);
  const [worstNom, setWorstNom] = useState<number[]>([]);
  const [worstDisc,setWorstDisc]= useState<number[]>([]);
  const [npvBest,  setNpvBest ] = useState<number | null>(null);
  const [npvWorst, setNpvWorst]= useState<number | null>(null);

  const chartRef = useRef<any>(null);

  const simulate = () => {
    const rev  = parseFloat(revenue);
    const cst  = parseFloat(costs);
    const gb   = parseFloat(growthBest)  / 100;
    const gw   = parseFloat(growthWorst)/ 100;
    const mb   = parseFloat(marginBest)  / 100;
    const mw   = parseFloat(marginWorst)/ 100;
    const yrs  = parseInt(horizon, 10);
    const dr   = parseFloat(discountRate)/ 100;

    if ([rev,cst,gb,gw,mb,mw,yrs,dr].some(v=>isNaN(v)||v<0)) return;

    const bn: number[] = [], bd: number[] = [];
    const wn: number[] = [], wd: number[] = [];
    let npvB = 0, npvW = 0;

    for (let i = 1; i <= yrs; i++) {
      // nominal net
      const revBest  = rev * Math.pow(1 + gb, i);
      const profitB  = revBest * mb;
      const netBest  = revBest - cst + profitB;
      const revWorst = rev * Math.pow(1 + gw, i);
      const profitW  = revWorst * mw;
      const netWorst = revWorst - cst + profitW;

      // discount factor
      const df = 1 / Math.pow(1 + dr, i);

      bn.push(+netBest.toFixed(2));
      bd.push(+(netBest * df).toFixed(2));
      wn.push(+netWorst.toFixed(2));
      wd.push(+(netWorst * df).toFixed(2));

      npvB += netBest * df;
      npvW += netWorst * df;
    }

    setBestNom(bn);
    setBestDisc(bd);
    setWorstNom(wn);
    setWorstDisc(wd);
    setNpvBest(+npvB.toFixed(2));
    setNpvWorst(+npvW.toFixed(2));
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ unit:'pt', format:'a4' });
    doc.setFont('helvetica','normal');
    doc.setFontSize(16);
    doc.text('Best-Case/Worst-Case Scenario Analysis', 40, 40);
    doc.setFontSize(12);

    doc.text(`Initial Revenue: $${revenue}`, 40, 70);
    doc.text(`Costs: $${costs}`, 250, 70);
    doc.text(`Best-Case Growth: ${growthBest}%`, 40, 90);
    doc.text(`Worst-Case Growth: ${growthWorst}%`, 250, 90);
    doc.text(`Best-Case Margin: ${marginBest}%`, 40, 110);
    doc.text(`Worst-Case Margin: ${marginWorst}%`, 250, 110);
    doc.text(`Horizon: ${horizon} yrs`, 40, 130);
    doc.text(`Discount Rate: ${discountRate}%`, 250, 130);

    doc.text(`NPV Best-Case: $${npvBest?.toLocaleString()}`, 40, 160);
    doc.text(`NPV Worst-Case: $${npvWorst?.toLocaleString()}`, 250,160);

    const chart = chartRef.current;
    if (chart) {
      const img = chart.toBase64Image();
      doc.addImage(img, 'PNG', 40, 180, 520, 300);
    }
    doc.save('best_worst_case_analysis.pdf');
  };

  const exportToCSV = () => {
    const header = ['Year','Net Best','Disc Best','Net Worst','Disc Worst'];
    const rows = bestNom.map((_,i)=>[
      `Year ${i+1}`,
      bestNom[i].toFixed(2),
      bestDisc[i].toFixed(2),
      worstNom[i].toFixed(2),
      worstDisc[i].toFixed(2)
    ]);
    rows.push(['NPV', npvBest?.toFixed(2)+'','','', npvWorst?.toFixed(2)+'']);
    const csv = [header, ...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'best_worst_case_analysis.csv';
    a.click();
  };

  const chartData = {
    labels: bestDisc.map((_,i)=>`Y${i+1}`),
    datasets: [
      {
        label: 'Best-Case (Disc)',
        data: bestDisc,
        backgroundColor: 'rgba(79,70,229,0.5)',
        borderColor: 'rgba(79,70,229,1)',
        borderWidth: 1
      },
      {
        label: 'Worst-Case (Disc)',
        data: worstDisc,
        backgroundColor: 'rgba(255,99,132,0.5)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/simulation" className="back-link">← Back to Simulations</Link>
        <h2 className="login-heading">📉 Best/Worst Scenario Analysis</h2>
        <p className="login-subtext">
          CFO-level: project net cash under best/worst cases, discount to NPV.
        </p>

        <div className="login-form">
          {[
            ['Initial Revenue ($)', revenue, setRevenue],
            ['Costs ($)',          costs,   setCosts],
            ['Best Growth (%)',    growthBest, setGrowthBest],
            ['Worst Growth (%)',   growthWorst,setGrowthWorst],
            ['Best Margin (%)',    marginBest, setMarginBest],
            ['Worst Margin (%)',   marginWorst,setMarginWorst],
            ['Horizon (yrs)',      horizon, setHorizon],
            ['Discount Rate (%)',  discountRate, setDiscountRate]
          ].map(([ph,val,set],i)=>(
            <input
              key={i}
              type="text"
              placeholder={ph}
              value={val as string}
              onChange={e=>(set as any)(e.target.value)}
              style={{
                backgroundColor:'black',
                color:'white',
                padding:'8px',
                marginBottom:'10px',
                border:'1px solid #444',
                borderRadius:'4px',
                width:'100%',
                boxSizing:'border-box'
              }}
            />
          ))}

          <button
            onClick={simulate}
            style={{
              padding:'8px 16px',
              backgroundColor:'#4f46e5',
              color:'white',
              border:'none',
              borderRadius:'4px',
              cursor:'pointer',
              marginBottom:'20px'
            }}
          >
            Run Analysis
          </button>
        </div>

        {bestDisc.length>0 && (
          <>
            <h4 style={{margin:'1.5rem 0 0.5rem', fontWeight:600}}>Results (Discounted)</h4>
            <ul style={{paddingLeft:'1.2rem', fontSize:'0.875rem'}}>
              {bestDisc.map((_,i)=>(
                <li key={i}>
                  Year {i+1}: Best <strong>${bestDisc[i].toLocaleString()}</strong>,  
                  Worst <strong>${worstDisc[i].toLocaleString()}</strong>
                </li>
              ))}
            </ul>

            <div style={{marginTop:'20px'}}>
              <h4>NPV Comparison</h4>
              <Bar
                ref={chartRef}
                data={chartData}
                options={{
                  responsive:true,
                  plugins:{
                    legend:{position:'top'},
                    title:{display:true,text:'Discounted Net Scenarios'}
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
              <button
                onClick={exportToPDF}
                style={{
                  padding:'8px 16px',
                  backgroundColor:'#4f46e5',
                  color:'white',
                  border:'none',
                  borderRadius:'4px',
                  cursor:'pointer'
                }}
              >
                Export to PDF
              </button>
              <button
                onClick={exportToCSV}
                style={{
                  padding:'8px 16px',
                  backgroundColor:'#4f46e5',
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
