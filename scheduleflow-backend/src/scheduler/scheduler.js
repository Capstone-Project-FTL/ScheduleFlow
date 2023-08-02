const { getProfessors } = require("./utilities/rmp");

/**
 * @typedef {ScheduleNode[]} schedule
 * @typedef {Object} scheduleFlow
 * @property {schedule} schedule a conflict free schedule
 * @property {number|null} scheduleRating the rating for the schedule 
    [gotten from the average of all professors in the schedule]
 */

// for every date method, use the UTC version even at the front end
// use the UTC to parse into date

const allCourses = require("../scraper/umd.static.db.json").courses;
const ScheduleNode = require("./scheduleNode");
const { daysOfWeek } = require("../scraper/utilities");
require("../../capstone-api/node_modules/colors");

// for demo purposes
const courses = [
  allCourses[4],
  allCourses[95],
  allCourses[132],
  // allCourses[150],
  // allCourses[186],
];

/**
 * Sorting the courses based on length of schedules reduces unnecessary computations
 * by generating schedules in small chuncks, if a subschedule has a conflict,
 * there will be no need generating subsequent larger subschedules
 */
courses.sort((course1, course2) => {
  return course1.sections.length - course2.sections.length;
});

/**
 * @type {ScheduleNode} - represents each node during scheduling
 * @param  {...ScheduleNode} scheduleNodes - an array of schedule nodes
 * @returns {Array} the cartesian product of its arguments flattened
 * @example
 * cartesian([1, 2], [3, 4]) = [[1,3],[1,4],[2,3],[2,4]]
 */
// special thanks to rsp for the one liner https://stackoverflow.com/a/43053803
// i don't understand what is going on, but hey, it works
const cartesianProduct = (...scheduleNodes) =>
  scheduleNodes.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

/**
 * @param {string} timeStr the string representation for a given time
 * @returns {Date} a 24 hour UTC date object
 * without the modifier, extractDate attempts to parse the timeStr
 */
function extractDate(timeStr) {
  let hours = Number(timeStr.match(/^(\d+)/)[1]); // get the hour part
  let minutes = Number(timeStr.match(/:(\d+)/)[1]); // get the part after the colon
  let AMPM = timeStr.match(/:(\d+)\s*(.*)$/)[2]; // get the modifier (am or pm)
  if (AMPM.toLowerCase() == "pm" && hours < 12) hours = hours + 12;
  if (AMPM.toLowerCase() == "am" && hours == 12) hours = hours - 12;
  return new Date(Date.UTC(70, 0, 1, hours, minutes, 0, 0));
}

/**
 * compares the start and end times of the nodes.
 * if two nodes have the same start time, they are compared using thier end time
 * @param {ScheduleNode} node1 - node for comparison
 * @param {ScheduleNode} node2 - node for comparison
 * @returns {number} -1 if the first node starts or ends before the second,
    1 if the first node starts or ends before the second,
    0 otherwise
 */
function compareFunction(node1, node2) {
  const start1 = node1.startTime;
  const start2 = node2.startTime;
  if (start1 < start2) return -1;
  if (start1 > start2) return 1;
  // the starttimes are equal, move to end times
  const end1 = node1.endTime;
  const end2 = node2.endTime;
  if (end1 < end2) return -1;
  if (end1 > end2) return 1;
  return 0;
}

/**
 *
 * @param {schedule} schedule - the schedule to evaluate
 * @returns {boolean} true if there is a time conflict in the schedule
 */
function hasConflict(schedule) {
  const days = Object.values(daysOfWeek);
  for (let day of days) {
    const dailySchedule = schedule.filter((scheduleNode) =>
      scheduleNode.days.has(day)
    );
    dailySchedule.sort(compareFunction);
    if (
      dailySchedule.some((currCourse, i, arr) => {
        if (i === 0) return false;
        return arr[i - 1].endTime >= currCourse.startTime;
      })
    )
      return true;
  }
  return false;
}

/**
 * combines each subschedule into one larger schedule
 * @param {schedule[]} scheduleA - first schedule to merge
 * @param {schedule[]} scheduleB - second schedule to merge
 * @returns {schedule[]} a ne wschedule where each subschedule has been merged
 */
function merge(scheduleA, scheduleB) {
  if (scheduleA.length === 0 || scheduleB.length === 0) return [];
  const mergedSchedules = [];
  for (let anASchedule of scheduleA) {
    for (let aBSchedule of scheduleB) {
      const newSchedule = [...anASchedule, ...aBSchedule];
      if (!hasConflict(newSchedule)) {
        mergedSchedules.push(newSchedule);
      }
    }
  }
  return mergedSchedules;
}

/**
 *
 * @param {allCourses} courses - a list of courses for which to generate schedules
 * @param {number} left - the location of the left index in courses
 * @param {number} right - the location of the right index in courses
 * @returns {schedule[]} an array of conflict free schedules
 * if no schedules, we would receive an empty array
 */
