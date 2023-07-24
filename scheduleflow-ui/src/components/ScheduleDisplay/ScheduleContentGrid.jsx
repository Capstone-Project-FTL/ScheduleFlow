import EventCard from "./EventCard";

export default function ScheduleContentGrid() {
  const start = new Date(1970, 0, 1);
  start.setHours(6, 15, 0);
  const end = new Date(1970, 0, 1);
  end.setHours(22, 0, 0);
  const times = {"Mon": [{startTime: new Date(1970, 0, 1, 7, 30, 0, 0), endTime: new Date(1970, 0, 1, 7, 40, 0, 0)},
    {startTime: new Date(1970, 0, 1, 10, 30, 0, 0), endTime: new Date(1970, 0, 1, 12, 0, 0, 0)},
    {startTime: new Date(1970, 0, 1, 20, 30, 0, 0), endTime: new Date(1970, 0, 1, 21, 40, 0, 0)},
    {startTime: new Date(1970, 0, 1, 15, 30, 0, 0), endTime: new Date(1970, 0, 1, 16, 20, 0, 0)}
  ]}
  const numOfIterations = Math.ceil((end - start) / (3600 * 1000 * 0.25)); // 0.5 means 30 minutes per divider
  return (
    <div className="schedule-content-grid grid grid-cols-6 grid-flow-col-dense divide-x-2 divide-gray-300 text-xl text-black w-full ">
      <div
        className={`time-span sticky left-0 grid grid-flow-row divide-y-2 divide-gray-300 text-base bg-indigo-100 z-20`}
      >
        {Array(numOfIterations)
          .fill(0)
          .map((_, i) => {
            start.setTime(start.getTime() + 15 * 60 * 1000);
            return (
              <p className="header-cell font-extrabold px-4 flex justify-end items-center text-neutral-500 h-8">
                {`${String(start.getHours()).padStart(2, "0")}:${String(
                  start.getMinutes()
                ).padStart(2, "0")}`}
              </p>
            );
          })}
      </div>
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, idx) => (
        <div
          className={`time-span grid grid-flow-row relative divide-y-2 divide-gray-300 overflow-clip text-base `}
          id={`${idx}`}
        >
          {Array(numOfIterations)
            .fill(0)
            .map((_, i) => (
              <p className="h-8">
                {times[day]?.map((e) => <EventCard start={e.startTime} end={e.endTime} />)}
              </p>
            ))}
        </div>
      ))}
    </div>
  );
}
