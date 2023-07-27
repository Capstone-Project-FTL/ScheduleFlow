const { daysOfWeek } = require("../scraper/utilities");
const ScheduleNode = require("./scheduleNode");
const {
  cartesianProduct,
  extractDate,
  compareFunction,
  hasConflict,
  merge,
  generateSubSchedules,
  generateSchedules,
  getMaxScheduleSize,
} = require("./scheduler");
const allCourses = require("../scraper/umd.static.db.json");

describe("cartesianProduct has correct functionality", () => {
  test("cartesianProduct works for an empty array", () => {
    expect(cartesianProduct([])).toEqual([]);
  });

  test("cartesianProduct for single array returns single array with same element", () => {
    expect(cartesianProduct([1])).toEqual([1]);
  });

  test("cartesianProduct works correctly", () => {
    const result = cartesianProduct([1, 2], [3, 4]);
    expect(result).toHaveLength(4);
    expect(result).toEqual([
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
    ]);
  });

  test("cartesianProduct returns flattened result when one argument is a 2D array", () => {
    const sections = ["s1", "s2"];
    const labs = [
      ["l1", "l2"],
      ["t1", "t2"],
    ];
    const result = cartesianProduct(sections, labs);
    expect(result).toHaveLength(4);
    expect(result.every((row) => row.length === 3)).toBe(true);
  });

  test("cartesianProduct works for nested arrays", () => {
    const sections = [["s1", "s2"]];
    const labs = [["l1", "l2"]];
    const result = cartesianProduct(sections, labs);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(["s1", "s2", "l1", "l2"]);
  });
});

describe("extractDateconverts AM/PM time string format into 24 hour string format", () => {
  test("extractDate has basic functionality", () => {
    const nodeDate = extractDate("1:32pm")
    expect(nodeDate.getHours()).toEqual(13);
    expect(nodeDate.getMinutes()).toEqual(32);
  });

  test("extractDate works when time and modifier are spaced", () => {
    const nodeDate = extractDate("1:00 pm")
    expect(nodeDate.getHours()).toEqual(13);
    expect(nodeDate.getMinutes()).toEqual(0);
  });

  test("extractDate works when time has modifier and leading 0", () => {
    const nodeDate = extractDate("01:00 pm")
    expect(nodeDate.getHours()).toEqual(13);
    expect(nodeDate.getMinutes()).toEqual(0);
    expect(nodeDate.getSeconds()).toEqual(0);
  });

  test("extractDate works for midnight", () => {
    const nodeDate = extractDate("12:00am")
    expect(nodeDate.getHours()).toEqual(0);
    expect(nodeDate.getMinutes()).toEqual(0);
    expect(nodeDate.getSeconds()).toEqual(0);
  });

  test("extractDate works for times before mid day", () => {
    const nodeDate = extractDate("3:00 am")
    expect(nodeDate.getHours()).toEqual(3);
    expect(nodeDate.getMinutes()).toEqual(0);
    expect(nodeDate.getSeconds()).toEqual(0);
  });

  test("extractDate works for times after mid day", () => {
    const nodeDate = extractDate("3:00 pm")
    expect(nodeDate.getHours()).toEqual(15);
    expect(nodeDate.getMinutes()).toEqual(0);
    expect(nodeDate.getSeconds()).toEqual(0);
  });

  test("extractDate works on times without modifiers", () => {
    const nodeDate = extractDate("11:00")
    const nodeDate2 = extractDate("23:00")
    expect(nodeDate.getHours()).toEqual(11);
    expect(nodeDate.getMinutes()).toEqual(0);
    expect(nodeDate.getSeconds()).toEqual(0);

    expect(nodeDate2.getHours()).toEqual(23);
    expect(nodeDate2.getMinutes()).toEqual(0);
    expect(nodeDate2.getSeconds()).toEqual(0);
  })
});

