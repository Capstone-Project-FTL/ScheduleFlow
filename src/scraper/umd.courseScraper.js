const puppeteer = require("puppeteer");
const fs = require("fs");
const filename = "./umd.static.db.json";
const prefixes = require("./umd.prefixes.json");
const { daysOfWeek } = require("./utilities");
require("colors");

/** Updated as observed
 * UMD Website structure:
 * Course Name: [course prefix][course number]
 * Credits: number || [number - number]
 * Days: [M][Tu][W][Th][F] one or more, no space
 * Instructors: instructor || [instructor, ..., instructor] || Instructor: TBA
 *
 *
 * The most essential fields in both the labs and sections are the days, start time and end time
 * if any of this info is missing, we remove the course
 */

// umd representation of the days of the week
const umdDaysOfWeek = {
  M: daysOfWeek.Monday,
  Tu: daysOfWeek.Tuesday,
  W: daysOfWeek.Wednesday,
  Th: daysOfWeek.Thursday,
  F: daysOfWeek.Friday,
};

/**
 * given the container for all sections, the function extracts the sections info and
 * returns the sections as an array of section objects
 * @typedef section
 * @property {String} section_id the section identifier
 * @property {String} section_instructor the sections instructor
 * @property {String} section_days the days for the section
 * @property {String} start_time section start time
 * @property {String} end_time section end time
 * @param {String} sectionContainers an array of NodeLists
 * @param {int} child used to locate labs (if course is blended then labs are the third row )
 * @returns {[section]} An array of all sections
 */
const getSections = (sectionContainers, child, umdDaysOfWeek) => {
  /**
   * this method extracts the lab information from the lab container
   * @param {Element} labContainer the element containing the lab info
   * @param {String} labId the lab id
   * @return {Lab}
   */

  /**
   *
   * @param {String} daysText represents the days of the week text
   * @param {Object} umdDaysOfWeek mapsumd representation to our standard representation
   * @returns {Array} the days for the section or lab
   */
  const getDays = (daysText, umdDaysOfWeek) => {
    return daysText
      ? Object.keys(umdDaysOfWeek)
          .map((day) =>
            daysText.indexOf(day) >= 0 ? umdDaysOfWeek[day] : null
          )
          .filter((day) => day)
      : [];
  };

  const getLab = (labContainer, labId) => ({
    lab_id: labId,
    lab_days: getDays(
      labContainer.querySelector(".section-days")?.innerText,
      umdDaysOfWeek
    ),
    lab_start_time: labContainer.querySelector(".class-start-time")?.innerText,
    lab_end_time: labContainer.querySelector(".class-end-time")?.innerText,
    lab_type: labContainer.querySelector(".class-type")?.innerText,
  });

  /**
   * algorithm expalnation: by the nature of the page, if we are still in the current section
   * then any encountered lab should be added to the current section
   * if not, we create a new seciton object
   */
  let currSectionId = ""; // stores the id of the current section
  let currSection = null;
  return sectionContainers.map((sectionHTML) => {
    const contentId = sectionHTML.querySelector(".section-id").innerText;
    const hasLab =
      sectionHTML.querySelector(
        `.row:nth-child(${child})>.section-day-time-group`
      ) != null;
    let sectionId = hasLab ? contentId.substring(0, 2) : contentId;
    if (sectionId === currSectionId && hasLab) {
      currSection.labs.push(
        getLab(
          sectionHTML.querySelector(`.row:nth-child(${child})`),
          contentId.substring(2)
        )
      );
    } else {
      currSectionId = sectionId;
      const start_time =
        sectionHTML.querySelector(".class-start-time")?.innerText;
      const end_time = sectionHTML.querySelector(".class-end-time")?.innerText;
      currSection = {
        section_id: sectionId,
        section_instructor: Array.from(
          sectionHTML.querySelectorAll(".section-instructor")
        ).map((instructorDiv) => instructorDiv.innerText),
        section_days: getDays(
          sectionHTML.querySelector(".section-days")?.innerText,
          umdDaysOfWeek
        ),
        section_start_time: start_time,
        section_end_time: end_time,
        labs: hasLab
          ? [
              getLab(
                sectionHTML.querySelector(`.row:nth-child(${child})`),
                contentId.substring(2)
              ),
            ]
          : [],
      };
      return currSection;
    }
  });
};

