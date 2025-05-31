// pages/Simulation.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const simulationCategories = [
  {
    category: 'Forecasting & Budgeting Simulations',
    items: [
      'Revenue Forecast Simulation',
      'Expense/Budget Simulation',
      'Cash Flow Projection Simulation',
      'Budget Variance What‑If Analysis'
    ]
  },
  {
    category: 'Scenario & Sensitivity Analyses',
    items: [
      'Best‑Case/Worst‑Case Scenario Analysis',
      'Sensitivity Analysis (Tornado Chart)',
      'Break‑Even Analysis (Contribution Margin Simulation)',
      'What‑If ROI/Payback Simulation'
    ]
  },
  {
    category: 'Risk & Monte Carlo Simulations',
    items: [
      'Monte Carlo Simulation',
      'Value‑At‑Risk (VaR) / Cash‑Flow at Risk (CFaR) Simulation',
      'Stress Testing (Extreme Scenario Simulation)'
    ]
  },
  {
    category: 'Capital Budgeting & Investment Appraisal',
    items: [
      'Discounted Cash Flow (DCF) Modeling with Scenario Branches',
      'Payback Period Sensitivity Simulation',
      'IRR/Modified IRR (MIRR) Comparison Simulation',
      'Real Options Valuation Simulation'
    ]
  },
  {
    category: 'Pricing & Sales Simulations',
    items: [
      'Price Elasticity & Demand Curve Simulation',
      'Promotional Spend ROI Simulation',
      'Channel Mix & Commission Simulation',
      'Subscription/Churn Simulation'
    ]
  },
  {
    category: 'Cash & Liquidity Simulations',
    items: [
      'Working Capital Simulation',
      'Cash Runway / Burn‑Rate Simulation',
      'Debt Service & Covenant Simulation',
      'Liquidity Stress Test'
    ]
  },
  {
    category: 'Risk Management & Compliance Simulations',
    items: [
      'Credit Risk Simulation (Customer Default Risk)',
      'Interest Rate Sensitivity Simulation',
      'Foreign Exchange (FX) Exposure Simulation',
      'Commodity Price Hedging Simulation',
      'Insurance Premium vs. Risk Exposure Analysis'
    ]
  },
  {
    category: 'Valuation & Exit Planning Simulations',
    items: [
      'Comparable Company (“Comps”) Multiples Sensitivity Simulation',
      'Precedent Transaction (“Precedents”) Multiples Simulation',
      'LBO (Leveraged Buyout) Model Simulation',
      'Shareholder Liquidity & SPAC/IPO Exit Simulation'
    ]
  },
  {
    category: 'Operational & Project‑Level Simulations',
    items: [
      'Project Cash‑Flow Waterfall Simulation',
      'Inventory & Supply‑Chain Simulation (EOQ & Reorder Point)',
      'Manufacturing Throughput & Capacity Simulation',
      'Project Scheduling & Cost Overrun Simulation (PERT/CPM with Cost Variability)'
    ]
  },
  {
    category: 'Tax & Regulatory Impact Simulations',
    items: [
      'Tax Liability Simulation',
      'Sales Tax / VAT Impact Simulation',
      'Regulatory Compliance Cost Simulation'
    ]
  },
  {
    category: 'Financing & Capital Structure Simulations',
    items: [
      'Debt vs. Equity Financing Comparison',
      'Convertible Debt / Preferred Stock Simulation',
      'Dividend Policy & Share Buyback Simulation',
      'Equity Dilution & Cap Table Simulation'
    ]
  },
  {
    category: 'Performance & KPI Dashboards',
    items: [
      'Key Metric Dashboard Simulation',
      'Balanced Scorecard Financial Impact Simulation',
      'Key Ratio Sensitivity (ROIC, ROA, Current Ratio)'
    ]
  },
  {
    category: 'Specialized Industry Simulations',
    items: [
      'Hospital/Healthcare Revenue Cycle Simulation',
      'Hotel/Hospitality ADR & Occupancy Simulation',
      'Retail Assortment & Markdown Simulation',
      'Oil & Gas Production & Price Exposure Simulation',
      'SaaS Cohort Analysis & LTV/CAC Simulation'
    ]
  },
  {
    category: 'M&A & Strategic Transaction Simulations',
    items: [
      'Merger Model (Accretion/Dilution Simulation)',
      'Synergy Realization Simulation',
      'Spin‑Off / Carve‑Out Business Valuation Simulation',
      'Joint Venture / Partnership Profit‑Share Simulation'
    ]
  },
  {
    category: 'Macro & Market Environment Simulations',
    items: [
      'Macroeconomic Sensitivity Simulation',
      'Interest‑Rate Curve Shock Simulation',
      'Inflationary Environment Simulation'
    ]
  },
  {
    category: 'ESG & Sustainability Simulations',
    items: [
      'Carbon Pricing / Emissions Cost Simulation',
      'ESG Investment Return Simulation'
    ]
  }
];

export default function Simulation() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleClick = (sim: string) => {
    setSelected(sim);
    navigate(`/simulation/${encodeURIComponent(sim)}`);
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ width: '100%', maxWidth: '960px' }}>
        <h2 className="login-heading">Simulation Types</h2>
        <p className="login-subtext">Explore and simulate a wide range of startup financial scenarios.</p>

        <div className="mt-8">
          {simulationCategories.map((cat, idx) => (
            <div key={idx} className="simulation-category">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
