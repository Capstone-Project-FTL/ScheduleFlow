import { AppStateContext } from "../App/App";
import EventCard from "./EventCard";
import { useContext } from "react";

const gridStartTime = new Date(Date.UTC(1970, 0, 1, 6, 0, 0));
const gridEndTime = new Date(Date.UTC(1970, 0, 1, 22, 0, 0));
const getTimeSlots = (schedule) => {
  const timeSlotDays = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
  };

  schedule?.forEach((node) => {
    node.days.forEach((day) => {
      timeSlotDays[day].push(node);
    });
  });
  return timeSlotDays;
};

const cellDuration = 0.5; // fraction in hours
// const schedules = JSON.parse(localStorage.getItem("schedules"))
// const timeSlotDays = getTimeSlots(schedules[0]?.schedule);
const numOfIterations = Math.ceil(
  (gridEndTime - gridStartTime) / (3600 * 1000 * cellDuration)
); // 0.5 means 30 minutes per divider

export default function ScheduleContentGrid() {
  const tempStartTime = new Date(Date.UTC(1970, 0, 1, 6, 0, 0)); // used to fill the time slots
  const {appState, setAppState} = useContext(AppStateContext)
  if(!(appState.courses && appState.schedules)) setAppState({...appState, courses:JSON.parse(localStorage.getItem("courses")), schedules: JSON.parse(localStorage.getItem("schedules"))})
  // if async setSappState has not finished setting the state
  const schedules = appState.schedules? appState.schedules : JSON.parse(localStorage.getItem("courses"))
  const timeSlotDays = getTimeSlots(schedules[0].schedule)
  return (
    <div className="schedule-content-grid relative grid auto-cols-fr xl:grid-cols-[repeat(16, minmax(0, 1fr))] grid-flow-col-dense divide-x-2 divide-gray-300 text-xl text-black xl:w-full w-max ">
      <div
        className={`time-span sticky left-0 grid divide-y-2 divide-gray-300 text-base bg-indigo-100 z-40 col-span-1`}>
        <div className="schedule-view-header sticky top-0 left-0 flex  items-center justify-end z-30 bg-indigo-200 w-full grid-flow-col divide-x-2 divide-zinc-600 h-16 text-xl">
          <header className="header-cell text-black font-semibold px-2"></header>
        </div>
        {Array(numOfIterations)
          .fill(0)
          .map((_, i) => {
            tempStartTime.setTime(
              tempStartTime.getTime() + cellDuration * 60 * 60 * 1000
            );
            return (
              <p className="header-cell font-extrabold px-2 flex justify-end text-neutral-600 h-16">
                {`${String(tempStartTime.getUTCHours()).padStart(
                  2,
                  "0"
                )}:${String(tempStartTime.getUTCMinutes()).padStart(2, "0")}`}
              </p>
            );
          })}
      </div>
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, idx) => (
        <div
          className={`time-span grid grid-flow-row relative divide-y-2 divide-gray-300 overflow-clip text-base col-span-4 md:col-span-3 xl:col-span-2 bg-indigo-50`}
          id={`${idx}`}>
          <div className="schedule-view-header sticky top-0 left-0 flex  items-center justify-start z-30 bg-indigo-200 w-full grid-flow-col divide-x-2 divide-zinc-600 h-16 text-xl">
            <header className="header-cell text-black font-semibold px-4">
              {day}
            </header>
          </div>
          {Array(numOfIterations)
            .fill(0)
            .map((_, i) => (
              <div className="h-16">
                {timeSlotDays[day].map((e) => (
                  <EventCard
                    gridStartTime={gridStartTime}
                    start={e.startTime}
                    end={e.endTime}
                  />
                ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
