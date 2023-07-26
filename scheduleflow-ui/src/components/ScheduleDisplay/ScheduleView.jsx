import SchdeuleTimeBlock from "./SchdeuleTimeBlock";
import ScheduleContentGrid from "./ScheduleContentGrid";
import ScheduleHeader from "./ScheduleHeader";

export default function ScheduleView() {
  return (
    <div className="schedule-view relative bg-indigo-50 h-5/6 w-5/6 drop-shadow-[0_0px_20px_rgba(0,0,0,0.25)] rounded-lg overflow-y-scroll">
      {/* <SchdeuleTimeBlock /> */}
      {/* <ScheduleHeader /> */}
      <ScheduleContentGrid />
    </div>
  );
}
