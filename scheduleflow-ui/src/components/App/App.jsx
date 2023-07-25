import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from "../LandingPage";
import NavBar from "../Navbar";
import Login from '../Login';
import ScheduleDisplay from '../ScheduleDisplay/ScheduleDisplay';

export default function App() {
  useEffect(() => {
    document.title = "Course Flow";
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
      {/* <NavBar/> */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/schedule" element={<ScheduleDisplay />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}