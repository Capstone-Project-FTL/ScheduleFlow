/*
[
  [ 's1', 'l1', 't1', 'm1' ],
  [ 's1', 'l1', 't1', 'm2' ],
  [ 's1', 'l2', 't1', 'm1' ],
  [ 's1', 'l2', 't1', 'm2' ]
]
*/
const cartesian = (...scheduleNode) =>
  scheduleNode.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

// console.log(
//   cartesian(
//     [
//       ["s1", "l1"],
//       ["s1", "l2"],
//     ],
//     [
//       ["t1", "m1"],
//       ["t1", "m2"],
//     ]
//   )
// );

// // /**
// //  * 
// //  * @param {String} timeStr the string representation for a given time
// //  * @returns a 24 hour format for the time
// //  */
// // function extractDate(timeStr) {
// //   var hours = Number(timeStr.match(/^(\d+)/)[1]); // get the hour part
// //   var minutes = Number(timeStr.match(/:(\d+)/)[1]); // get the part after the colon
// //   var AMPM = timeStr.match(/:(\d+)\s*(.*)$/)[2]; // get the modifier (am or pm)
// //   if (AMPM.toLowerCase() == "pm" && hours < 12) hours = hours + 12;
// //   if (AMPM.toLowerCase() == "am" && hours == 12) hours = hours - 12;
// //   var sHours = hours.toString();
// //   var sMinutes = minutes.toString();
// //   if (hours < 10) sHours = "0" + sHours;
// //   if (minutes < 10) sMinutes = "0" + sMinutes;
// //   return sHours + ":" + sMinutes;
// // }

// // console.log(extractDate("12:59 pm"));

// a = []
// if(a.length) console.log("o")
// else console.log("hel")



// console.log(// console.log(_.isEqual("12:59", "12:00"))
// cartesian([[1]]))

let a = {name: "jiexy"}
let b = {school: "Umass"}
console.log("N/A" < 0)

`
4.37
Section: COMM 398E Tue,Thu (11:00 - 12:15) by Xiaoli Nan(4.1) 
Section: DATA 400 Mon,Wed,Fri (12:00 - 12:50) by Jonathan Fernandes(4.1) 
Lab: DATA 400 Tue (15:00 - 15:50)  
Section: CMSC 131 Mon,Wed,Fri (15:00 - 15:50) by Nelson Padua-Perez(4.9) 
Lab: CMSC 131 Mon,Wed (14:00 - 14:50)  `

`
4.37
Section: COMM 398E Tue,Thu (11:00 - 12:15) by Xiaoli Nan(4.1) 
Section: DATA 400 Mon,Wed,Fri (12:00 - 12:50) by Jonathan Fernandes(4.1) 
Lab: DATA 400 Tue (15:00 - 15:50)  
Section: CMSC 131 Mon,Wed,Fri (15:00 - 15:50) by Nelson Padua-Perez(4.9) 
Lab: CMSC 131 Mon,Wed (14:00 - 14:50)  `

const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:postgres@localhost:5432/capstone");
require("colors")

const allCourses = require("../adapter/scraper/umd.static.db.json");
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
          await db.none(
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
          await db.none(
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
  } catch (error) {
    console.error("Error:", error);
  } finally {
    pgp.end();
  }
}

// Call the function to start hydrating the database
hydrateDatabase();