import {useContext} from 'react'
import ScheduleList from '../ScheduleDisplay/ScheduleList'
import ScheduleView from '../ScheduleDisplay/ScheduleView'
import { AppStateContext, FavoriteViewContext } from '../App/App'

export default function Favorites() {
  const {appState, setAppState} = useContext(AppStateContext)
  const {showingFavorites, setShowingFavorites} = useContext(FavoriteViewContext)
  setShowingFavorites(true)
  return (
    <div className="schedule-display px-8 flex w-full h-screen items-center gap-x-12 bg-indigo-100">
      <ScheduleList />
      <ScheduleView />
    </div>
  )
}
