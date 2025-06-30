import React from 'react';
import { useParams } from 'react-router-dom';
import RevenueForecast from './RevenueForecast';
import ExpenseBudgetSimulation from './ExpenseBudget';
import CashFlowProjection from './CashFlowProjection';
import BudgetVariance from './BudgetVariance';
import BestCaseWorstCase from './BestCaseWorstCase';
import TornadoSensitivity from './TornadoSensitivity';
import BudgetVarianceAnalysis from '/Users/manassingh/LeanFoundr/frontend/src/pages/simulations/BudgetVariance.tsx';
import MonteCarloSimulation from '/Users/manassingh/LeanFoundr/frontend/src/pages/simulations/MonteCarloSimulation.tsx';
import LiquidityStressTest from './LiquidityStressTest';
import BreakEvenAnalysis from './BreakEvenAnalysis';
import VAR_CFAR_Simulation from './VAR_CFAR_Simulation';
import DCF_Modeling_Simulation from './DCF_Modeling_Simulation'
import PaybackPeriodSimulation from './PaybackPeriodSimulation';
import IRR_MIRR_Simulation from './IRR_MIRR_Simulation';
import WorkingCapitalSimulation from './WorkingCapitalSimulation';
import CashRunwaySimulation from './CashRunwaySimulation';

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
  if(decoded == 'Budget Variance What-If Analysis'){
    return <BudgetVarianceAnalysis/>
  }
  if(decoded == 'Monte Carlo Simulation'){
    return <MonteCarloSimulation/>
  }
  if(decoded == 'Liquidity Stress Test'){
    return <LiquidityStressTest/>
  }
  if(decoded == 'Best-Case/Worst-Case Scenario Analysis'){
    return <BestCaseWorstCase/>
  }

  if(decoded == 'Break-Even Analysis (Contribution Margin Simulation)'){
    return <BreakEvenAnalysis/>
  }

  if(decoded == 'Value-At-Risk (VaR) / Cash-Flow at Risk (CFaR) Simulation'){
    return <VAR_CFAR_Simulation/>
  }

  if(decoded == 'Discounted Cash Flow (DCF) Modeling with Scenario Branches'){
    return <DCF_Modeling_Simulation/>
  }

  if(decoded == 'Payback Period Sensitivity Simulation'){
    return <PaybackPeriodSimulation/>
  }

  if(decoded == 'IRR/Modified IRR (MIRR) Comparison Simulation'){
    return <IRR_MIRR_Simulation/>
  }

  if(decoded == 'Working Capital Simulation'){
    return <WorkingCapitalSimulation/>
  }

  if(decoded == 'Cash Runway / Burn-Rate Simulation'){
    return <CashRunwaySimulation/>
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