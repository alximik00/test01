import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import Signup from './components/Signup';
import ItemsList from './components/ItemsList';
import './App.css';

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/items"
          element={
            <PrivateRoute>
              <ItemsList />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/items" />} />
      </Routes>
    </div>
  );
}

export default App;
