import ScheduleList from "./ScheduleList";
import ScheduleView from "./ScheduleView";

export default function ScheduleDisplay() {
  return (
    <div className="schedule-display px-8 flex w-full h-screen items-center gap-x-12 bg-indigo-100">
      <ScheduleList />
      <ScheduleView />
    </div>
  )
}
