import React, { useState } from 'react';
import PS1Demo from './components/PS1Demo';
import InteractivePortfolioMap from './components/world/InteractivePortfolioMap';
import './App.css';

const App: React.FC = () => {
  const [view, setView] = useState<'shader-lab' | 'project-map'>('shader-lab');

  return (
    <main className="appShell">
      <header className="topBar">
        <h1>Polyfolio</h1>
        <div className="viewSwitch" role="tablist" aria-label="View selector">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'shader-lab'}
            className={view === 'shader-lab' ? 'active' : ''}
            onClick={() => setView('shader-lab')}
          >
            Shader Lab
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'project-map'}
            className={view === 'project-map' ? 'active' : ''}
            onClick={() => setView('project-map')}
          >
            Project Map
          </button>
        </div>
      </header>

      <section className="appStage">
        {view === 'shader-lab' ? <PS1Demo /> : <InteractivePortfolioMap />}
      </section>
    </main>
  );
};

export default App;
