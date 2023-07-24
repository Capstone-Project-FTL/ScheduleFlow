import EventCard from "./EventCard";

export default function ScheduleContentGrid() {
  const start = new Date();
  start.setHours(6, 15, 0);
  const end = new Date();
  end.setHours(22, 0, 0);
  const mockStart = new Date();
  mockStart.setHours(13, 0, 0);
  const mockEnd = new Date();
  mockEnd.setHours(9, 50, 0);
  const numOfIterations = Math.ceil((end - start) / (3600 * 1000 * 0.25)); // 0.5 means 30 minutes per divider
  return (
    <div className="schedule-content-grid grid grid-cols-6 grid-flow-col-dense divide-x-2 divide-gray-300 text-xl text-black w-full ">
      <div
        className={`time-span sticky left-0 grid grid-flow-row divide-y-2 divide-gray-300`}
      >
        {Array(numOfIterations)
          .fill(0)
          .map((_, i) => {
            start.setTime(start.getTime() + 15 * 60 * 1000);
            return (
                <p className="header-cell font-semibold px-4 flex justify-end items-center  text-neutral-500 h-10">
                  {`${String(start.getHours()).padStart(2, "0")}:${String(
                    start.getMinutes()
                  ).padStart(2, "0")}`}
                </p>
            );
          })}
      </div>
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((_, idx) => (
        <div
          className={`time-span relative grid grid-flow-row divide-y-2 divide-gray-300 overflow-x-hidden`}
          id={`${idx}`}
        >
          {Array(numOfIterations)
            .fill(0)
            .map((_, i) => (
                <p className="h-10"></p>
            ))}
            <EventCard start={mockStart} end={mockEnd} />
        </div>
      ))}
    </div>
  );
}
