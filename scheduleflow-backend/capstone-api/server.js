const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./database");
const {PORT} = require("./config")
const fetchCoursesData = require("./utils/fetchCoursesData");
const { generateScheduleFlows } = require("../adapter/scheduler/scheduler");
const morgan = require("morgan")

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"))
//ROUTES

//Create a Schedule
app.post("/schedules", async (req, res) => {
  try {
    const { courses } = req.body;
    const coursesArray = await fetchCoursesData(courses);
    const schedules = await generateScheduleFlows(coursesArray);

    res.json(
      {courses: coursesArray,
        schedules:schedules
    });

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
    res.status(400).json({ error: "Error"});

  }
});

app.get("/",(req, res) => {res.send('pong')})

// Return Subjects and Course IDs
app.get("/courses", async (req, res) => {
  try {
    const subjectsAndCourses = await pool.query("SELECT * FROM courses;");
    res.json(subjectsAndCourses.rows);
  } catch (err) {
    console.error("error " +  err.message);
  }
});

//Run server on the following port
app.listen(PORT, () => {
  console.log(`🚀Server running on Port ${PORT}`);
});
