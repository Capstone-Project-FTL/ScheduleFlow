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



console.log(// console.log(_.isEqual("12:59", "12:00"))
cartesian([[1]]))