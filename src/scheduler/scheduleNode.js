/**
 * @class
 * @classdesc This class represents the nodes for each schedule.
    A node represents a single unit of instruction (sections or labs included).
    This class allows to unify the operations performed on both sections and labs
 */
class ScheduleNode {
  /**
   * @typedef {{name: string, rating: number|null}} instructor
   *
   * @param {string[]} days - the days for the node
   * @param {Date} startTime - the start time in 24 hour format
   * @param {Date} endTime - the end time in 24 hour format
   * @param {string} coursePrefix - course prefix
   * @param {string} courseId - course id
   * @param {number} nodeIndex - the index of the node in the actual course
   * @param {boolean} [isLab=false] - indicates if it is a lab, if not then it is a section
   * @param {instructor[]} [instructors=[]] an array of the instructors for each node. Labs do not have one
   */
  constructor(
    days,
    startTime,
    endTime,
    coursePrefix,
    courseId,
    nodeIndex,
    isLab = false,
    instructors = []
  ) {
    this.days = new Set(days);
    this.startTime = startTime;
    this.endTime = endTime;
    this.coursePrefix = coursePrefix;
    this.courseId = courseId;
    this.nodeIndex = nodeIndex;
    this.isLab = isLab;
    this.instructors = instructors;
  }

  toString() {
    const startTimeStr = `${String(this.startTime.getUTCHours()).padStart(
      2,
      "0"
    )}:${String(this.startTime.getUTCMinutes()).padStart(2, "0")}`;
    const endTimeStr = `${String(this.endTime.getUTCHours()).padStart(
      2,
      "0"
    )}:${String(this.endTime.getUTCMinutes()).padStart(2, "0")}`;
    const instructorsStr =
      this.instructors.length === 0
        ? ""
        : this.instructors.reduce(
            (currStr, instructor, i) =>
              i === 0 ? currStr + instructor.name + `(${instructor.rating})` : currStr + ", " + instructor.name + `(${instructor.rating})`,
            "by "
          );

    return `${this.isLab ? "Lab" : "Section"}: ${this.coursePrefix} ${
      this.courseId
    } ${Array.from(
      this.days
    ).toString()} (${startTimeStr} - ${endTimeStr}) ${instructorsStr} `;
  }
}

module.exports = ScheduleNode;
