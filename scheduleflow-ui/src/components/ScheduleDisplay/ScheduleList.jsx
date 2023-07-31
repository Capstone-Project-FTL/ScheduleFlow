import ScheduleCard from "./ScheduleCard";

export default function ScheduleList() {
  return (
    <div className="schedule-list h-[90%] w-[25%] overflow-y-scroll gap-y-1 bg-indigo-50 drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-lg p-6">
      <h1 className="font-bold text-neutral-600 text-4xl pb-2">Schedules</h1>
      <div className="divider my-1"></div>
      <ScheduleCard />
    </div>
  );
}
