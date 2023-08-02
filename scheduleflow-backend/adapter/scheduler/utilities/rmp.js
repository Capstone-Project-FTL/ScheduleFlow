const rmp = require("@mtucourses/rate-my-professors").default;
require("colors");
/**
 * @typedef school an interpolation of ISchoolFromSearch (the default returned by the library)
 * @property {number} id the school id on rateMyProfessor
 * @property {string} name the name of the school
 * @property {string} state the two letter representation of the state
 * @property {string} city the name of the city the school is located in
 *
 * @typedef professor
 * @property {string} name the professor's name
 * @property {number|null} rating the rating of the professor
 */

/**
 *
 * @param {string} professorName
 * @param {school} school
 * @returns {Promise<professor>}
 */
async function getProfessor(professorName, school) {
  const professors = await rmp.searchTeacher(professorName, school.id);

  const professor = professors[0];
  const profNameLower = professorName.toLowerCase();
  if (
    profNameLower.includes(professor?.firstName.toLowerCase()) &&
    profNameLower.includes(professor?.lastName.toLowerCase())
  ) {
    const rmpProfessor = await rmp.getTeacher(professors[0].id);
    // if the rating is 0, return null as the rating
    return { name: professorName, rating: rmpProfessor.avgRating? rmpProfessor.avgRating: null };
  }
  console.warn(`${professorName} not found`.yellow);
  return Promise.resolve({ name: professorName, rating: null });
}

/**
 *
 * @param {string} schoolName the name of the scholl to search for professors
 * @param {string[]|Set<string>} professorNames an array of professor names
 * @returns {Promise<professor[]>}
 */
async function getProfessors(schoolName, professorNames) {
  schools = await rmp.searchSchool(schoolName);
  if (schools.length === 0) {
    console.warn(`${schoolName} not found`.yellow);
    return [];
  }

  // we found the given school
  const professorPromises = Array.from(professorNames).map((name) =>
    getProfessor(name, schools[0])
  );

  return Promise.all(professorPromises)
}

if (require.main === module)
  getProfessors("University of Maryland", [
    "Nelson Padua-Perez",
    "Pedram Sadeghian",
    "Lisa Mar",
    "Lindsey Anderson",
    "Kimberli Munoz",
    "Todd Rowland",
    "Behtash Babadi",
    "Erin Molloy",
  ]).then(console.log);

module.exports = { getProfessors };
