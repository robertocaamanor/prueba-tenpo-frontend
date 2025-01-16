import React from 'react';
import './App.css';
import Transaction from './Transaction';
import Navbar from './bootstrap/Navbar'; // Importa el componente Navbar desde la carpeta /bootstrap

function App() {
  return (
    <div className="App">
      <Navbar title="Tenpo Transacciones" /> {/* Pasa el título como prop */}
      <Transaction />
    </div>
  );
}

export default App;