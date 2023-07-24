export default function ScheduleHeader() {
  return (
    <table className="schedule-view-header sticky top-0 left-0 z-10 grid grid-cols-6 bg-indigo-200 w-full grid-flow-col divide-x-2 divide-zinc-600 h-16 text-xl">
      <header className="header-cell text-black font-semibold px-4 flex items-center justify-end"> Time </header>
      <header className="header-cell text-black font-semibold px-4 flex items-center"> Mon </header>
      <header className="header-cell text-black font-semibold px-4 flex items-center"> Tue </header>
      <header className="header-cell text-black font-semibold px-4 flex items-center"> Wed </header>
      <header className="header-cell text-black font-semibold px-4 flex items-center"> Thu </header>
      <header className="header-cell text-black font-semibold px-4 flex items-center"> Fri </header>
    </table>
  )
}
