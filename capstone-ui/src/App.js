import { useEffect } from "react";
import Landingpage from "./components/LandingPage";
import NavBar from "./components/Navbar";

export default function App() {
  useEffect(() => {
    document.title = "Course Scheduler";
  }, []);
  return (
    // <NavBar/>

    <Landingpage />
  );
}
