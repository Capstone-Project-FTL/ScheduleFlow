const allCourses = require("../scraper/umd.static.db.json").courses;
const ScheduleNode = require("./scheduleNode");
require("colors")

const courses = [allCourses[0], allCourses[15], allCourses[105]];
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
  return generateSubSchedules(courses, 0, courses.length - 1);
  // return generateSubSchedules(courses, 0, 0);
}

function hasConflict(schedule){
  console.log(schedule)
}

function merge(scheduleA, scheduleB) {
  // console.log(scheduleA.map(s => s.map( e => e.toString())))
  // console.log(scheduleB.map(s => s.map( e => e.toString())))
  if (
    scheduleA.length === 0 ||
    scheduleB.length === 0
  )
    return [];
    const mergedSchedules = []
  for(let anASchedule of scheduleA){
    for(let aBSchedule of scheduleB){
      // console.log(anASchedule.toString().blue)
      // console.log(aBSchedule.toString())
      const newSchedule = [...anASchedule, ...aBSchedule]
      if(!hasConflict(newSchedule)) mergedSchedules.push(newSchedule)
    }
  }
  return mergedSchedules
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

console.log(generateSchedules(courses));