/**
 * this cleans each course by ensuring that each array is flattened and
 * all objects have essential fields
 * @param {[courses]} courses the courses to tidy
 * @return {[courses]} an array of coures that have been cleaned
 */
const clean = (courses) => {
  return courses.filter((course) => {
    // make sure labs are flattened and have essential fields

    // make sure the sections are flattened and that each setion has the essential fields
    course.sections = course.sections
      .flat()
      .filter(
        (section) =>
          section &&
          section.section_days &&
          section.section_start_time &&
          section.section_end_time
      );

    course.sections.forEach((section) => {
      section.labs = section.labs
        ?.flat()
        .filter(
          (lab) => lab && lab.lab_days && lab.lab_start_time && lab.lab_end_time
        );
    });

    return course && course.sections.length && Object.keys(course).length >= 5;
  });
};

/**
 * @typedef courses
 * @param {String} url the url to scrape
 * @returns {[courses]} an array of FACE TO FACE courses which have at least one section
 */
const extract = async (url) => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: false,
  });
  const [page] = await browser.pages();
  await page.goto(url);

  /**
   * PAGE SPECIFIC: this exposes the drop down to show all sections for every course
   * dynamically changing the html code
   */
  const showAllSections = await page.waitForSelector(
    "#show-all-sections-button"
  );
  await showAllSections.click();
  await page.waitForSelector(".section"); // wait for the sections to load first

  const courseContainers = await page.$$(".course"); //TODO change to $$
  const courses = await Promise.all(
    Array.from(courseContainers).map(async (courseContainer) => {
      const result = {};
      /**
       * PAGE SPECIFIC: umd as of last review represents their course name as [prefix][id] with no spaces
       */
      result.course_prefix = await page.$eval(
        ".course-prefix-abbr",
        (e) => e.textContent
      );
      result.course_code = await courseContainer.$eval(
        ".course-id",
        (e, prefix) => e.textContent.substring(prefix.length),
        result.course_prefix
      );
      result.title = await courseContainer.$eval(
        ".course-title",
        (e) => e.textContent
      );
      result.credits = await courseContainer.$eval(
        ".course-min-credits",
        (e) => e.textContent
      );
      result.sections = await courseContainer.$$eval(
        ".section.delivery-f2f",
        getSections,
        2,
        umdDaysOfWeek
      );
      result.sections.push(
        await courseContainer.$$eval(
          ".section.delivery-blended",
          getSections,
          3,
          umdDaysOfWeek
        )
      );
      return result;
    })
  );
  await browser.close();
  return { courses: clean(courses) };
};
// const url = "https://app.testudo.umd.edu/soc/202308/CMSC";
// const url = "https://app.testudo.umd.edu/soc/202308/DATA";
// const url = "https://app.testudo.umd.edu/soc/202308/HLSC";
// const url = "https://app.testudo.umd.edu/soc/202308/COMM";
// const url = "https://app.testudo.umd.edu/soc/202308/CHIN";
// const url = "https://app.testudo.umd.edu/soc/202308/BIOM";
const baseURL = "https://app.testudo.umd.edu/soc/202308/";

(async () => {
  let pass = false
  for (let prefix of prefixes) {
    // if(prefix === "BMGT"){
    //   pass = true
    //   continue
    // }
    // if(!pass) continue
    const url = baseURL + prefix;
    await extract(url).then((res) => {
      if (fs.existsSync(filename)) {
        const db = require(filename);
        db.courses.push(...res.courses);
        db.allCourseCount = db.courses.length;
        fs.writeFile(filename, JSON.stringify(db, null, 2), (error) => {
          if (error) console.error(error.message.red);
          console.log(`${prefix} added successfully`.green);
        });
      } else {
        res.allCourseCount = res.courses.length;
        fs.writeFile(filename, JSON.stringify(res, null, 2), (error) => {
          if (error) console.error(`${error.message} at ${prefix}`.red);
          console.log(`${prefix} added successfully`.green);
        });
      }
    }).catch(error=>console.log(prefix))
  };
})()
