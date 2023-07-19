class ScheduleNode{

    /**
     * 
     * @param {[String]} days the days for the node
     * @param {String} startTime the start time in 24 hour format
     * @param {String} endTime the end time in 24 hour format
     * @param {String} coursePrefix course prefix
     * @param {String} courseId course id
     * @param {number} nodeIndex the index of the node in the actual course
     * @param {Boolean} isLab [default: false] indicates if it is a lab, if not then it is a section
     * @returns {ScheduleNode}
     */
    constructor(days, startTime, endTime, coursePrefix, courseId, nodeIndex, isLab = false){
        this.days = new Set(days)
        this.startTime = startTime
        this.endTime = endTime
        this.coursePrefix = coursePrefix
        this.courseId = courseId
        this.nodeIndex = nodeIndex
        this.isLab = isLab
    }

    toString(){
        return `${this.isLab ? "Lab" : "Section"}: ${this.coursePrefix} ${this.courseId} ${Array.from(this.days).toString()} (${this.startTime} - ${this.endTime})`
    }
}

module.exports = ScheduleNode