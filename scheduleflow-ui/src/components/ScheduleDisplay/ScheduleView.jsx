import ScheduleContentGrid from "./ScheduleContentGrid";

export default function ScheduleView() {
  return (
    <div className="schedule-view relative bg-indigo-100 h-5/6 w-[70%] drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-lg">
      <ScheduleContentGrid />
    </div>
  );
}
