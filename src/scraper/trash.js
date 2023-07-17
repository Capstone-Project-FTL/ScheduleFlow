const {daysOfWeek} = require("./utilities")
const umdDaysOfWeek = {
    "M": daysOfWeek.Monday,
    "Tu":daysOfWeek.Tuesday,
    "W": daysOfWeek.Wednesday,
    "Th":daysOfWeek.Thursday,
    "F":daysOfWeek.Friday,
}

Object.keys(umdDaysOfWeek).map(day => "MTuF".indexOf(day) >= 0 ? umdDaysOfWeek[day]: null).filter(day => day)