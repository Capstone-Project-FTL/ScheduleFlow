import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ModalContext } from "./ScheduleContentGrid";

export default function CardModal({ currentNode }) {
  const { isOpen, setIsOpen } = useContext(ModalContext);
  const cancelButtonRef = useRef(null);
  const courses = JSON.parse(localStorage.getItem("courses"));
  const currCourse = courses.find(
    (course) =>
      course.course_prefix === currentNode.coursePrefix &&
      course.course_code === currentNode.courseCode
  );

  const getMinHourTime = (timeStr) => {
    const time = new Date(timeStr);
    return `${String(time.getUTCHours()).padStart(2, "0")}:${String(
      time.getUTCMinutes()
    ).padStart(2, "0")}`;
  };

  const getCourseDescription = (currCourse, node) => {
    return currCourse ? (
      <div className="text-neutral-800 font-semibold">
        <p>
          Course Prefix: &nbsp;
          <span className="font-normal">{currCourse.course_prefix}</span>
        </p>
        <p>
          Course Code: &nbsp;
          <span className="font-normal">{currCourse.course_code}</span>
        </p>
        <p>
          Course Title: &nbsp;
          <span className="font-normal">{currCourse.course_title}</span>
        </p>
        <p>
          Class Type: &nbsp;
          <span className="font-normal">
            {currentNode.isLab ? "Lab/Discussion" : "Section"}
          </span>
        </p>
        <p>
          Days: &nbsp;
          <span className="font-normal">{node.days.join(", ")}</span>
        </p>
        <p>
          Start Time: &nbsp;
          <span className="font-normal">{getMinHourTime(node.startTime)}</span>
        </p>
        <p>
          End Time: &nbsp;
          <span className="font-normal">{getMinHourTime(node.endTime)}</span>
        </p>
        <div className="flex">
          <p>{!currentNode.isLab ? "Instructor(s):": ""} &nbsp;&nbsp;</p>
          <div>

          {currentNode.instructors.map((instructorObj) => (
          <p className="font-medium">
            {instructorObj.name} {">> "}
            <span className="font-normal">
              Rating ({instructorObj.rating ?? "Not Found"})
            </span>
          </p>
        ))}
          </div>
        </div>
      </div>
    ) : (
      ""
    );
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-indigo-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="flex flex-shrink-0 justify-center rounded-fullsm:mx-0 sm:h-10 sm:w-10">
                      <InformationCircleIcon
                        className="h-8 w-8 text-indigo-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-left sm:ml-2 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-bold leading-6 text-black">
                        More Information
                      </Dialog.Title>
                      <div className="mt-2">
                        {getCourseDescription(currCourse, currentNode)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    onClick={() => setIsOpen(false)}>
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
