const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:postgres@localhost:5432/capstone");

const allCourses = require("../src/scraper/umd.static.db.json");

// Sample JSON data
const jsonData = allCourses;

// Function to check if a course already exists
async function doesCourseExist(course_prefix, course_code) {
  const course = await db.oneOrNone(
    "SELECT * FROM courses WHERE course_prefix = $1 AND course_code = $2",
    [course_prefix, course_code]
  );
  return course !== null;
}

// Function to check if a section already exists
async function doesSectionExist(course_prefix, course_code, section_id) {
  const section = await db.oneOrNone(
    "SELECT * FROM sections WHERE course_prefix = $1 AND course_code = $2 AND section_id = $3",
    [course_prefix, course_code, section_id]
  );
  return section !== null;
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
        await db.none(
          "INSERT INTO courses (course_prefix, course_code, term, course_description) VALUES ($1, $2, $3, $4)",
          [course_prefix, course_code, null, title]
        );
      }

      for (const section of sections) {
        const {
          section_id,
          section_name,
          section_instructor,
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
          await db.none(
            "INSERT INTO sections (section_id, course_prefix, course_code, instructor, term, section_days, section_start_time, section_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [
              section_id,
              course_prefix,
              course_code,
              section_instructor[0],
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
          await db.none(
            "INSERT INTO labs (lab_id, section_id, course_prefix, course_code, lab_name, lab_instructor, term, lab_days, lab_start_time, lab_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
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
    console.log("Data hydrated successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    pgp.end();
  }
}

// Call the function to start hydrating the database
hydrateDatabase();