describe("compareFunction function compares times correctly", () => {
  let node1, node2;
  const generateNodes = () => [
    new ScheduleNode([], new Date(), new Date(), "", "", 0),
    new ScheduleNode([], new Date(), new Date(), "", "", 0),
  ];
  beforeAll(() => {
    [node1, node2] = generateNodes();
  });
  // start and end times must all be in 24 hour format
  /**
   * there are five possible time combin ations involving two time intervals
   * let s1 and e1 be the start and end time for the first node respectively
   * let s2 and e2 be the start and end time for the second node respectively
   * CASE 1: s1 < s2 (node 1 starts before node two)
   * CASE 2: s1 > s2 (node 1 starts after node 2)
   * CASE 3: (s1 = s2) and e1 < e2 (node 1 and node 2 start at the same time but node one finishes first)
   * CASE 3: (s1 = s2) and e1 > e2 (node 1 and node 2 start at the same time but node two finishes first)
   * CASE 3: (s1 = s2) and e1 = e2 (node 1 and node 2 start and end at the same time)
   */
  test("compareFunction returns negative if first node starts before the second node", () => {
    node1.startTime = extractDate("07:00 AM")
    node1.endTime = extractDate("08:00 AM")
    node2.startTime = extractDate("07:01 AM")
    node2.endTime = extractDate("07:00 AM")
    expect(compareFunction(node1, node2)).toBeLessThan(0);
  });

  test("compareFunction returns positive if first node starts after the second node", () => {
    node1.startTime = extractDate("11:00 AM")
    node1.endTime = extractDate("08:00 AM")
    node2.startTime = extractDate("07:01 AM")
    node2.endTime = extractDate("08:00 AM")
    expect(compareFunction(node1, node2)).toBeGreaterThan(0);
  });

  test("compareFunction returns negative if both nodes start at the same time but first node ends before the second node", () => {
    node1.startTime = extractDate("07:00 AM")
    node1.endTime = extractDate("08:00 AM")
    node2.startTime = extractDate("07:00 AM")
    node2.endTime = extractDate("08:01 AM")
    expect(compareFunction(node1, node2)).toBeLessThan(0);
  });

  test("compareFunction returns positive if both nodes start at the same time but first node ends after the second node", () => {
    node1.startTime = extractDate("07:01 AM")
    node1.endTime = extractDate("12:00 PM")
    node2.startTime =extractDate("07:00 AM")
    node2.endTime = extractDate("08:01 AM")
    expect(compareFunction(node1, node2)).toBeGreaterThan(0);
  });

  test("compareFunction returns 0 if both nodes start and end at the same times", () => {
    node1.startTime = extractDate("07:00 PM")
    node1.endTime = extractDate("11:00 PM")
    node2.startTime =  extractDate("07:00 PM")
    node2.endTime = extractDate("11:00 PM")
    expect(compareFunction(node1, node2)).toBe(0);
  });
});

