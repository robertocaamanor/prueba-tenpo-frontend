import React from 'react';
import './App.css';
import Transaction from './Transaction';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Transaction Viewer</h1>
      </header>
      <Transaction />
    </div>
  );
}

export default App;