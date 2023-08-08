const scheduleRoute = require("express").Router();
const pool = require("../database");
const fetchCoursesData = require("../utils/fetchCoursesData");
const { generateScheduleFlows } = require("../../adapter/scheduler/scheduler");
const { authenticateToken } = require("../middleware/security");
const Favorites = require("../models/favorites");

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

// Add new Favorites
scheduleRoute.post(
  "/schedule/favorite",
  authenticateToken,
  async (req, res) => {
    if (res.locals.error !== null)
      res.status(401).send({ message: res.locals.error.message });
    /* sample res.locals
  {
  payload: {
    id: 1,
    email: '',
    school: '',
    iat: 1691522156,
    exp: 1691525756
  },
  error: null
}
*/ else {
      try {
        const newFav = await Favorites.add(req.body, res.locals.payload.id);
        res
          .status(200)
          .send({ added: newFav, message: "Schedule Added to Favorites" });
      } catch (error) {
        if (error.code === "23505") {
          res.status(200).send({ message: "Schedule Already in Favorites" });
        }
      }
    }
  }
);

module.exports = scheduleRoute;