describe("hasConflict coorectly indicates if a schedule has conflicts", () => {
  const nodes = [];
  const length = 5;
  const init = (node, days, startTime, endTime) => {
    node.days = new Set(days);
    node.startTime = startTime;
    node.endTime = endTime;
  };

  beforeAll(() => {
    for (let i = 0; i < length; i++) {
      nodes.push(new ScheduleNode([], new Date(1970, 0, 1), new Date(1970, 0, 1), "", "", 0));
    }
  });

  test("hasConflict indicates that empty schedules do not have conflicts", () => {
    expect(hasConflict([])).toBe(false);
  });

  test("hasConflict returns false for schedule with only one node", () => {
    init(nodes[1], [daysOfWeek.Monday, daysOfWeek.Friday], extractDate("09:00 AM"), extractDate("10:00 AM"));
    expect(hasConflict([nodes[1]])).toBe(false);
  });

  test("hasConflict returns false for non overlapping schedules", () => {
    init(nodes[0], [daysOfWeek.Monday, daysOfWeek.Friday], extractDate("09:00"), extractDate("10:00"));
    init(nodes[1], [daysOfWeek.Tuesday, daysOfWeek.Thursday], extractDate("10:00 AM"), extractDate("10:50"));
    init(nodes[2], [daysOfWeek.Wednesday], extractDate("10:15"), extractDate("11:30"));
    init(
      nodes[3],
      [daysOfWeek.Monday, daysOfWeek.Wednesday, daysOfWeek.Friday],
      extractDate("14:00"),
      extractDate("15:00")
    );
    init(nodes[4], [daysOfWeek.Thursday], extractDate("11:00"), extractDate("12:00"));
    expect(hasConflict(nodes)).toBe(false);
  });

  test("hasConflict returns true for overlapping schedules", () => {
    init(nodes[0], [daysOfWeek.Monday, daysOfWeek.Friday], extractDate("09:00"), extractDate("10:00"));
    init(nodes[2], [daysOfWeek.Wednesday], extractDate("10:15"), extractDate("14:30"));
    init(
      nodes[3],
      [daysOfWeek.Monday, daysOfWeek.Wednesday, daysOfWeek.Friday],
      extractDate("14:00"),
      extractDate("15:00")
    );
    init(nodes[4], [daysOfWeek.Thursday], extractDate("11:00"), extractDate("12:00"));
    expect(hasConflict(nodes)).toBe(true);
  });

  test("hasConflict returns true for overlapping schedules (same days same times)", () => {
    init(
      nodes[3],
      [daysOfWeek.Monday, daysOfWeek.Wednesday, daysOfWeek.Friday],
      extractDate("14:00"),
      extractDate("15:00")
    );
    expect(hasConflict([nodes[3], nodes[3]])).toBe(true);
  });

  test("hasConflict returns false for non overlapping schedules (same days different times)", () => {
    init(
      nodes[0],
      [daysOfWeek.Monday, daysOfWeek.Wednesday, daysOfWeek.Friday],
      extractDate("14:00"),
      extractDate("15:00")
    );
    init(
      nodes[3],
      [daysOfWeek.Monday, daysOfWeek.Wednesday, daysOfWeek.Friday],
      extractDate("16:00"),
      extractDate("17:00")
    );
    expect(hasConflict([nodes[3], nodes[0]])).toBe(false);
  });

  test("hasConflict returns false for non overlapping schedules (different days same times)", () => {
    init(
      nodes[0],
      [daysOfWeek.Monday, daysOfWeek.Wednesday, daysOfWeek.Friday],
      extractDate("14:00"),
      extractDate("15:00")
    );
    init(nodes[3], [daysOfWeek.Thursday, daysOfWeek.Tuesday], extractDate("16:00"), extractDate("17:00"));
    expect(hasConflict([nodes[3], nodes[0]])).toBe(false);
  });

  test("hasConflict returns false overlapping boundaries", () => {
    init(nodes[0], [daysOfWeek.Monday, daysOfWeek.Wednesday], extractDate("14:00"), extractDate("15:00"));
    init(nodes[3], [daysOfWeek.Monday, daysOfWeek.Wednesday], extractDate("15:00"), extractDate("17:00"));
    expect(hasConflict([nodes[3], nodes[0]])).toBe(true);
  });

  test("hasConflict returns true for close butnon overlapping boundaries", () => {
    init(nodes[0], [daysOfWeek.Monday, daysOfWeek.Wednesday], extractDate("14:00"), extractDate("15:00"));
    init(nodes[3], [daysOfWeek.Monday, daysOfWeek.Wednesday], extractDate("15:01"), extractDate("17:00"));
    init(nodes[3], [daysOfWeek.Monday, daysOfWeek.Wednesday], extractDate("17:02"), extractDate("19:00"));
    expect(hasConflict([nodes[3], nodes[0]])).toBe(false);
  });
});

