import EventCard from "./EventCard";

export default function ScheduleContentGrid() {
  const gridStartTime = new Date(Date.UTC(1970, 0, 1, 6, 0, 0));
  const tempStartTime = new Date(Date.UTC(1970, 0, 1, 6, 0, 0)); // used to fill the time slots
  const gridEndTime = new Date(Date.UTC(1970, 0, 1, 22, 0, 0));
  const getTimeSlots = (schedule) => {
    const timeSlotDays = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
    };

    schedule.forEach((node) => {
      node.days.forEach((day) => {
        timeSlotDays[day].push(node);
      });
    });
    return timeSlotDays;
  };

  const cellDuration = 0.5 // fraction in hours
  const schedules = JSON.parse(localStorage.getItem("schedules"));
  const timeSlotDays = getTimeSlots(schedules[0].schedule);
  const numOfIterations = Math.ceil((gridEndTime - gridStartTime) / (3600 * 1000 * cellDuration)); // 0.5 means 30 minutes per divider
  return (
    <div className="schedule-content-grid relative grid auto-cols-fr lg:grid-cols-6 grid-flow-col-dense divide-x-2 divide-gray-300 text-xl text-black min-w-full w-max ">
      <div
        className={`time-span sticky left-0 grid divide-y-2 divide-gray-300 text-base bg-indigo-100 z-40`}>
        <div className="schedule-view-header sticky top-0 left-0 flex  items-center justify-end z-30 bg-indigo-200 w-full grid-flow-col divide-x-2 divide-zinc-600 h-16 text-xl">
          <header className="header-cell text-black font-semibold px-4">
            Time
          </header>
        </div>
        {Array(numOfIterations)
          .fill(0)
          .map((_, i) => {
            tempStartTime.setTime(tempStartTime.getTime() + (cellDuration * 60) * 60 * 1000);
            return (
              <p className="header-cell font-extrabold px-4 flex justify-end text-neutral-500 h-16">
                {`${String(tempStartTime.getUTCHours()).padStart(2, "0")}:${String(
                  tempStartTime.getMinutes()
                ).padStart(2, "0")}`}
              </p>
            );
          })}
      </div>
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, idx) => (
        <div
          className={`time-span grid grid-flow-row relative divide-y-2 divide-gray-300 overflow-clip text-base col-span-3 sm:col-span-2 md:col-span-1`}
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
                  <EventCard gridStartTime={gridStartTime} start={e.startTime} end={e.endTime} />
                ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
