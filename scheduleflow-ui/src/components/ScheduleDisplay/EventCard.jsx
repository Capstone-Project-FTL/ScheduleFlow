// 2.5 rem is used becuse thats the height of each cell block
// I may abstact that away
// Pixel offset: 1px based on the dividers thickness
export default function EventCard({ start, end }) {
  const gridStart = new Date();
  gridStart.setHours(6, 30, 0);
  const getBlocksFromTop = (start) => {
    // console.log(start.getSeconds())
    // console.log(gridStart)
    const startSec =
      start.getHours() * 3600 + start.getMinutes() * 60 + start.getSeconds();
    const gridStartSec =
      gridStart.getHours() * 3600 +
      gridStart.getMinutes() * 60 +
      gridStart.getSeconds();
    return Math.abs(gridStartSec - startSec) / (60 * 15);
  };

  const getHeight = (start, end) => {
    const startSec =
      start.getHours() * 3600 + start.getMinutes() * 60 + start.getSeconds();
      const endSec =
      end.getHours() * 3600 + end.getMinutes() * 60 + end.getSeconds();
      return Math.abs(endSec - startSec)/(60 * 15)
  };

  return (
    <div
      className={
        "event-card rounded-md absolute bg-indigo-200 w-full h-10 border-none"
      }
      style={{ top: `calc(2.5rem*${getBlocksFromTop(start)} + 1px)`, height: `calc(2.5rem * ${getHeight(start, end)} + 1px)`}}
    >
      Event
    </div>
  );
}
