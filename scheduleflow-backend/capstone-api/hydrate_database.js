const pool = require("./database");
// const db = pgp(process.env.DATABASE_URL);
require("colors")

const allCourses = require("../adapter/scraper/umd.static.db.json");
// Sample JSON data
const jsonData = allCourses;

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
    // Asynchronously execute the SQL file that creates the database and tables
    // await pool.query(`
    //   CREATE TABLE courses (
    //     course_prefix VARCHAR(255) NOT NULL,
    //     course_code VARCHAR(20) NOT NULL,
    //     term VARCHAR(50),
    //     course_description VARCHAR(255),
    //     CONSTRAINT course_id PRIMARY KEY (course_prefix, course_code)
    //   );
    // `);
    // await pool.query(`
    //   CREATE TABLE sections (
    //     section_id VARCHAR(50) NOT NULL,
    //     course_prefix VARCHAR(255) NOT NULL,
    //     course_code VARCHAR(20) NOT NULL,
    //     instructors TEXT,
    //     term VARCHAR(50),
    //     section_days VARCHAR(50),
    //     section_start_time VARCHAR(100),
    //     section_end_time VARCHAR(100),
    //     FOREIGN KEY (course_prefix, course_code) REFERENCES courses (course_prefix, course_code),
    //     CONSTRAINT section_key PRIMARY KEY (course_prefix, course_code, section_id)
    //   );
    // `);
    // await pool.query(`
    //   CREATE TABLE labs (
    //     lab_id VARCHAR(50) NOT NULL,
    //     section_id VARCHAR(50) NOT NULL,
    //     course_prefix VARCHAR(255) NOT NULL,
    //     course_code VARCHAR(20) NOT NULL,
    //     lab_name VARCHAR(50),
    //     lab_instructors VARCHAR(100),
    //     term VARCHAR(50),
    //     lab_days VARCHAR(50),
    //     lab_start_time VARCHAR(100),
    //     lab_end_time VARCHAR(100),
    //     FOREIGN KEY (course_prefix, course_code, section_id) REFERENCES sections (course_prefix, course_code, section_id)
    //   );
    // `);

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
