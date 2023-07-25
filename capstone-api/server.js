// import {useState} from 'react'

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./database");

const PORT = 3001;
// const [schedules, setSchedules] = useState(['hello', 'world'])

var schedules = {};

//middleware
app.use(cors());
app.use(express.json());

//Sheduler imports
const allCourses = require("../src/scraper/umd.static.db.json").courses;
const {generateSchedules} = require('.././src/scheduler/scheduler')
const ScheduleNode = require("../src/scheduler/scheduleNode");
const staticCourses = [
    allCourses[4],
    allCourses[90],
    // allCourses[55],
    allCourses[150],
    allCourses[186],
  ];

//ROUTES

//Create a Schedule
app.post("/schedules", async (req, res) => {
  try {
    // const { courses } = req.body;
    // schedules = courses;
    // res.json(courses);

    res.json(generateSchedules(staticCourses));

    // *const passCourses = //call scheduler*
  } catch (err) {
    console.error(err.message);
  }
});

//Return Schedules
app.get("/schedules", async (req, res) => {
  try {
    res.json(schedules);
  } catch (err) {
    console.error(err.message);
  }
});

//Return Subjects and Course IDs
app.get("/courses", async (req, res) => {
  try {
    const subjectsAndCourses = await pool.query("SELECT * FROM courses");
    res.json(subjectsAndCourses.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🚀Server running on Port ${PORT}`);
});
