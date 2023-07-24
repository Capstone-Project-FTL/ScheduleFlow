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

//ROUTES

//Create a Schedule
app.post("/courses", async (req, res) => {
  try {
    const { courses } = req.body;
    schedules = courses;
    res.json(courses);
    // const passCourses = //call scheduler
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
