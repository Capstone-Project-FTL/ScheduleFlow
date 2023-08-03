
const pool = require('.././database')
// const db = pgp(process.env.DATABASE_URL);

// Function to fetch data and reconstruct JSON objects
async function fetchCoursesData(coursesArray) {
  try {
    const coursesData = [];

    for (const course of coursesArray) {
      const { course_prefix, course_code } = course;

      //TODO: Simplify
      const courses = await pool.query(
        "SELECT * FROM courses LEFT JOIN sections ON courses.course_prefix = sections.course_prefix AND courses.course_code = sections.course_code WHERE courses.course_prefix = $1 AND courses.course_code = $2",
        [course_prefix, course_code]
      );

      const courseObject = {
        course_prefix,
        course_code,
        course_description : courses.course_description,
        sections: [],
      };

      for (const row of courses) {
        const {
          section_id,
          instructors,
          section_days,
          section_start_time,
          section_end_time,
        } = row;

        const section = {
          section_id,
          section_instructors: instructors.split(", "),
          section_days: section_days ? section_days.split(", ") : [],
          section_start_time: section_start_time,
          section_end_time: section_end_time,
          labs: [],
        };

        courseObject.sections.push(section);
      }

      // Fetch labs for the course using a subquery
      const labs = await pool.query(
        "SELECT * FROM labs WHERE course_prefix = $1 AND course_code = $2",
        [course_prefix, course_code]
      );

      for (const lab of labs) {
        const { 
          section_id, 
          lab_id, 
          lab_days, 
          lab_start_time, 
          lab_end_time 
        } = lab;

        const labObject = {
          lab_id,
          lab_days: lab_days ? lab_days.split(", ") : [],
          lab_start_time: lab_start_time,
          lab_end_time: lab_end_time,
          lab_type: "Discussion", // Currently, this field is static,
                                  // but could be passed if a respective
                                  // column was added to the labs data table
        };

        // Find the section with the matching section_id and add the lab to it
        const sectionIndex = courseObject.sections.findIndex(
          (section) => section.section_id === section_id
        );

        if (sectionIndex !== -1) {
          courseObject.sections[sectionIndex].labs.push(labObject);
        }
      }
      coursesData.push(courseObject);
    }

    return coursesData;
  } catch (err) {
    console.error(err.message);
  }
}

// Sample array of course_prefix and course_code
const coursesArray = [
  { course_prefix: "CMSC", course_code: "100" },
  { course_prefix: "CMSC", course_code: "106" },
];

// Call the function to fetch data and reconstruct JSON objects
fetchCoursesData(coursesArray)
  .then((coursesData) => {
    const jsonData = {
      courses: coursesData,
    };
  })
  .catch((err) => {
    console.error(err.message);
  });

module.exports = fetchCoursesData;
