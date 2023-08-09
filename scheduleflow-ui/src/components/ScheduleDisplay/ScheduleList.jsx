import { useContext } from "react";
import ScheduleCard from "./ScheduleCard";
import { AppStateContext, FavoriteViewContext } from "../App/App";

export default function ScheduleList() {
  const { appState, setAppState } = useContext(AppStateContext);
  const { showingFavorites, setShowingFavorites } =
    useContext(FavoriteViewContext);
  const schedules = showingFavorites ? appState.favorites : appState.schedules;
  return (
    <div className="schedule-list h-5/6 min-w-[25rem] w-[25%] overflow-y-scroll gap-y-1 bg-indigo-50 drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)] rounded-lg p-6 box-border">
      <div className="h-12 sticky top-0 z-10 flex items-center rounded-lg m-0">
        <h1 className="font-bold text-neutral-600 text-4xl pl-2">{showingFavorites ? "Favorites" : "Schedules" }</h1>
        <div className="divider my-1"></div>
      </div>
      {!schedules || schedules.length === 0 ? (
        <p className="font-semibold text-2xl text-neutral-600">
          {showingFavorites
            ? "Your Favorited Schedules will Appear Here"
            : "No schedule could be generated &nbsp; ;"}
        </p>
      ) : (
        <div
          className="sticky top-16 overflow-scroll"
          style={{ height: `calc(100% - 4rem)` }}>
          {schedules.map((schedule, i) => {
            return (
              <>
                <ScheduleCard scheduleFlow={schedule} index={i} name={schedule.name} />
                {i < schedules.length - 1 ? (
                  <div className="divider my-1"></div>
                ) : undefined}
              </>
            );
          })}
        </div>
      )}
    </div>
  );
}
