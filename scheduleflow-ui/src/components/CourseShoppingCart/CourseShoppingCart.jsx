import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../../../capstone-ui/src/components/Navbar";
import axios from "axios";
import { AppStateContext } from "../App/App";

export default function ShoppingCart() {
  const {appState, setAppState} = useContext(AppStateContext)
  const [courseInputs, setCourseInputs] = useState([
    { course_prefix: "", course_code: "" },
  ]);
  const [showError, setShowError] = useState(false);
  const [coursesTableInfo, setCourseTableInfo] = useState([]);

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/courses");
        setCourseTableInfo([...coursesTableInfo, ...response.data]);
        return response.data; // The response.data is already an array
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    };
    fetchCoursesData();
  }, []);

  // takes an array of objects that map to a row in the courses data table
  // returns an output of an array of unique course prefixes
  function getUniqueCoursePrefixes(array) {
    return Array.from(new Set(array.map(course => course.course_prefix))).sort()
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
    setCourseInputs([...courseInputs, { course_prefix: "", course_code: "" }]);
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
    updatedInputs[index].course_prefix = prefix;
    updatedInputs[index].course_code = ""; // Reset the selected code
    setCourseInputs(updatedInputs);
  };

  // Use the useNavigate hook to get the navigate function
  const navigate = useNavigate();

  const handleGenerate = async () => {
    // Check if all course inputs have both fields filled out
    const hasIncompleteCourses = courseInputs.some(
      (input) => !input.course_prefix || !input.course_code
    );

    if (hasIncompleteCourses) {
      // Display error message if any course input is incomplete
      setShowError(true);
      return;
    }
    // Hide the error message if all courses are complete
    setShowError(false);

    // Your logic for generating the schedule goes here
    // For now, we will just store the course inputs in local storage
    localStorage.setItem("course_keys", JSON.stringify(courseInputs));
    const requestBody = {
      courses: JSON.parse(localStorage.getItem("course_keys")),
    };
    console.log(requestBody);

    try {
      const response = await axios.post(
        "http://localhost:3001/schedules",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setAppState({...appState, courses: response.data.courses, schedules: response.data.schedules})
      localStorage.setItem("courses", JSON.stringify(response.data.courses));
      localStorage.setItem(
        "schedules",
        JSON.stringify(response.data.schedules)
      );

      // Navigate to the schedule page using the navigate function
      navigate("/schedule");
    } catch (error) {
      console.error("Error:", error);
    }
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
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Select Your Courses
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              When you're ready, click Generate
            </p>
            {courseInputs.map((input, index) => (
              <div key={index} className="mt-6 flex items-center">
                <select
                  value={input.course_prefix}
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
                  value={input.course_code}
                  onChange={(e) =>
                    handleChange(index, "course_code", e.target.value)
                  }
                  className="rounded-md bg-white w-full px-16 py-2 text-black text-sm font-semibold shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 ml-2"
                >
                  {/* Dropdown 2 options */}
                  <option value="">Select Course Code</option>
                  {getCourseCodesByPrefix(
                    coursesTableInfo,
                    input.course_prefix
                  ).map((code) => (
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
            {showError && (
              <p className="text-red-500">
                Please complete all your courses or remove any incomplete
                courses.
              </p>
            )}
            <button
              onClick={addCourseInput}
              className="rounded-md text-white bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold shadow-sm mt-4 hover:bg-indigo-400 focus:outline-none focus:ring focus:ring-indigo-500"
            >
              + Add Another Course
            </button>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGenerate}
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
