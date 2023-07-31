import { createContext } from "react";
import ScheduleList from "./ScheduleList";
import ScheduleView from "./ScheduleView";

export const CurrentScheduleContext = createContext();
export default function ScheduleDisplay() {
  const 
  return (
    <div className="schedule-display px-8 flex w-full h-screen items-center gap-x-12 bg-indigo-100">
      <CurrentScheduleContext.Provider>
      <ScheduleList />
      <ScheduleView />
      </CurrentScheduleContext.Provider>
    </div>
  )
}
