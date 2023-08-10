import ScheduleList from "./ScheduleList";
import ScheduleView from "./ScheduleView";
import {useContext, useEffect} from "react"
import { FavoriteViewContext } from "../App/App";
import NavBar from "../Navbar/Navbar";


export default function ScheduleDisplay() {
  const {favState, setFavState} = useContext(FavoriteViewContext)
  useEffect(() => {
  setFavState(favState => ({...favState, showingFavorites: false}))
  }, [])
  // 4 rem is the hieght of the nav bar
  return (
    <div style={{height: "calc(100vh - 4rem)"}}> 
      <NavBar />
      <div className="schedule-display px-8 flex w-full h-full items-center gap-x-12 bg-indigo-100">
      <ScheduleList />
      <ScheduleView />
    </div>
    </div>
  )
}
