/**
 * @typedef {ScheduleNode[]} schedule
 */

const allCourses = require("../scraper/umd.static.db.json").courses;
const ScheduleNode = require("./scheduleNode");
const { daysOfWeek } = require("../scraper/utilities");
require("colors");

// for demo purposes
const courses = [
  allCourses[4],
  allCourses[90],
  allCourses[55],
  allCourses[150],
  allCourses[186],
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
 * @returns {string} a 24 hour format for the time
 */
function convertTo24Hour(timeStr) {
  var hours = Number(timeStr.match(/^(\d+)/)[1]); // get the hour part
  var minutes = Number(timeStr.match(/:(\d+)/)[1]); // get the part after the colon
  var AMPM = timeStr.match(/:(\d+)\s*(.*)$/)[2]; // get the modifier (am or pm)
  if (AMPM.toLowerCase() == "pm" && hours < 12) hours = hours + 12;
  if (AMPM.toLowerCase() == "am" && hours == 12) hours = hours - 12;
  var sHours = hours.toString();
  var sMinutes = minutes.toString();
  if (hours < 10) sHours = "0" + sHours;
  if (minutes < 10) sMinutes = "0" + sMinutes;
  return sHours + ":" + sMinutes;
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
                convertTo24Hour(section.section_start_time),
                convertTo24Hour(section.section_end_time),
                currCourse.course_prefix,
                currCourse.course_id,
                sectionIdx,
                false
              ),
            ],
            section.labs.map(
              (lab, labIdx) =>
                new ScheduleNode(
                  lab.lab_days,
                  convertTo24Hour(lab.lab_start_time),
                  convertTo24Hour(lab.lab_end_time),
                  currCourse.course_prefix,
                  currCourse.course_id,
                  labIdx,
                  true
                )
            )
          )
        : cartesianProduct([
            [
              new ScheduleNode(
                section.section_days,
                convertTo24Hour(section.section_start_time),
                convertTo24Hour(section.section_end_time),
                currCourse.course_prefix,
                currCourse.course_id,
                sectionIdx,
                false
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
 * finds all the possible schedules without conflict
 * @param {allCourses} courses - an array of courses to be scheduled
 * @returns {schedule[]} an array of conflict free schedule
 */
function generateSchedules(courses) {
  // remove duplicate courses O(n) time and space
  const courseSet = new Set();
  courses = courses.filter((course) => {
    const courseUniqueId = course.course_prefix + course.course_id;
    if (courseSet.has(courseUniqueId)) return false;
    courseSet.add(courseUniqueId);
    return true;
  });
  return generateSubSchedules(courses, 0, courses.length - 1);
}

getMaxScheduleSize = (courses) => {
  let expectedLength = 1;
  courses.forEach((course) => {
    expectedLength *= course.sections.reduce(
      (perm, section) => perm + Math.max(1, section.labs.length),
      0
    );
  });
  return expectedLength;
};


// courses.forEach(course => console.log(`${course.course_prefix} ${course.course_id}`))
// const start = Date.now()
// const schedules = generateSchedules(courses)
// const end = Date.now()

// for prettier logs
// schedules.forEach((res) => {
//   res.map((node) => console.log(node.toString())) + console.log("\n");
// });

// console.log(`Time taken: ${(end - start).toFixed(2)} ms`.yellow)
// console.log(`${generateSchedules(courses).length} of ${getMaxScheduleSize(courses)}`.green);

module.exports = {
  cartesianProduct,
  convertTo24Hour,
  generateSchedules,
  compareFunction,
  hasConflict,
  merge,
  generateSubSchedules,
  getMaxScheduleSize
};