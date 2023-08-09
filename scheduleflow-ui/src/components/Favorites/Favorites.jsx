import React from 'react'
import ScheduleList from '../ScheduleDisplay/ScheduleList'
import ScheduleView from '../ScheduleDisplay/ScheduleView'
import {useContext} from "react"

export default function Favorites() {
  return (
    <div className="schedule-display px-8 flex w-full h-screen items-center gap-x-12 bg-indigo-100">
      <ScheduleList />
      <ScheduleView />
    </div>
  )
}
