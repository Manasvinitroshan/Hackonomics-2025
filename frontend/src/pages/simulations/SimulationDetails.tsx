import React from 'react';
import { useParams } from 'react-router-dom';
import RevenueForecast from './RevenueForecast';
import ExpenseBudgetSimulation from './ExpenseBudget';
import CashFlowProjection from './CashFlowProjection';
import BudgetVariance from './BudgetVariance';
import BestCaseWorstCase from './BestCaseWorstCase';
import TornadoSensitivity from './TornadoSensitivity';

export default function SimulationDetail() {
  const { title } = useParams();
  const decoded = decodeURIComponent(title || '');

  if (decoded === 'Revenue Forecast Simulation') {
    return <RevenueForecast />;
  }
  if (decoded === 'Expense/Budget Simulation') {
    return <ExpenseBudgetSimulation />;
  }

  if(decoded === 'Cash Flow Projection Simulation'){
    return <CashFlowProjection/>
  }

  if(decoded === 'Budget Variance What‑If Analysis'){
    return <BudgetVariance/>
  }

  if(decoded === 'Best‑Case/Worst‑Case Scenario Analysis'){
    return <BestCaseWorstCase/>
  }

  if(decoded == 'Sensitivity Analysis (Tornado Chart)'){
    return <TornadoSensitivity/>
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-heading">{decoded}</h2>
        <p className="login-subtext">Simulation not yet implemented.</p>
      </div>
    </div>
  );
}