import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landingpage from '../LandingPage/LandingPage';
import NavBar from '../Navbar/Navbar';
import Login from '../Login/Login';
import HomePage from '../HomePage/HomePage';
import Register from '../Register/Register';
import ShoppingCart from '../CourseShoppingCart/CourseShoppingCart';
import ScheduleDisplay from '../ScheduleDisplay/ScheduleDisplay';

export default function App() {
  useEffect(() => {
    document.title = "Course Flow";
  }, []);
  return (
    <>
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/schedule" element={<ScheduleDisplay />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shoppingcart" element={<ShoppingCart/>}/>
        </Routes>
      </BrowserRouter>
    </div>
    </>
  );
}