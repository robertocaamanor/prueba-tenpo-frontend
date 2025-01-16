import React from 'react';
import './Navbar.css';

function Navbar({ title }) {
  return (
    <nav className="Navbar">
      <h1>{title}</h1>
    </nav>
  );
}

export default Navbar;