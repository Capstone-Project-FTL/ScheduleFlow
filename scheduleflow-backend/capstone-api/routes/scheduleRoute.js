const scheduleRoute = require("express").Router();
const pool = require("../database");
const fetchCoursesData = require("../utils/fetchCoursesData");
const { generateScheduleFlows } = require("../../adapter/scheduler/scheduler");
const { authenticateToken } = require("../middleware/security");
const Favorites = require("../models/favorites");
const { BadRequestError } = require("../utils/errors");

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

// get all favorite schedules
scheduleRoute.get("/schedules/favorite", async (req, res) => {
  if (res.locals.error !== null)
    res.status(401).send({ message: res.locals.error.message });
  else {
    try {
      const favorites = await Favorites.getAllFavorites(res.locals.payload.id);
      res.status(200).send({
        favorites: favorites,
        message: "All Users Faborites Successfully Retrieved",
      });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
});

// Add new Favorites
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
*/
scheduleRoute.post(
  "/schedules/favorite",
  authenticateToken,
  async (req, res) => {
    if (res.locals.error !== null)
      {res.status(401).send({ message: res.locals.error.message });}
    else {
      try {
        const newFav = await Favorites.add(req.body, res.locals.payload.id);
        res
          .status(200)
          .send({ newFav: newFav, message: "Schedule Added to Favorites" });
      } catch (error) {
        if (error.code === "23505") {
          res.status(200).send({ message: "Schedule Already in Favorites" });
        } else if (error instanceof BadRequestError) {
          res.status(200).send({ message: "Cannot Add Schedule to Favorites" });
        } else {
          res.status(400).send({ message: error.message });
        }
      }
    }
  }
);

scheduleRoute.delete("/schedules/favorite/:name", authenticateToken, async (req, res) => {
  if (res.locals.error !== null)
      {res.status(401).send({ message: res.locals.error.message });}
  try{
    const deletedSchedule = await Favorites.deleteFavorite(req.params.name, res.locals.payload.id)
    if(Object.keys(deletedSchedule).length > 0){
      res.status(200).send({message: "Successfully deleted " + req.params.name, deletedSchedule: deletedSchedule})
    }
    else{
      res.status(200).send({message: req.params.name + " not found"})
    }
  }catch(error){
    console.error(error.message)
    res.status(400).send({message: "Could not delete schedule"})
  }
})

module.exports = scheduleRoute;
