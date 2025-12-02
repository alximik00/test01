import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SearchPage />} />
      </Routes>
    </div>
  );
}

export default App;
