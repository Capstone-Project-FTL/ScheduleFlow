import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from "../LandingPage/LandingPage";
import NavBar from "../Navbar/Navbar";
import Login from "../Login/Login";
import HomePage from "../HomePage/HomePage";
import Register from "../Register/Register";
import ShoppingCart from "../CourseShoppingCart/CourseShoppingCart";
import ScheduleDisplay from "../ScheduleDisplay/ScheduleDisplay";

export const AppStateContext = createContext();
export default function App() {
  useEffect(() => {
    document.title = "Course Flow";
  }, []);

  const [appState, setAppState] = useState({
    user: null,
    courses: null,
    schedules: null,
  });
  return (
    <>
      <div className="App text-base">
        <BrowserRouter>
          <AppStateContext.Provider value={{appState, setAppState}}>
            <Routes>
              <Route path="/" element={<Landingpage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/schedule" element={<ScheduleDisplay />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shoppingcart" element={<ShoppingCart />} />
            </Routes>
          </AppStateContext.Provider>
        </BrowserRouter>
      </div>
    </>
  );
}