describe(
  "merge combines two schedules correctly" +
    " A SCHEDULE IS AN ARRAY OF NODES".yellow,
  () => {
    // merge takes two array of schedules and schedules are an array
    const nodes = [];
    const length = 7;
    const init = (node, days, startTime, endTime, isLab = false) => {
      node.days = new Set(days);
      node.startTime = startTime;
      node.endTime = endTime;
      this.isLab = isLab;
    };

    beforeAll(() => {
      for (let i = 0; i < length; i++) {
        nodes.push(new ScheduleNode([], new Date(1970, 0, 1), new Date(1970, 0, 1), "", "", 0));
      }
      init(
        nodes[0],
        [daysOfWeek.Monday, daysOfWeek.Wednesday, daysOfWeek.Friday],
        extractDate("14:00"),
        extractDate("15:00")
      );
      init(
        nodes[1],
        [daysOfWeek.Tuesday, daysOfWeek.Thursday],
        extractDate("14:00"),
        extractDate("15:00")
      );
      init(nodes[2], [daysOfWeek.Wednesday], extractDate("16:00"), extractDate("17:00"));
      init(
        nodes[3],
        [daysOfWeek.Monday, daysOfWeek.Thursday],
        extractDate("07:00"),
        extractDate("09:00")
      );
      init(nodes[4], [daysOfWeek.Thursday], extractDate("14:00"), extractDate("15:00"));
      init(
        nodes[5],
        [daysOfWeek.Thursday, daysOfWeek.Friday],
        extractDate("07:00"),
        extractDate("08:50"),
        true
      );
      init(
        nodes[6],
        [daysOfWeek.Thursday, daysOfWeek.Wednesday, daysOfWeek.Thursday],
        extractDate("00:00"),
        extractDate("23:59"),
        true
      );
    });

    test("merge returns empty schedule array if either schdeule array is empty", () => {
      expect(
        merge(
          [],
          [
            new ScheduleNode(
              [daysOfWeek.Monday],
              extractDate("09:00"),
              extractDate("09:50"),
              "CMSC",
              "100",
              0
            ),
          ]
        )
      ).toHaveLength(0);
      expect(
        merge(
          [
            new ScheduleNode(
              [daysOfWeek.Monday],
              extractDate("09:00"),
              extractDate("09:50"),
              "CMSC",
              "100",
              0
            ),
          ],
          []
        )
      ).toHaveLength(0);
    });

    test("merge returns empty schedule if both are empty", () => {
      expect(merge([], [])).toEqual([]);
    });

    test("merge returns correct value for one schedule arguments (one to one) conflict free", () => {
      const mergedResult = merge([[nodes[1]]], [[nodes[2]]]);
      expect(mergedResult).toHaveLength(1);
      expect(Array.isArray(mergedResult[0])).toBe(true);
    });

    test("merge returns correct value for multiple schedule arguments (many to many) conflict free", () => {
      const mergedResult = merge(
        [[nodes[1]], [nodes[0]]],
        [[nodes[2]], [nodes[3]]]
      );
      expect(mergedResult).toHaveLength(4);
      mergedResult.forEach((schedule) => {
        expect(schedule).toHaveLength(2);
      });
    });

    test("merge returns correct value for multiple schedule arguments (many to one) conflict free", () => {
      const mergedResult = merge([[nodes[1], nodes[0]]], [[nodes[3]]]);
      expect(mergedResult).toHaveLength(1);
      mergedResult.forEach((schedule) => {
        expect(schedule).toHaveLength(3);
      });
    });

    test("merge returns empty array when there is conflict between all schedules", () => {
      const mergedResults = merge(
        [
          [nodes[0], nodes[1]],
          [nodes[2], nodes[3]],
        ],
        [
          [nodes[4], nodes[6]],
          [nodes[5], nodes[6]],
        ]
      );
      expect(mergedResults).toHaveLength(0);
    });

    test("merge returns empty array when there is conflict between some schedules", () => {
      const mergedResults = merge(
        [
          [nodes[0], nodes[2]],
          [nodes[0], nodes[1]],
        ],
        [
          [nodes[3], nodes[6]],
          [nodes[3], nodes[4]],
        ]
      );
      expect(mergedResults.length).toBeGreaterThan(0);
    });

    test("merge returns conflict free schedules", () => {
      const mergedResults = merge(
        [[nodes[0], nodes[1]], [nodes[5]]],
        [[nodes[3], nodes[2]]]
      );
      expect(mergedResults.length).toBeGreaterThan(0);
      mergedResults.forEach((schedule) => {
        // check that the schedule does not have conflicts
        /**
       * Algorithm used in testing:
         loop through every schedule. compare each node in a schedule with every other node
         if there is any overlap then the merge has failed
       */
        let nonConflicting = true;
        for (let node1 of schedule) {
          for (let node2 of schedule) {
            if (node1 === node2) continue;
            const commonDays = new Set(
              [...node1.days].filter((day) => node2.days.has(day))
            );
            if (commonDays.keys().length === 0) continue;
            nonConflicting =
              node2.endTime < node1.startTime ||
              node2.startTime > node1.endTime;
          }
        }
        expect(nonConflicting).toBe(true);
      });
    });

    test("merge catches slip (when the arguments themselves have conflicts)", () => {
      expect(merge([[nodes[1], nodes[4]]], [[nodes[0]]])).toEqual([]);
    });

    test("merge of two empty schedules should give an empty schedule", () => {
      expect(merge([[]], [[]])).toHaveLength(1);
      expect(merge([[]], [[]])[0]).toHaveLength(0);
    });

    test("merge with a full schedule and an empty schedule gives the full schedule", () => {
      const schedule = [nodes[0], nodes[1], nodes[2], nodes[3]];
      expect(merge([[]], [schedule])).toEqual([schedule]);
    });
  }
);

