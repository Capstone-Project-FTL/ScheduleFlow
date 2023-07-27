import React, { useState } from 'react';
import NavBar from '../../../../capstone-ui/src/components/Navbar';
import coursesTableInfoObject from './static_courses.json'

export default function ShoppingCart() {
  const [courseInputs, setCourseInputs] = useState([{ selectedPrefix: '', selectedCode: '' }]);

  // mocking courses info that will be stored in local storage
  const coursesTableInfo = coursesTableInfoObject.courses

  // takes an array of objects that map to a row in the courses data table
  // returns an output of an array of unique course prefixes
  function getUniqueCoursePrefixes(array) {
    const uniquePrefixes = [];

    array.forEach((course) => {
      if (!uniquePrefixes.includes(course.course_prefix)) {
        uniquePrefixes.push(course.course_prefix);
      }
    });

    return uniquePrefixes;
  }

  // takes an array of objects that map to a row in the courses data table and a string corresponding to course prefix 
  // returns an output of an array consisting of all the course codes pertaining to the input course prefix
  function getCourseCodesByPrefix(courses, coursePrefix) {
    const courseCodes = [];

    courses.forEach((course) => {
      if (course.course_prefix === coursePrefix) {
        courseCodes.push(course.course_code);
      }
    });

    return courseCodes;
  }

  const addCourseInput = () => {
    setCourseInputs([...courseInputs, { selectedPrefix: '', selectedCode: '' }]);
  };

  const removeCourseInput = (index) => {
    const updatedInputs = [...courseInputs];
    updatedInputs.splice(index, 1);
    setCourseInputs(updatedInputs);
  };

  const handleChange = (index, field, value) => {
    const updatedInputs = [...courseInputs];
    updatedInputs[index][field] = value;
    setCourseInputs(updatedInputs);
  };

  const uniqueCoursePrefixes = getUniqueCoursePrefixes(coursesTableInfo);

  const handlePrefixChange = (index, prefix) => {
    const updatedInputs = [...courseInputs];
    updatedInputs[index].selectedPrefix = prefix;
    updatedInputs[index].selectedCode = ''; // Reset the selected code
    setCourseInputs(updatedInputs);
  };

  return (
    <>
      <NavBar />
      <div className="bg-gray-800 text-white h-full flex flex-col justify-center items-center">
        {/* Set h-full and flex properties */}
        <div className="relative isolate px-6 pt-14 lg:px-8 h-full flex flex-col justify-center items-center">
          {/* Set h-full to fill available vertical space */}
          {/* Rest of the background code */}
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-72 text-center">
            {/* Set py-72 to increase the height for centering */}
            {/* Your text content goes here */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Select Your Courses</h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">When you're ready, click Generate</p>
            {courseInputs.map((input, index) => (
              <div key={index} className="mt-6 flex items-center">
                <select
                  value={input.selectedPrefix}
                  onChange={(e) => handlePrefixChange(index, e.target.value)}
                  className="rounded-md bg-white w-full px-16 py-2 text-black text-sm font-semibold shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
                >
                  {/* Dropdown 1 options */}
                  <option value="">Select Course Prefix</option>
                  {uniqueCoursePrefixes.map((prefix) => (
                    <option key={prefix} value={prefix}>
                      {prefix}
                    </option>
                  ))}
                </select>
                <select
                  value={input.selectedCode}
                  onChange={(e) => handleChange(index, 'selectedCode', e.target.value)}
                  className="rounded-md bg-white w-full px-16 py-2 text-black text-sm font-semibold shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 ml-2"
                >
                  {/* Dropdown 2 options */}
                  <option value="">Select Course Code</option>
                  {getCourseCodesByPrefix(coursesTableInfo, input.selectedPrefix).map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeCourseInput(index)}
                  className="rounded-md text-white bg-red-500 px-3.5 py-2.5 text-sm font-semibold shadow-sm ml-2 hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addCourseInput}
              className="rounded-md text-white bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold shadow-sm mt-4 hover:bg-indigo-400 focus:outline-none focus:ring focus:ring-indigo-500"
            >
              + Add Another Course
            </button>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => {
                  // Handle the logic for generating the schedule based on the inputs
                }}
                className="rounded-md text-white bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring focus:ring-indigo-500"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}