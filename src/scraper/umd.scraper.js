const puppeteer = require("puppeteer");
const fs = require("fs");
const filename = "./umd.static.db.json"
const db = require(filename);

/** Updated as observed
 * UMD Website outline:
 * Course Name: [course prefix][course number]
 * Credits: number || [number - number]
 * Days: [M][Tu][W][Th][F] one or more, no space
 * Instructors: instructor || [instructor, ..., instructor] || Instructor: TBA
 *
 * The most essential fields in both the labs and sections are the days, start time and end time
 * if any of this info is missing, we remove the course
 */

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
const getSections = (sectionContainers, child) => {
  /**
   * this method extracts the lab information from the lab container
   * @param {Element} labContainer the element containing the lab info
   * @param {String} labId the lab id
   * @return {Lab}
   */
  const getLab = (labContainer, labId) => ({
    lab_id: labId,
    lab_days: labContainer.querySelector(".section-days")?.innerText,
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
        section_days: sectionHTML.querySelector(".section-days")?.innerText,
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

    course.sections.forEach((section) => {
      section.labs = section.labs
        ?.flat()
        .filter(
          (lab) => lab && lab.lab_days && lab.lab_start_time && lab.lab_end_time
        );
    });

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

    return course && course.sections.length && Object.keys(course).length >= 5;
  });
};

/**
 *
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
      result.course_id = await courseContainer.$eval(
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
        2
      );
      result.sections.push(
        await courseContainer.$$eval(
          ".section.delivery-blended",
          getSections,
          3
        )
      );
      return result;
    })
  );
  await browser.close();
  // return courses.filter((course) => course && course.sections.flat().length);
  return {courses: clean(courses)};
};
// const url = "https://app.testudo.umd.edu/soc/202308/CMSC";
// const url = "https://app.testudo.umd.edu/soc/202308/DATA";
// const url = "https://app.testudo.umd.edu/soc/202308/HLSC";
// const url = "https://app.testudo.umd.edu/soc/202308/COMM"
const url = "https://app.testudo.umd.edu/soc/202308/CHIN";
extract(url).then((res) =>{
  fs.writeFile(filename, )
}
);
// const result = (async() => await extract(url))()
// console.log(result)
