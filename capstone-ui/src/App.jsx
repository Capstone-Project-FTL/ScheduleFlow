import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landingpage from "./components/LandingPage";
import NavBar from "./components/Navbar";
import Login from './components/Login';

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
        </Routes>
      </BrowserRouter>
    </div>
  );
}
