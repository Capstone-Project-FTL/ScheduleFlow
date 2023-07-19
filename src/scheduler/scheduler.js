const allCourses = require("../scraper/umd.static.db.json").courses;
const ScheduleNode = require("./scheduleNode");
const { daysOfWeek } = require("../scraper/utilities");
require("colors");

const courses = [allCourses[0], allCourses[50], allCourses[100], allCourses[150], allCourses[106]];

// sort courses based on number of number of sections
// this would help to remove unneccesary computations
courses.sort((course1, course2) => {
  return course1.sections.length - course2.sections.length;
});

// special thanks to rsp for the one liner
// https://stackoverflow.com/a/43053803
// i don't understand what is going on, but hey, it works
const cartesianProduct = (...scheduleNodes) =>
  scheduleNodes.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

/**
 *
 * @param {String} timeStr the string representation for a given time
 * @returns a 24 hour format for the time
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
  // return generateSubSchedules(courses, 0, 0);
}

function compareFunction(node1, node2) {
  const start1 = node1.startTime;
  const start2 = node2.startTime;
  if (start1 < start2) return -1;
  if (start1 > start2) return 1;
  // the starttimes are equal, move to e nd times
  const end1 = node1.endTime;
  const end2 = node2.endTime;
  if (end1 < end2) return -1;
  if (end1 > end2) return 1;
  return 0;
}

// fucntion overlap

function hasConflict(schedule) {
  // console.log(schedule)
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
  // console.log(schedule)
  // console.log("\n")
  return false;
}

function merge(scheduleA, scheduleB) {
  // console.log(scheduleA.map(s => s.map( e => e.toString())))
  // console.log(scheduleB.map(s => s.map( e => e.toString())))
  if (scheduleA.length === 0 || scheduleB.length === 0) return [];
  const mergedSchedules = [];
  for (let anASchedule of scheduleA) {
    for (let aBSchedule of scheduleB) {
      // console.log(anASchedule.toString().blue)
      // console.log(aBSchedule.toString())
      const newSchedule = [...anASchedule, ...aBSchedule];
      if (!hasConflict(newSchedule)) {
        mergedSchedules.push(newSchedule);
      }
    }
  }
  return mergedSchedules;
}

function generateSubSchedules(courses, left, right) {
  if (left > right) return [[]];
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

generateSchedules(courses).forEach(res => {res.map( node => console.log(node.toString())) + console.log("\n")})
// console.log(generateSchedules(courses).map((s) => s.toString()));
console.log(generateSchedules(courses).length);
