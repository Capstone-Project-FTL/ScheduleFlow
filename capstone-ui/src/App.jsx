import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landingpage from "./components/LandingPage";
import NavBar from "./components/Navbar";
import Login from './components/Login';
import Home from './components/HomePage';
import Register from './components/Register';

export default function App() {
  useEffect(() => {
    document.title = "Course Flow";
  }, []);
  return (
    // <NavBar/>
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
