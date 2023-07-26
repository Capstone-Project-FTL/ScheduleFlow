const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./database");
const fetchCoursesData = require("./utils/fetchCoursesData");
const { generateSchedules } = require(".././src/scheduler/scheduler");

const PORT = 3001;


//middleware
app.use(cors());
app.use(express.json());


//ROUTES

//Create a Schedule
app.post("/schedules", async (req, res) => {
  try {
    const { courses } = req.body;
    const coursesArray = await fetchCoursesData(courses);
    const schedules = generateSchedules(coursesArray);

    //the below code console.logs the entirety of the generated schedules
    // console.dir(schedules, { depth: null });

    res.json(schedules);
    // the below code reveals the days of the week that the course is held
    // res.json(schedules[0].map((s)=> Array.from(s.days)))
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

// Function to close the connection pool gracefully
function closeConnectionPool() {
  pool.end().finally(() => {
    console.log("Connection pool closed.");
    process.exit(0); // Exit the process with a success code (0).
  });
}


//Close pool connection when server is down

// Listen for the exit event
process.on("exit", closeConnectionPool);

// Listen for the SIGINT event (Ctrl+C) to handle process termination
process.on("SIGINT", () => {
  console.log("Server terminated by SIGINT.");
  closeConnectionPool();
});

// Listen for the SIGTERM event to handle process termination
process.on("SIGTERM", () => {
  console.log("Server terminated by SIGTERM.");
  closeConnectionPool();
});


//Run server on the following port
app.listen(PORT, () => {
  console.log(`🚀Server running on Port ${PORT}`);
});
