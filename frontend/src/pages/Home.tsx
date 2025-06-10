import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

import '/Users/manassingh/LeanFoundr/frontend/src/styles/login.css';


import Dashboard from './Dashboard';
import Learn from './Learn';
import Simulation from './Simulation';
import Forum from './Forum';
import Events from './Events';
import AiCFO from './AiCFO';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Learn':
        return <Learn />;
      case 'Simulation':
        return <Simulation />;
      case 'Forum':
        return <Forum />;
      case 'Events':
        return <Events />;
      case 'AI CFO':
        return <AiCFO />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar onTabChange={setActiveTab} activeTab={activeTab} />
      <div className="main-content">
        
        <main className="content-area">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </div>
  );
  
}
