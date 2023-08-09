import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleList from "../ScheduleDisplay/ScheduleList";
import ScheduleView from "../ScheduleDisplay/ScheduleView";
import { AppStateContext, FavoriteViewContext } from "../App/App";
import axios from "axios";

export default function Favorites() {
  const { appState, setAppState } = useContext(AppStateContext);
  const { showingFavorites, setShowingFavorites } =
    useContext(FavoriteViewContext);
  const navigate = useNavigate();
  setShowingFavorites(true);
  useEffect(() => {
    const changeSchedulesToFavorite = async() => {
        const response = await axios.get(
          "http://localhost:3001/schedules/favorite",
          { headers: { Authorization: localStorage.getItem("token")} }
        );
        setAppState((appState) => ({
          ...appState,
          favorites: response.data.favorites.map(schedule => schedule.favorite_schedule),
        }));
       
      }
    changeSchedulesToFavorite()
    .catch(error => { if (error.code === "ERR_BAD_REQUEST") localStorage.removeItem("token");
    setAppState({
      user: null,
      token: null,
      favorites: [],
      courses: null,
      schedules: [],
      currScheduleId: 0,
    }); navigate("/login")})
  }, []);

  return (
    <div className="schedule-display px-8 flex w-full h-screen items-center gap-x-12 bg-indigo-100">
      <ScheduleList />
      <ScheduleView />
    </div>
  );
}
