import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useTheme } from './ThemeContext';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="App">
      <header className="App-header">
        <div className="theme-toggle-container">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
