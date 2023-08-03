import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../Navbar/Navbar";
import axios from "axios";
import { AppStateContext } from "../App/App";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ShoppingCart() {
  const { appState, setAppState } = useContext(AppStateContext);
  const [courseInputs, setCourseInputs] = useState([
    { course_prefix: "Select Your Courses", course_code: "Select Course Code" },
  ]);
  const [showError, setShowError] = useState(false);
  const [coursesTableInfo, setCourseTableInfo] = useState([]);
  const [searchText, setSearchText] = useState({ prefix: "", code: "" });

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        // const response = await axios.get("http://localhost:3001/courses");
        const response = await axios.get("https://my-capstone-backend-02def2333679.herokuapp.com/courses");
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
    return Array.from(
      new Set(array.map((course) => course.course_prefix))
    ).sort();
  }

  // takes an array of objects that map to a row in the courses data table and a string corresponding to course prefix
  // returns an output of an array consisting of all the course codes pertaining to the input course prefix
  function getCourseCodesByPrefix(courses, coursePrefix) {
    const courseCodes = new Set();

    courses.forEach((course) => {
      if (course.course_prefix === coursePrefix) {
        courseCodes.add(course.course_code);
      }
    });

    return Array.from(courseCodes);
  }

  const addCourseInput = () => {
    setCourseInputs([
      ...courseInputs,
      {
        course_prefix: "Select Your Courses",
        course_code: "Select Course Code",
      },
    ]);
    setSearchText({ prefix: "", code: "" });
  };

  function handleSearchChange(event) {
    setSearchText({ ...searchText, [event.target.name]: event.target.value });
  }

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

  const handlePrefixChange = (index, prefix) => {
    const updatedInputs = [...courseInputs];
    updatedInputs[index].course_prefix = prefix;
    updatedInputs[index].course_code = "Select Course Code"; // Reset the selected code
    setCourseInputs(updatedInputs);
  };

  // Use the useNavigate hook to get the navigate function
  const navigate = useNavigate();
  const uniqueCoursePrefixes = getUniqueCoursePrefixes(coursesTableInfo);

  const handleGenerate = async () => {
    // Check if all course inputs have both fields filled out
    const hasIncompleteCourses = courseInputs.some(
      (input) =>
        !input.course_prefix ||
        !input.course_code ||
        input.course_prefix === "Select Your Courses" ||
        input.course_code === "Select Course Code"
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
    try {
      const response = await axios.post(
        "https://my-capstone-backend-02def2333679.herokuapp.com/schedules",
        // "http://localhost:3001/schedules",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setAppState({
        ...appState,
        courses: response.data.courses,
        schedules: response.data.schedules,
      });
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
    <div className="overflow-y-scroll bg-gray-700 h-screen box-content w-full">
      <NavBar />
      <div
        className="text-white flex flex-col justify-center items-center mb-8"
        style={{ minHeight: "calc(100vh - 4rem)" }}>
        {/* Set h-full and flex properties */}
        <div className="relative isolate px-6 pt-14 lg:px-8 h-full flex flex-col justify-center items-center w-4/5">
          {/* Set h-full to fill available vertical space */}
          {/* Rest of the background code */}
          <div className="mx-auto max-w-2xl py-16 sm:py-48 lg:py-72 text-center w-full">
            {/* Set py-72 to increase the height for centering */}
            {/* Your text content goes here */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Select Your Courses
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              When you're ready, click Generate
            </p>
            {/* Insertion here */}

            {/* Insertion ends here */}

            {courseInputs.map((input, index) => (
              <div
                key={index}
                className="mt-6 flex flex-col md:flex-row gap-4 items-center">
                <Menu
                  as="div"
                  className="relative inline-block text-center w-full max-w-[18rem] h-10">
                  <div className="h-full">
                    <Menu.Button
                      className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2  font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 h-full"
                      onClick={(e) => {
                        setSearchText({ prefix: "", code: "" })}}>
                      {courseInputs[index].course_prefix}
                      <ChevronDownIcon
                        className="-mr-1 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 z-10 mt-2  origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none w-full">
                      <div className="sticky top-0 left-0 w-full h-12 mt-2 flex item-center justify-center px-2 py-1 pb-2">
                        <label htmlFor="prefix" />
                        <input
                          type="text"
                          name="prefix"
                          id="prefix"
                          placeholder="Search Course Prefix"
                          value={searchText.prefix}
                          onChange={handleSearchChange}
                          className="text-black text-center w-full rounded-sm"
                          autoComplete="off"
                        />
                      </div>
                      <div className="py-2 px-2 max-h-96 overflow-y-scroll">
                        {uniqueCoursePrefixes
                          .filter((prefix) =>
                            prefix
                              .toLowerCase()
                              .includes(searchText.prefix.toLowerCase())
                          )
                          .map((prefix, i, arr) => (
                            <>
                              <Menu.Item>
                                {({ active }) => (
                                  <p
                                    onClick={(e) => {
                                      handlePrefixChange(
                                        index,
                                        e.target.textContent
                                      );
                                    }}
                                    value={prefix}
                                    className={classNames(
                                      active
                                        ? "bg-indigo-500 text-white rounded-sm"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-base font-semibold"
                                    )}>
                                    {prefix}
                                  </p>
                                )}
                              </Menu.Item>
                              {i < arr.length - 1 ? (
                                <div className="divider my-0"></div>
                              ) : undefined}
                            </>
                          ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <Menu
                  as="div"
                  className="relative inline-block text-center w-full max-w-[18rem] h-10">
                  <div className="h-full">
                    <Menu.Button
                      className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2  font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 h-full"
                      onClick={(e) => setSearchText({ prefix: "", code: "" })}>
                      {courseInputs[index].course_code}
                      <ChevronDownIcon
                        className="-mr-1 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 z-10 mt-2  origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none w-full">
                      <div className="sticky top-0 left-0 w-full h-12 mt-2 flex item-center justify-center px-2 py-1 pb-2">
                        <label htmlFor="code" />
                        <input
                          type="text"
                          name="code"
                          placeholder="Search Course Code"
                          value={searchText.code}
                          onChange={handleSearchChange}
                          className="text-black w-full rounded-sm"
                          autoComplete="off"
                        />
                      </div>
                      <div className="py-2 px-2 max-h-96 overflow-y-scroll">
                        {getCourseCodesByPrefix(
                          coursesTableInfo,
                          input.course_prefix
                        )
                          .filter((code) =>
                            code
                              .toLowerCase()
                              .includes(searchText.code.toLowerCase())
                          )
                          .map((code, i, arr) => (
                            <>
                              <Menu.Item>
                                {({ active }) => (
                                  <p
                                    onClick={(e) => {
                                      handleChange(
                                        index,
                                        "course_code",
                                        e.target.textContent
                                      );
                                    }}
                                    value={code}
                                    className={classNames(
                                      active
                                        ? "bg-indigo-500 text-white rounded-sm"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-base font-semibold"
                                    )}>
                                    {code}
                                  </p>
                                )}
                              </Menu.Item>
                              {i < arr.length - 1 ? (
                                <div className="divider my-0"></div>
                              ) : undefined}
                            </>
                          ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
                <button
                  onClick={() => removeCourseInput(index)}
                  className="rounded-md text-white bg-red-500 px-3.5 py-2.5  font-semibold shadow-sm hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-500 flex gap-2 h-10 items-center justify-center">
                  <TrashIcon className="h-5 w-5 inline" />
                  Remove
                </button>
              </div>
            ))}
            {showError && (
              <p className="text-red-300">
                Please complete all your courses or remove any incomplete
                courses.
              </p>
            )}
            <div className=" flex items-center justify-center w-full">
              <button
                onClick={addCourseInput}
                className="rounded-md text-white bg-indigo-500 px-3.5 py-2.5  font-semibold shadow-sm mt-4 hover:bg-indigo-400 focus:outline-none focus:ring focus:ring-indigo-500 flex gap-2">
                <PlusIcon className="w-5 h-5 inline" />
                Add Another Course
              </button>
            </div>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGenerate}
                className="rounded-md text-white bg-indigo-500 px-3.5 py-2.5  font-semibold shadow-sm hover:bg-indigo-400 focus:outline-none focus:ring focus:ring-indigo-500">
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
