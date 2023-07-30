// 2.5 rem is used becuse thats the height of each cell block
// I may abstact that away
// Pixel offset: 1px based on the dividers thickness
export default function EventCard({gridStartTime, start, end }) {
  start = new Date(start)
  end = new Date(end)
  const getBlocksFromTop = (start) => {
    const startSec =
      start.getUTCHours() * 3600 + start.getUTCMinutes() * 60 + start.getUTCSeconds();
    const gridStartTimeSec =
      gridStartTime.getUTCHours() * 3600 +
      gridStartTime.getUTCMinutes() * 60 +
      gridStartTime.getUTCSeconds();
    return Math.abs(gridStartTimeSec - startSec) / (60 * 30); // 2 cuz of the length of the header
  };

  const getHeight = (start, end) => {
    const startSec =
      start.getUTCHours() * 3600 + start.getUTCMinutes() * 60 + start.getUTCSeconds();
      const endSec =
      end.getUTCHours() * 3600 + end.getUTCMinutes() * 60 + end.getUTCSeconds();
      return Math.abs(endSec - startSec)/(60 * 30)
  };

  return (
    <div
      className={
        "event-card absolute bg-indigo-200 w-full h-10 border-l-4 border-l-indigo-500 z-10 pl-1"
      }
      style={{ top: `calc(4rem*${getBlocksFromTop(start)} + 1px)`, height: `calc(4rem * ${getHeight(start, end)})`}}
    >
      <p className="">
        {`${String(start.getUTCHours()).padStart(2, "0")}:${String(start.getUTCMinutes()).padStart(2, "0")} - ${String(end.getUTCHours()).padStart(2, "0")}:${String(end.getUTCMinutes()).padStart(2, "0")}`}
        </p>
    </div>
  );
}