describe("generateSubSchedules works correctly", () => {
  let bio, compsci, comm, data;
  beforeAll(() => {
    bio = {
      course_prefix: "BIOL",
      course_code: "721",
      title: "Mathematical Population Biology",
      credits: "3",
      sections: [
        {
          section_id: "0101",
          section_instructor: ["Abba Gumel"],
          section_days: ["Tue", "Thu"],
          section_start_time: "9:30am",
          section_end_time: "10:45am",
          labs: [],
        },
      ],
    };

    compsci = {
      course_prefix: "CMSC",
      course_code: "106",
      title: "Introduction to C Programming",
      credits: "4",
      sections: [
        {
          section_id: "01",
          section_instructor: ["Maksym Morawski"],
          section_days: ["Tue", "Thu"],
          section_start_time: "12:30pm",
          section_end_time: "1:45pm",
          labs: [
            {
              lab_id: "01",
              lab_days: ["Tue", "Thu"],
              lab_start_time: "5:00pm",
              lab_end_time: "5:50pm",
              lab_type: "Discussion",
            },
          ],
        },
      ],
    };

    comm = {
      course_prefix: "COMM",
      course_code: "107B",
      title: "Oral Communication: Principles and Practices",
      credits: "3",
      sections: [
        {
          section_id: "0101",
          section_instructor: ["Melissa Lucas"],
          section_days: ["Tue", "Thu"],
          section_start_time: "12:30pm",
          section_end_time: "1:45pm",
          labs: [],
        },
        {
          section_id: "0201",
          section_instructor: ["Christine Schaaf"],
          section_days: ["Tue", "Thu"],
          section_start_time: "12:30pm",
          section_end_time: "1:45pm",
          labs: [],
        },
      ],
    };

    data = {
      course_prefix: "DATA",
      course_code: "200",
      title: "Knowledge in Society: Science, Data and Ethics",
      credits: "3",
      sections: [
        {
          section_id: "0101",
          section_instructor: ["Fardina Alam"],
          section_days: ["Mon", "Wed", "Fri"],
          section_start_time: "11:00am",
          section_end_time: "11:50am",
          labs: [],
        },
      ],
    };
  });

  test("generateSubSchedules returns empty [schedule] if left pointer > right", () => {
    expect(generateSubSchedules([bio, compsci, comm], 5, 3)).toEqual([]);
  });

  test("generateSubSchedules for a single course generates all combinations of a section and its lab", () => {
    const courses = [compsci];
    const schedule = generateSubSchedules(courses, 0, 0);
    expect(schedule).toHaveLength(getMaxScheduleSize(courses));
  });

  test("generateSubSchedules for a single course generates all combinations of a section with no lab", () => {
    const courses = [data];
    const schedule = generateSubSchedules(courses, 0, 0);

    expect(schedule).toHaveLength(getMaxScheduleSize(courses));
  });

  test("generateSubSchedules does not add zombie schedules", () => {
    const courses = [comm, bio, data];
    const schedule = generateSubSchedules(courses, 0, 2);
    let expectedLength = getMaxScheduleSize(courses);
    expect(schedule.length).toBeLessThanOrEqual(expectedLength);
  });
});

