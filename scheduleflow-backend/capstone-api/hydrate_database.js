const pool = require("./database");
// const db = pgp(process.env.DATABASE_URL);
require("colors")

const allCourses = require("../adapter/scraper/umd.static.db.json");
// Sample JSON data
const jsonData = allCourses;

pool.query(`CREATE TABLE favorites(
  userid BIGINT REFERENCES users(id) NOT NULL,
  favorite_name TEXT NOT NULL CONSTRAINT name_check_length CHECK (char_length(favorite_name) > 0),
  favorite_schedule TEXT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT unique_combo UNIQUE (userid, favorite_schedule),
  PRIMARY KEY (userid, favorite_name, favorite_schedule)
);`)


pool.query(`CREATE TABLE users(
  id SERIAL NOT NULL,
  email varchar(255) NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
  password varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  school varchar(255) NOT NULL,
  created_at TIMESTAMP DEFAULT current_timestamp,
  PRIMARY KEY(id) 
);`)


// Function to check if a course already exists
async function doesCourseExist(course_prefix, course_code) {
  const course = await pool.query(
    "SELECT * FROM courses WHERE course_prefix = $1 AND course_code = $2",
    [course_prefix, course_code]
  );
  return course.rows.length > 0;
}

// Function to check if a section already exists
async function doesSectionExist(course_prefix, course_code, section_id) {
  const section = await pool.query(
    "SELECT * FROM sections WHERE course_prefix = $1 AND course_code = $2 AND section_id = $3",
    [course_prefix, course_code, section_id]
  );
  return section.rows.length > 0;
}

// Function to hydrate courses, sections, and labs into the database
async function hydrateDatabase() {
  try {

    for (const course of jsonData.courses) {
      const { course_prefix, course_code, title, credits, sections } = course;

      // Check if the course already exists in the database
      const courseExists = await doesCourseExist(course_prefix, course_code);

      if (!courseExists) {
        // Insert course into the courses table
        await pool.query(
          "INSERT INTO courses (course_prefix, course_code, term, course_description) VALUES ($1, $2, $3, $4)",
          [course_prefix, course_code, null, title]
        );
      }

      for (const section of sections) {
        const {
          section_id,
          section_name,
          section_instructors,
          section_days,
          section_start_time,
          section_end_time,
          labs,
        } = section;

        // Check if the section already exists in the database
        const sectionExists = await doesSectionExist(
          course_prefix,
          course_code,
          section_id
        );

        if (!sectionExists) {
          // Insert section into the sections table
          await pool.query(
            "INSERT INTO sections (section_id, course_prefix, course_code, instructors, term, section_days, section_start_time, section_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [
              section_id,
              course_prefix,
              course_code,
              section_instructors.join(", "),
              null,
              section_days.join(", "),
              section_start_time,
              section_end_time,
            ]
          );
        }

        for (const lab of labs) {
          const { lab_id, lab_days, lab_start_time, lab_end_time, lab_type } =
            lab;

          // Insert lab into the labs table
          await pool.query(
            "INSERT INTO labs (lab_id, section_id, course_prefix, course_code, lab_name, lab_instructors, term, lab_days, lab_start_time, lab_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
            [
              lab_id,
              section_id,
              course_prefix,
              course_code,
              null,
              null,
              null,
              lab_days.join(", "),
              lab_start_time,
              lab_end_time,
            ]
          );
        }
      }
    }
    console.log("Data hydrated successfully!".green);
  } catch (err) {
    console.error(err.message);
  }
}

// Call the function to start hydrating the database
hydrateDatabase();
