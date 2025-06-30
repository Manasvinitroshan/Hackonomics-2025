// src/pages/Simulation.tsx
import React, { useState } from 'react';
import { useNavigate }       from 'react-router-dom';
import '/Users/manassingh/LeanFoundr/frontend/src/styles/simulation.css';

const simulationCategories = [
  {
    category: 'Forecasting & Budgeting',
    items: [
      'Revenue Forecast Simulation',
      'Expense/Budget Simulation',
      'Cash Flow Projection Simulation',
      'Budget Variance What-If Analysis',
    ],
  },
  {
    category: 'Scenario & Sensitivity Analysis',
    items: [
      'Best-Case/Worst-Case Scenario Analysis',
      'Sensitivity Analysis (Tornado Chart)',
      'Break-Even Analysis (Contribution Margin Simulation)',
    ],
  },
  {
    category: 'Risk & Monte Carlo',
    items: [
      'Monte Carlo Simulation',
      'Value-At-Risk (VaR) / Cash-Flow at Risk (CFaR) Simulation',
    ],
  },
  {
    category: 'Capital Budgeting & Investment',
    items: [
      'Discounted Cash Flow (DCF) Modeling with Scenario Branches',
      'Payback Period Sensitivity Simulation',
      'IRR/Modified IRR (MIRR) Comparison Simulation',
    ],
  },
  {
    category: 'Cash & Liquidity',
    items: [
      'Working Capital Simulation',
      'Cash Runway / Burn-Rate Simulation',
      'Liquidity Stress Test',
    ],
  },
];

export default function Simulation() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleClick = (sim: string) => {
    setSelected(sim);
    navigate(`/simulation/${encodeURIComponent(sim)}`);
  };

  return (
    <div className="simulation-page">
      <div className="simulation-container">
        <h2 className="simulation-title">Simulation Types</h2>
        <p className="simulation-subtext">
          Explore the key financial scenarios every startup founder needs.
        </p>

        {simulationCategories.map((cat, idx) => (
          <section key={idx} className="simulation-section">
            <h3>{cat.category}</h3>
            <div className="simulation-grid">
              {cat.items.map((item, subIdx) => (
                <button
                  key={subIdx}
                  onClick={() => handleClick(item)}
                  className="simulation-button"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