describe("generateSchedules generates valid schedules", () => {
  describe("generateSchdules: unit tests".yellow, () => {
    test("generateSchedules returns empty array when given no courses", () => {
      expect(generateSchedules([])).toHaveLength(0);
    });

    test("generateSchedules generates valid schedules for a single course with multiple sections: no labs", () => {
      const comm = {
        course_prefix: "COMM",
        course_code: "107B",
        title: "Oral Communication: Principles and Practices",
        credits: "3",
        sections: [
          {
            section_id: "0101",
            section_instructor: ["Melissa Lucas"],
            section_days: ["Tue", "Thu"],
            section_start_time: "12:30pm",
            section_end_time: "1:45pm",
            labs: [],
          },
          {
            section_id: "0201",
            section_instructor: ["Christine Schaaf"],
            section_days: ["Tue", "Thu"],
            section_start_time: "12:30pm",
            section_end_time: "1:45pm",
            labs: [],
          },
        ],
      };
      expect(generateSchedules([comm])).toHaveLength(comm.sections.length);
    });

    test("generateSchedules generates valid schedules for a single course with multiple sections: no labs", () => {
      const compsci = {
        course_prefix: "CMSC",
        course_code: "106",
        title: "Introduction to C Programming",
        credits: "4",
        sections: [
          {
            section_id: "01",
            section_instructor: ["Maksym Morawski"],
            section_days: ["Tue", "Thu"],
            section_start_time: "12:30pm",
            section_end_time: "1:45pm",
            labs: [
              {
                lab_id: "01",
                lab_days: ["Tue", "Thu"],
                lab_start_time: "5:00pm",
                lab_end_time: "5:50pm",
                lab_type: "Discussion",
              },
            ],
          },
        ],
      };
      expect(generateSchedules([compsci])).toHaveLength(
        getMaxScheduleSize([compsci])
      );
    });

    test("generateSchedules remove duplicate courses: many duplicates, different courses", () => {
      const bio = {
        course_prefix: "BIOL",
        course_code: "721",
        title: "Mathematical Population Biology",
        credits: "3",
        sections: [
          {
            section_id: "0101",
            section_instructor: ["Abba Gumel"],
            section_days: ["Tue", "Thu"],
            section_start_time: "9:30am",
            section_end_time: "10:45am",
            labs: [],
          },
        ],
      };

      const data = {
        course_prefix: "DATA",
        course_code: "200",
        title: "Knowledge in Society: Science, Data and Ethics",
        credits: "3",
        sections: [
          {
            section_id: "0101",
            section_instructor: ["Fardina Alam"],
            section_days: ["Mon", "Wed", "Fri"],
            section_start_time: "11:00am",
            section_end_time: "11:50am",
            labs: [],
          },
        ],
      };

      const comm = {
        course_prefix: "COMM",
        course_code: "107B",
        title: "Oral Communication: Principles and Practices",
        credits: "3",
        sections: [
          {
            section_id: "0101",
            section_instructor: ["Melissa Lucas"],
            section_days: ["Tue", "Thu"],
            section_start_time: "12:30pm",
            section_end_time: "1:45pm",
            labs: [],
          },
          {
            section_id: "0201",
            section_instructor: ["Christine Schaaf"],
            section_days: ["Tue", "Thu"],
            section_start_time: "12:30pm",
            section_end_time: "1:45pm",
            labs: [],
          },
        ],
      };

      const schedules = generateSchedules([bio, data, bio, comm, comm]);
      /**
       * since the elements of a schedule are scheduleNodes, we can
       * find a unique course by getting the course prefix and id
       * but this alone is not sufficient, as labs would also have the same course prefix and ids
       * to combat this, we can easily add the isLab field to the string stord in the set
       */
      expect(schedules.length).toBeGreaterThan(0);
      schedules.forEach((schedule) => {
        const seenCourses = new Set();
        schedule.forEach((node) => {
          const identifier = `${node.coursePrefix} ${node.courseId} ${node.isLab}}`;
          expect(seenCourses.has(identifier)).toBe(false);
          seenCourses.add(identifier);
        });
      });
    });

    test("generateSchedules remove duplicate courses: two duplicates, one courses", () => {
      // use a course that has multiple sections without time conflicts
      const compsci = {
        course_prefix: "CMSC",
        course_code: "320",
        title: "Introduction to Data Science",
        credits: "3",
        sections: [
          {
            section_id: "0101",
            section_instructor: ["Maksym Morawski"],
            section_days: ["Tue", "Thu"],
            section_start_time: "3:30pm",
            section_end_time: "4:45pm",
            labs: [],
          },
          {
            section_id: "0201",
            section_instructor: ["Fardina Alam"],
            section_days: ["Mon", "Wed"],
            section_start_time: "3:30pm",
            section_end_time: "4:45pm",
            labs: [],
          },
        ],
      };

      const schedules = generateSchedules([compsci, compsci]);
      expect(schedules.length).toBeGreaterThan(0);
      schedules.forEach((schedule) => {
        const seenCourses = new Set();
        schedule.forEach((node) => {
          const identifier = `${node.coursePrefix} ${node.courseId} ${node.isLab}}`;
          expect(seenCourses.has(identifier)).toBe(false);
          seenCourses.add(identifier);
        });
      });
    });

    test("generateSchedules returns emoty array if no schedule could be formed", () => {
      const compsci1 = {
        course_prefix: "CMSC",
        course_code: "398M",
        title:
          "Special Topics in Computer Science; Introduction to Product Design with Figma",
        credits: "1",
        sections: [
          {
            section_id: "0101",
            section_instructor: ["Cliff Bakalian"],
            section_days: ["Fri"],
            section_start_time: "10:00am",
            section_end_time: "10:50am",
            labs: [],
          },
        ],
      };
      const compsci2 = {
        course_prefix: "CMSC",
        course_code: "351H",
        title: "Algorithms",
        credits: "3",
        sections: [
          {
            section_id: "0101",
            section_instructor: ["Emily Kaplitz", "Auguste Gezalyan"],
            section_days: ["Mon", "Wed", "Fri"],
            section_start_time: "10:00am",
            section_end_time: "10:50am",
            labs: [],
          },
        ],
      };

      expect(generateSchedules([compsci1, compsci2])).toHaveLength(0);
    });
  });

  describe("generateSchedules: property-based testing".yellow, () => {
    const interations = []; // each element in the interation is an array of app possible schedules
    const coursesList = []; //used to map each iteration to courses
    // run generate schedule many times on random number of courses for random courses
    beforeAll(() => {
      const numberOfIterations = 100;
      for (let i = 0; i < numberOfIterations; i++) {
        const numberOfCOurses = Math.floor(Math.random() * 16); // max 15 courses
        const courses = [];
        for (let j = 0; j < numberOfCOurses; j++) {
          const courseIndex = Math.floor(
            Math.random() * allCourses.courses.length
          );
          courses.push(allCourses.courses[courseIndex]);
        }
        coursesList.push(courses);
        interations.push(generateSchedules(courses));
      }
    });

    it("should not hav eempty schedules", () => {
      /**
       * this means that the array of all possible schedules should not contain
       * any empty schedules eg. [[]] or [schedule1, schedule 2, ..., [], ..., scheduleN]
       */
      interations.forEach((allSchedules) => {
        expect(allSchedules.every((schedule) => schedule.length > 0)).toBe(
          true
        );
      });
    });

    it("should not generate more courses that the max number", () => {
      interations.forEach((allSchedules, index) => {
        expect(allSchedules.length).toBeLessThanOrEqual(
          getMaxScheduleSize(coursesList[index])
        );
      });
    });

    it("should only include all unique courses in each schedule", () => {
      interations.forEach((allSchedules, index) => {
        const courseSet = new Set(
          coursesList[index].map(
            (course) => `${course.coursePrefix} ${course.courseId}`
          )
        );
        allSchedules.forEach((schedule) => {
          const coursesInSchedule = new Set(
            schedule.map((node) => `${node.coursePrefix} ${node.courseId}`)
          );
          expect(courseSet.keys.length).toEqual(coursesInSchedule.keys.length);
          expect(
            Array.from(courseSet.keys).every((key) =>
              coursesInSchedule.has(key)
            )
          ).toBe(true);
          expect(
            Array.from(coursesInSchedule.keys).every((key) =>
              courseSet.has(key)
            )
          ).toBe(true);
        });
      });
    });

    it("should include a lab in the final schedules for each section that has a lab", () => {
      interations.forEach((allSchedules, index) => {
        allSchedules.forEach((schedule) => {
          /**
           * seenNode stores a unique representation of each node in the schedule
           * for each node in the schedule, find the corresponding course in the courses array
           * then check lookup the section using nodeIndex
           * if the section has labs, ensure that the final schedule has labs
           * by looking through seenNodes for a unique string representation
           * string representation: `${node.coursePrefix}${node.courseId}${node.isLab}`
           * to look for a lab, just change isLab to be true and you have the lab representation of a section
           */
          const seenNodes = new Set(
            schedule.map(
              (node) => `${node.coursePrefix}${node.courseId}${node.isLab}`
            )
          );
          schedule.forEach((node) => {
            if (!node.isLab) {
              // use the node index to link the node to the respective course
              const course = coursesList[index].find(
                (courses) =>
                  courses.course_prefix === node.coursePrefix &&
                  courses.course_code === node.courseId
              );
              expect(Object.keys(course).length).toBeGreaterThan(0);
              const hasLab = course.sections[node.nodeIndex].labs.length > 0;
              if (hasLab) {
                expect(
                  seenNodes.has(`${node.coursePrefix}${node.courseId}true`)
                ).toBe(true);
              }
            }
          });
        });
      });
    });

    it("should generate schedules which do not have time conflicts", () => {
      interations.forEach((allSchedules) => {
        allSchedules.forEach((schedule) =>
          expect(hasConflict(schedule)).toBe(false)
        );
      });
    });
  });
});
