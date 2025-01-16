import React from 'react';
import Transaction from './components/Transaction';
import Navbar from './bootstrap/Navbar';

const App = () => {
  return (
    <div className="App">
      <Navbar title="Tenpo Transacciones" />
      <Transaction />
    </div>
  );
};

export default App;