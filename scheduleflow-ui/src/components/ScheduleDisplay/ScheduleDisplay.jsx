import { createContext, useState } from "react";
import ScheduleList from "./ScheduleList";
import ScheduleView from "./ScheduleView";

export const CurrentScheduleContext = createContext();
export default function ScheduleDisplay() {
  const [currScheduleId, setCurrScheduleId] = useState(0)
  return (
    <div className="schedule-display px-8 flex w-full h-screen items-center gap-x-12 bg-indigo-100">
      <CurrentScheduleContext.Provider value={{currScheduleId, setCurrScheduleId}}>
      <ScheduleList />
      <ScheduleView />
      </CurrentScheduleContext.Provider>
    </div>
  )
}
