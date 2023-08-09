import { createContext, useState } from "react";
import ScheduleList from "./ScheduleList";
import ScheduleView from "./ScheduleView";
import {useContext} from "react"
import { FavoriteViewContext } from "../App/App";


export default function ScheduleDisplay() {
  const {showingFavorites, setShowingFavorites} = useContext(FavoriteViewContext)
  setShowingFavorites(false)
  return (
    <div className="schedule-display px-8 flex w-full h-screen items-center gap-x-12 bg-indigo-100">
      <ScheduleList />
      <ScheduleView />
    </div>
  )
}
