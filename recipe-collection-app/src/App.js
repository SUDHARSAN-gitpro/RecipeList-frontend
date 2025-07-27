import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import AddRecipe from './components/AddRecipe';

function RemountOnNav({ children }) {
  const location = useLocation();
  return React.cloneElement(children, { key: location.pathname });
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/home"
          element={
            isLoggedIn ?
              <RemountOnNav><Home onLogout={handleLogout} /></RemountOnNav> :
              <Navigate to="/login" />
          }
        />
        <Route
          path="/add-recipe"
          element={isLoggedIn ? <AddRecipe /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
