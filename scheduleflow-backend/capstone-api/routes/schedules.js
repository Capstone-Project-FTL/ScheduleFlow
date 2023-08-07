const scheduleRoute = require("express").Router();
const pool = require("../database");
const fetchCoursesData = require("../utils/fetchCoursesData");
const { generateScheduleFlows } = require("../../adapter/scheduler/scheduler");

scheduleRoute.post("/schedules", async (req, res) => {
  try {
    const { courses } = req.body;
    const coursesArray = await fetchCoursesData(courses);
    const schedules = await generateScheduleFlows(coursesArray);

    res.json({ courses: coursesArray, schedules: schedules });
  } catch (err) {
    console.error(err.message);
  }
});

//Return Schedules
scheduleRoute.get("/schedules", async (req, res) => {
  try {
    res.json(schedules);
  } catch (err) {
    console.error(err.message);
  }
});

// Return Subjects and Course IDs
scheduleRoute.get("/courses", async (req, res) => {
  try {
    const subjectsAndCourses = await pool.query("SELECT * FROM courses;");
    res.json(subjectsAndCourses.rows);
  } catch (err) {
    console.error("error " + err.message);
  }
});

module.exports = scheduleRoute;
