const puppeteer = require("puppeteer");

const extract = async (url) => {

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
  });
  const [page] = await browser.pages();
  await page.goto(url);
  
    const showAllSections = await page.waitForSelector("#show-all-sections-button")
    await showAllSections.click()
  
  await page.locator("#show-all-sections-button").click();
//   await page.exposeFunction("getSections", getSections)
await page.waitForSelector(".section")
  const courses = await page.evaluate( async () => {

    const getSections = async (courseContainer) => {
        const sectionContainer = courseContainer.querySelectorAll(".section");
        const seenSections = new Set();
        const labs = [];
        return Array.from(sectionContainer).map((sectionHTML) => {
            const contentId = sectionHTML.querySelector(".section-id").innerText
            const sectionId = contentId.substring(0, 2);
            const labId = contentId.substring(2);
            if(seenSections.has(sectionId)){}
            else{
                seenSections.add(sectionId)
                return {
                    sectionId: sectionId,
                    sectionInstructor: sectionHTML.querySelector(".section-instructor").innerText,
                    sectionDays: sectionHTML.querySelector(".section-days").innerText

                }
            }
        }).filter(course => course)
      };

    const courseContainer = document.querySelector(".course");
    return {
      "course id": courseContainer.querySelector(".course-id")?.innerText,
      "course title": courseContainer.querySelector(".course-title")?.innerText,
      "course credits": courseContainer.querySelector(".course-min-credits")
        ?.innerText,
      "course sections":  await getSections(courseContainer),
    };
  });

  console.log(courses);

  await browser.close();
};

const url = "https://app.testudo.umd.edu/soc/202308/CMSC";
extract(url);