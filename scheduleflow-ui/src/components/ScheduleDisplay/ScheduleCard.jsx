export default function ScheduleCard() {
  return (
    <div className="card group rounded-md bg-indigo-100 h-[7.5rem] w-full my-1 p-4 shadow-md flex flex-row gap-x-2 active:bg-indigo-200">
      <div className="flex flex-col h-full justify-center">
        <div
          className="radial-progress text-indigo-500 group-active:text-indigo-700 text-xl font-extrabold shadow-lg"
          style={{ "--value": 80, "--size": "5.5rem", "--thickness": "0.35rem" }}>
          4.00/5
        </div>
      </div>
      <div className="flex flex-col w-full h-full justify-center">
      <h1 className="font-bold text-neutral-600 text-xl group-active:text-neutral-800">Schedule #1</h1>
      <div className=" flex flex-row">
        <div className="flex flex-col text-black">
          <p className="inline">Class Days: &nbsp;</p>
          <p className="inline">Earliest Stat Time: &nbsp;</p>
          <p className="inline">Latest Stat Time: &nbsp;</p>
        </div>
        <div className="flex flex-col">
          <p className="text-black text-md">M Tu W Th F</p>
          <p className="text-black text-md">24:00</p>
          <p className="text-black text-md">24:00</p>
        </div>
      </div>
      </div>
    </div>
  );
}