function generateSubSchedules(courses, left, right) {
  if (left > right) return [];
  if (left === right) {
    const currCourse = courses[left];
    return currCourse.sections.flatMap((section, sectionIdx) =>
      section.labs.length > 0
        ? cartesianProduct(
            [
              new ScheduleNode(
                section.section_days,
                extractDate(section.section_start_time),
                extractDate(section.section_end_time),
                currCourse.course_prefix,
                currCourse.course_code,
                sectionIdx,
                false,
                section.section_instructor.map((instructor) => ({
                  name: instructor,
                  rating: null,
                }))
              ),
            ],
            section.labs.map(
              (lab, labIdx) =>
                new ScheduleNode(
                  lab.lab_days,
                  extractDate(lab.lab_start_time),
                  extractDate(lab.lab_end_time),
                  currCourse.course_prefix,
                  currCourse.course_code,
                  labIdx,
                  true
                )
            )
          )
        : cartesianProduct([
            [
              new ScheduleNode(
                section.section_days,
                extractDate(section.section_start_time),
                extractDate(section.section_end_time),
                currCourse.course_prefix,
                currCourse.course_code,
                sectionIdx,
                false,
                // from the database, the instructors are stored as their string names
                // change that to the instructor type
                section.section_instructor.map((instructor) => ({
                  name: instructor,
                  rating: null,
                }))
              ),
            ],
          ])
    );
  }
  let mid = left + Math.floor((right - left) / 2);
  const subScheduleA = generateSubSchedules(courses, left, mid);
  const subScheduleB = generateSubSchedules(courses, mid + 1, right);
  return merge(subScheduleA, subScheduleB);
}

/**
 *
 * @param {schedule[]} schedules
 * @returns {Set<string>} a set of all professors accumulated from all the schedule
 */
function getAllProfessorsName(schedules) {
  const professors = new Set();
  schedules.forEach((schedule) => {
    schedule.forEach((node) => {
      node.instructors.forEach((instructor) => {
        professors.add(instructor.name);
      });
    });
  });
  return professors;
}
/**
 * finds all the possible schedules without conflict
 * @param {allCourses} courses - an array of courses to be scheduled
 * @returns {schedule[]} an array of conflict free schedule
 */
function generateSchedules(courses) {
  // remove duplicate courses O(n) time and space
  const courseSet = new Set();
  courses = courses.filter((course) => {
    const courseUniqueId = course.course_prefix + course.course_code;
    if (courseSet.has(courseUniqueId)) return false;
    courseSet.add(courseUniqueId);
    return true;
  });
  return generateSubSchedules(courses, 0, courses.length - 1);
}

/**
 * 
 * @param {scheduleFlow} scheduleFlowA 
 * @param {scheduleFlow} scheduleFlowB 
 */
function rankingFunction(scheduleFlowA, scheduleFlowB){
  let ratingOfA = scheduleFlowA.scheduleRating
  let ratingOfB = scheduleFlowB.scheduleRating
  // all ratings with N/A should be handled last
  if(ratingOfA === "N/A") ratingOfA = -1
  if(ratingOfB === "N/A") ratingOfB = -1
  if(ratingOfA < ratingOfB) return 1
  if(ratingOfA > ratingOfB) return -1
  return 0
}

/**
 * 
 * @param {courses} courses
 * @returns {scheduleFlow[]} an array of schedule flows sorted based on their rank
 */
async function generateScheduleFlows(courses){
  const schedules = generateSchedules(courses)
  for(let schedule of schedules){
    for(let node of schedule){
      node.days = [...node.days]
    }
  }
  const professors = await getProfessors(
    "University of Maryland",
    getAllProfessorsName(schedules)
  );
  const professorRatingMap = {} // for fast lookup
  for(let professor of professors){
    professorRatingMap[professor.name] = professor.rating
  }

  const scheduleFlows = [] // store all the conflict free schedules
  for(let schedule of schedules){
    const currentScheduleFlow = {schedule: schedule}
    let totalRating = 0
    let count = 0
    for(let node of schedule){
      for(let instructor of node.instructors){
        instructor.rating = professorRatingMap[instructor.name]
        if(instructor.rating){
          totalRating += instructor.rating
          count += 1
        }
      }
    }
    currentScheduleFlow.scheduleRating =  (count === 0) ? "N/A" : (totalRating/count).toFixed(2)
    scheduleFlows.push(currentScheduleFlow)
  }
  const finalScheduleFlows = scheduleFlows.sort(rankingFunction).slice(0, 100)
  let i = 100
  while(i < finalScheduleFlows.length){
    if(scheduleFlows[i] === finalScheduleFlows[i - 1]) finalScheduleFlows.push(scheduleFlows[i])
    i += 1
  }
  return finalScheduleFlows;
}

function getMaxScheduleSize(courses){
  let expectedLength = 1;
  courses.forEach((course) => {
    expectedLength *= course.sections.reduce(
      (perm, section) => perm + Math.max(1, section.labs.length),
      0
    );
  });
  return expectedLength;
};

if (require.main === module) {
    courses.forEach((course) =>
      console.log(`${course.course_prefix} ${course.course_code}`)
    );
    const start = performance.now();
    const schedules = generateSchedules(courses);
    const end = performance.now();
    
    (async function(){
      const scheduleFlows = await generateScheduleFlows(courses)
      // for prettier logs
      scheduleFlows.forEach((scheduleFlow) => {
        console.log(scheduleFlow.scheduleRating.green)
        scheduleFlow.schedule.forEach((node) => console.log(node.toString())) + console.log("\n");
      });
      console.log(`${schedules.length} of ${getMaxScheduleSize(courses)}`.green);
      console.log(`Time taken for scheduling only: ${(end - start).toFixed(2)} ms`.yellow);
      console.log(`final schedule has ${scheduleFlows.length} schedules`.blue)
    })();

  }

module.exports = {
  cartesianProduct,
  extractDate,
  generateSchedules,
  compareFunction,
  hasConflict,
  merge,
  generateSubSchedules,
  getMaxScheduleSize,
  generateScheduleFlows
};
