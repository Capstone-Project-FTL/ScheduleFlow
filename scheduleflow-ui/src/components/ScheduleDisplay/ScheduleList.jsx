import { useContext } from "react";
import ScheduleCard from "./ScheduleCard";
import { AppStateContext } from "../App/App";

export default function ScheduleList() {
  const { appState, setAppState } = useContext(AppStateContext);
  return (
    <div className="schedule-list h-5/6 min-w-[25rem] w-[25%] overflow-y-scroll gap-y-1 bg-indigo-50 drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-lg p-6">
      <h1 className="font-bold text-neutral-600 text-4xl pb-2">Schedules</h1>
      <div className="divider my-1"></div>
      {!appState.schedules || appState.schedules.length === 0 ? (
        <p>No schedule could be generated ;(</p>
      ) : (
        appState.schedules.map((schedule, i) => {
          return (
            <>
              <ScheduleCard scheduleFlow={schedule} index={i + 1}/>
              <div className="divider my-1"></div>
            </>
          );
        })
      )}
    </div>
  );
}
